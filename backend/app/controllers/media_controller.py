from flask import Blueprint, jsonify, request, current_app
from app.config.session import SessionLocal
from app.services.media_service import MediaService
from app.models.media import MediaAsset
from app.controllers.decorators import requires_role
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from PIL import Image
from uuid import UUID

bp = Blueprint('media', __name__, url_prefix='/api/media')

# Get the backend directory (parent of app directory)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.getenv('UPLOAD_DIR', None) or os.path.join(BACKEND_DIR, 'static', 'uploads')


@bp.route('/', methods=['GET'])
@requires_role('admin')
def list_media():
    q = request.args.get('q')
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))
    with SessionLocal() as session:
        svc = MediaService(session)
        medias = svc.list(limit=limit, offset=offset, q=q)
        return jsonify([
            {
                'id': str(m.id),
                'url': m.url,
                'file_name': m.file_name,
                'mime_type': m.mime_type,
                'width': m.width,
                'height': m.height,
                'alt_text': m.alt_text,
                'caption': m.caption,
                'credit': m.credit,
                'created_at': m.created_at.isoformat() if m.created_at else None,
            }
            for m in medias
        ])


@bp.route('/upload', methods=['POST'])
@requires_role('admin')
def upload_media():
    if 'file' not in request.files:
        return jsonify({'error': 'no file'}), 400
    f = request.files['file']
    filename = secure_filename(f.filename)
    today = datetime.utcnow()
    target_dir = os.path.join(UPLOAD_DIR, str(today.year), f"{today.month:02d}")
    os.makedirs(target_dir, exist_ok=True)
    path = os.path.join(target_dir, filename)
    f.save(path)
    # Generate URL relative to static folder
    rel_path = os.path.relpath(path, os.path.join(BACKEND_DIR, 'static')).replace('\\', '/')
    rel_url = '/static/' + rel_path
    
    # Extract image dimensions
    width, height = None, None
    try:
        with Image.open(path) as img:
            width, height = img.size
    except Exception as e:
        print(f"Could not extract dimensions: {e}")
    
    # optional metadata fields supplied as form fields
    mime_type = f.mimetype if hasattr(f, 'mimetype') else None
    alt_text = request.form.get('alt_text')
    caption = request.form.get('caption')
    credit = request.form.get('credit')

    m = MediaAsset(
        type='image',
        file_name=filename,
        url=rel_url,  # Already has /static/ prefix
        mime_type=mime_type,
        width=width,
        height=height,
        alt_text=alt_text,
        caption=caption,
        credit=credit,
    )
    with SessionLocal() as session:
        svc = MediaService(session)
        created = svc.create(m)
        return jsonify({
            'id': str(created.id),
            'url': created.url,
            'file_name': created.file_name,
            'mime_type': created.mime_type,
            'width': created.width,
            'height': created.height,
            'alt_text': created.alt_text,
            'caption': created.caption,
            'credit': created.credit,
            'created_at': created.created_at.isoformat() if created.created_at else None,
        }), 201


@bp.route('/<media_id>/check-usage', methods=['GET'])
@requires_role('admin')
def check_media_usage(media_id):
    """Check if media is used in any published articles"""
    try:
        media_uuid = UUID(media_id)
    except ValueError:
        return jsonify({'error': 'invalid media id'}), 400
    
    with SessionLocal() as session:
        svc = MediaService(session)
        media = svc.get(media_uuid)
        if not media:
            return jsonify({'error': 'media not found'}), 404
        
        usage_info = svc.check_usage_in_published_articles(media)
        return jsonify(usage_info)


@bp.route('/<media_id>', methods=['DELETE'])
@requires_role('admin')
def delete_media(media_id):
    """Delete media if not used in published articles"""
    try:
        media_uuid = UUID(media_id)
    except ValueError:
        return jsonify({'error': 'invalid media id'}), 400
    
    with SessionLocal() as session:
        svc = MediaService(session)
        media = svc.get(media_uuid)
        if not media:
            return jsonify({'error': 'media not found'}), 404
        
        # Check if media is used in published articles
        usage_info = svc.check_usage_in_published_articles(media)
        if not usage_info['can_delete']:
            return jsonify({
                'error': 'Cannot delete media used in published articles',
                'articles': usage_info['articles']
            }), 400
        
        # Delete the physical file if it exists
        if media.url:
            try:
                # Convert URL to file path
                # URL format: /static/uploads/2025/10/filename.jpg
                rel_path = media.url.replace('/static/', '')
                file_path = os.path.join(BACKEND_DIR, 'static', rel_path.replace('/', os.sep))
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file: {e}")
        
        # Delete from database
        svc.delete(media)
        return jsonify({'message': 'Media deleted successfully'}), 200
