# Static File Serving Fix

## Problem
Images uploaded through the media system were not displaying because:
1. Flask's static folder was configured with a relative path that could vary based on the working directory
2. No explicit route was set up for serving uploaded files
3. Frontend components were using relative URLs without prepending the backend server URL

## Solution Overview

### Backend Changes (Flask)

#### 1. **`backend/app/app.py`** - Fixed Static Folder Configuration
```python
def create_app():
    # Set static_folder to absolute path relative to backend directory
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    app = Flask(__name__, static_folder=static_dir, static_url_path='/static')

    # Add route to serve uploaded files
    @app.route('/static/uploads/<path:filename>')
    def serve_upload(filename):
        uploads_dir = os.path.join(static_dir, 'uploads')
        return send_from_directory(uploads_dir, filename)
```

**Changes:**
- Changed from relative `'static'` to absolute path: `backend/static/`
- Added `static_url_path='/static'` to explicitly set the URL prefix
- Created dedicated route `/static/uploads/<path:filename>` to serve uploaded files using `send_from_directory`

#### 2. **`backend/app/controllers/media_controller.py`** - Fixed Upload Path & URL Generation
```python
# Get the backend directory (parent of app directory)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.getenv('UPLOAD_DIR', None) or os.path.join(BACKEND_DIR, 'static', 'uploads')
```

```python
# Generate URL relative to static folder
rel_path = os.path.relpath(path, os.path.join(BACKEND_DIR, 'static')).replace('\\', '/')
rel_url = '/static/' + rel_path
```

```python
m = MediaAsset(
    # ... other fields
    url=rel_url,  # Already has /static/ prefix, no need for extra '/'
)
```

**Changes:**
- Changed from `os.getcwd()` (unreliable) to `BACKEND_DIR` (absolute path)
- Fixed URL generation to create proper `/static/uploads/2025/10/filename.png` format
- Removed duplicate `/` prefix in MediaAsset creation

### Frontend Changes

#### 1. **Created `frontend/src/utils/image.js`** - Image URL Helper
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export function getImageUrl(url) {
  if (!url) return ''
  
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If relative URL, prepend API base
  return API_BASE + url
}
```

**Purpose:**
- Convert relative URLs (`/static/uploads/...`) to absolute URLs (`http://127.0.0.1:8000/static/uploads/...`)
- Handle both local development and production environments
- Support external URLs (already absolute)

#### 2. **Updated All Components to Use `getImageUrl()`**

Updated the following files to import and use `getImageUrl()`:
- ✅ `frontend/src/components/ArticleCard.jsx`
- ✅ `frontend/src/pages/Article.jsx`
- ✅ `frontend/src/pages/Home.jsx`
- ✅ `frontend/src/pages/ArticleEditor.jsx`
- ✅ `frontend/src/pages/ArticlesList.jsx`
- ✅ `frontend/src/pages/Media.jsx`

**Example usage:**
```jsx
// Before
<img src={article.hero_image_url} alt={article.title} />

// After
import { getImageUrl } from '../utils/image'
<img src={getImageUrl(article.hero_image_url)} alt={article.title} />
```

## Directory Structure

```
D:\Lankalive\
├── backend/
│   ├── app/
│   │   ├── app.py          # Flask app with static config
│   │   ├── controllers/
│   │   │   └── media_controller.py
│   │   └── ...
│   └── static/             # Static files directory
│       └── uploads/        # Uploaded media files
│           └── 2025/
│               └── 10/
│                   └── Logo_Icon_2.png
└── frontend/
    └── src/
        ├── utils/
        │   └── image.js    # Image URL helper
        └── ...
```

## How It Works

### Upload Flow
1. User uploads file via `/api/media/upload`
2. File is saved to `backend/static/uploads/2025/10/filename.png`
3. Database stores URL as `/static/uploads/2025/10/filename.png`
4. API returns the same URL to the frontend

