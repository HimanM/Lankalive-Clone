from flask import Blueprint, jsonify, request, current_app
from app.config.session import SessionLocal
from app.services.media_service import MediaService
from app.models.media import MediaAsset
import os
from werkzeug.utils import secure_filename
from datetime import datetime

bp = Blueprint('media', __name__, url_prefix='/api/media')

UPLOAD_DIR = os.getenv('UPLOAD_DIR', None) or os.path.join(os.getcwd(), 'static', 'uploads')


@bp.route('/', methods=['GET'])
def list_media():
    with SessionLocal() as session:
        svc = MediaService(session)
        medias = svc.list()
        return jsonify([{'id': str(m.id), 'url': m.url, 'file_name': m.file_name} for m in medias])


@bp.route('/upload', methods=['POST'])
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
    rel_url = os.path.relpath(path, os.getcwd()).replace('\\', '/')
    m = MediaAsset(type='image', file_name=filename, url='/' + rel_url)
    with SessionLocal() as session:
        svc = MediaService(session)
        created = svc.create(m)
        return jsonify({'id': str(created.id), 'url': created.url}), 201
