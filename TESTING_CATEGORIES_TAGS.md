# Testing Categories and Tags Junction Tables

## What Was Fixed

### Backend Changes (article_controller.py)

1. **CREATE Article** - Now handles `category_ids` and `tag_ids` arrays:
   ```python
   # Frontend sends:
   {
     "category_ids": ["uuid1", "uuid2", ...],
     "tag_ids": ["uuid1", "uuid2", ...]
   }
   
   # Backend queries and assigns to junction tables:
   categories = session.query(Category).filter(Category.id.in_(...)).all()
   article.categories = categories
   ```

2. **UPDATE Article** - Now clears and reassigns to avoid duplicates:
   ```python
   # Clear existing relationships first
   article.categories.clear()
   session.flush()  # Important: flush the clear operation
   
   # Then add new relationships
   article.categories.extend(new_categories)
   ```

### Frontend Changes (ArticleEditor.jsx)

1. **Added to formData state**:
   - `category_ids: []` - Array of category UUIDs
   - `tag_ids: []` - Array of tag UUIDs

2. **New UI Components**:
   - **Additional Categories** - Multi-select checkboxes for all categories
   - **Tags** - Multi-select checkboxes for all tags

3. **Data Loading** - When editing, loads existing categories and tags:
   ```javascript
   category_ids: article.categories?.map(c => c.id) || []
   tag_ids: article.tags?.map(t => t.id) || []
   ```

4. **Submission** - Sends arrays to backend:
   ```javascript
   {
     ...formData,
     category_ids: ["uuid1", "uuid2"],
     tag_ids: ["uuid1", "uuid2"]
   }
   ```

## How to Test

### 1. Create Some Tags First

```sql
-- Run in PostgreSQL
INSERT INTO tags (id, name, slug) VALUES 
  (gen_random_uuid(), 'Breaking', 'breaking'),
  (gen_random_uuid(), 'Trending', 'trending'),
  (gen_random_uuid(), 'Analysis', 'analysis'),
  (gen_random_uuid(), 'Opinion', 'opinion'),
  (gen_random_uuid(), 'Exclusive', 'exclusive');
```

Or use the API:
```bash
curl -X POST http://localhost:8000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Breaking", "slug": "breaking"}'
```

### 2. Make Sure Categories Are Seeded

```bash
cd backend/sql_script
psql -h localhost -p 5432 -U postgres -d lankalive -f seed_categories.sql
```

### 3. Test Create Article

1. Go to `/admin/article/new`
2. Fill in the form:
   - Title: "Test Article with Categories"
   - Summary: "Testing junction tables"
   - Content: "Article content here"
   - Primary Category: Select one (e.g., "Political News")
   - **Additional Categories**: Check 2-3 categories
   - **Tags**: Check 2-3 tags
   - Status: Published
3. Click "Create Article"
4. Check the database:

```sql
-- See the junction table entries
SELECT 
  a.title,
  c.name as category_name
FROM articles a
JOIN article_category ac ON a.id = ac.article_id
JOIN categories c ON ac.category_id = c.id
WHERE a.title = 'Test Article with Categories';

-- See tags
SELECT 
  a.title,
  t.name as tag_name
FROM articles a
JOIN article_tag at ON a.id = at.article_id
JOIN tags t ON at.tag_id = t.id
WHERE a.title = 'Test Article with Categories';
```

### 4. Test Update Article

1. Go to `/admin/articles` (articles list)
2. Click "Edit" on any article
3. Change the selected categories and tags
4. Click "Update Article"
5. Verify:
   - No duplicate key error
   - Junction tables updated correctly
   - Old relationships removed
   - New relationships added

### 5. Test Frontend Display

1. Go to home page - verify articles show their categories
2. Click on a category in the navigation
3. Verify articles are filtered by that category
4. Check that an article with multiple categories appears in all relevant category pages

## Expected Database State

### After Creating Article with 3 Categories and 2 Tags:

**article_category table:**
```
article_id                           | category_id
-------------------------------------|-------------------------------------
823fe533-0940-40cb-bf85-26752ddf66dc | 8ee31872-7dc8-47db-9096-ebfa0c22f21e
823fe533-0940-40cb-bf85-26752ddf66dc | 9ff42983-8ec9-58eb-a107-fcfa1d33f32f
823fe533-0940-40cb-bf85-26752ddf66dc | a005399a-9fda-69fc-b218-0deb2e44g43g
```

**article_tag table:**
```
article_id                           | tag_id
-------------------------------------|-------------------------------------
823fe533-0940-40cb-bf85-26752ddf66dc | 1aa21116-2ab2-42bc-8110-1abb2b33c22c
823fe533-0940-40cb-bf85-26752ddf66dc | 2bb32227-3bc3-53cd-9221-2bcc3c44d33d
```

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
- **Fixed!** The update logic now uses `.clear()` and `.flush()` before adding new relationships

### Categories/Tags Not Showing
- Check that `category_ids` and `tag_ids` are being sent in the request body
- Verify the arrays contain valid UUIDs
- Check browser console for frontend errors

### Empty Categories After Update
- Make sure the frontend is sending the arrays even if unchanged
- The backend checks `if 'category_ids' in data` - if not present, it won't update

## API Endpoints Summary

```
POST   /api/articles          - Create article (needs category_ids, tag_ids arrays)
PUT    /api/articles/:id      - Update article (needs category_ids, tag_ids arrays)
GET    /api/articles          - List articles (returns categories array for each)
GET    /api/articles/by-id/:id - Get article by ID (returns categories and tags arrays)
GET    /api/articles/:slug    - Get article by slug (returns categories and tags)
```

## Next Steps

After testing categories and tags:
1. ✅ Verify junction tables populate correctly
2. ✅ Test update without duplicate errors
3. 🔄 Add media upload functionality
4. 🔄 Build tag management UI
5. 🔄 Add user management interface