### Display Flow
1. Frontend receives image URL: `/static/uploads/2025/10/filename.png`
2. `getImageUrl()` converts it to: `http://127.0.0.1:8000/static/uploads/2025/10/filename.png`
3. Browser requests image from Flask backend
4. Flask's `/static/uploads/<path:filename>` route serves the file using `send_from_directory`

## Testing

### 1. Upload a New Image
```bash
# Through the admin panel at http://localhost:5173/admin/media
1. Go to Media page
2. Select a file
3. Click Upload
4. Verify success message shows URL: /static/uploads/2025/10/filename.png
```

### 2. Verify File Exists
```powershell
Test-Path "D:\Lankalive\backend\static\uploads\2025\10\filename.png"
# Should return: True
```

### 3. Test Direct Access
```
Open in browser: http://localhost:8000/static/uploads/2025/10/filename.png
# Should display the image
```

### 4. Test in Article
```bash
1. Create/edit an article
2. Add the image URL or select from media picker
3. Save article
4. View article on public site
5. Verify image displays correctly
```

## Environment Variables

### Backend
```bash
# Optional: Override upload directory
UPLOAD_DIR=/custom/path/to/uploads
```

### Frontend
```bash
# Development (default)
VITE_API_BASE=http://127.0.0.1:8000

# Production (example)
VITE_API_BASE=https://api.yourdomain.com
```

## Troubleshooting

### Images Not Displaying
1. **Check file exists:**
   ```powershell
   Get-ChildItem "D:\Lankalive\backend\static\uploads" -Recurse
   ```

2. **Check Flask is serving static files:**
   ```
   Visit: http://localhost:8000/static/uploads/2025/10/test.txt
   ```

3. **Check browser console for errors:**
   - Look for 404 errors
   - Check the full URL being requested

4. **Verify CORS is enabled:**
   - Flask should allow requests from frontend origin (http://localhost:5173)

### Upload Fails
1. **Check directory permissions:**
   - Ensure `backend/static/uploads/` is writable

2. **Check authentication:**
   - Upload requires admin token
   - Verify token is valid and not expired

3. **Check file size limits:**
   - Flask has default size limits for uploads
   - May need to configure `MAX_CONTENT_LENGTH`

### Wrong URLs in Database
If old images have wrong URLs (e.g., missing `/static/` prefix), update them:
```sql
-- Fix URLs missing /static/ prefix
UPDATE media_assets 
SET url = '/static/' || url 
WHERE url NOT LIKE '/static/%' AND url NOT LIKE 'http%';
```

## Production Considerations

### 1. Use a CDN or Object Storage
For production, consider storing uploaded files on:
- AWS S3
- Azure Blob Storage
- Google Cloud Storage
- Cloudflare R2

Update `media_controller.py` to upload to cloud storage instead of local filesystem.

### 2. Nginx for Static Files
In production, use Nginx to serve static files instead of Flask:
```nginx
location /static/ {
    alias /path/to/backend/static/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 3. Environment-Specific URLs
Set appropriate `VITE_API_BASE` for each environment:
```bash
# .env.development
VITE_API_BASE=http://localhost:8000

# .env.production
VITE_API_BASE=https://api.lankalive.lk
```

### 4. Image Optimization
Consider adding image processing:
- Resize images on upload
- Generate thumbnails
- Compress images
- Extract width/height metadata

Libraries to use:
- Python: `Pillow` (PIL)
- Node.js: `sharp`

## Security Notes

1. **File Type Validation:** Add server-side validation to only allow image types
2. **File Size Limits:** Set `MAX_CONTENT_LENGTH` in Flask config
3. **Filename Sanitization:** Already using `secure_filename()` ✅
4. **Virus Scanning:** Consider adding virus scanning for uploaded files
5. **Access Control:** Current setup allows public access to uploaded files

## Next Steps

- [ ] Add image width/height extraction (requires Pillow)
- [ ] Add thumbnail generation for large images
- [ ] Add image optimization/compression
- [ ] Consider cloud storage for production
- [ ] Add file type and size validation
- [ ] Add image alt text editing interface
