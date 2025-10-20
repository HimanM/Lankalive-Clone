# Refactored Architecture - Proper Layer Separation

## What Changed

Successfully refactored the junction table logic following proper architectural patterns:
- ✅ Removed raw SQL from controllers
- ✅ Moved all database operations to DAO layer
- ✅ Added business logic methods in Service layer
- ✅ Controllers now only handle HTTP concerns

## Architecture Layers

### 1. DAO Layer (`article_dao.py`)

**New Methods Added:**

```python
def set_categories(self, article: Article, category_ids: List[UUID]) -> None:
    """Set article categories. Clears existing and adds new ones."""
    # Uses SQLAlchemy ORM relationships
    article.categories.clear()
    self.session.flush()
    
    if category_ids:
        categories = self.session.query(Category).filter(Category.id.in_(category_ids)).all()
        article.categories.extend(categories)
        self.session.flush()

def set_tags(self, article: Article, tag_ids: List[UUID]) -> None:
    """Set article tags. Clears existing and adds new ones."""
    # Uses SQLAlchemy ORM relationships
    article.tags.clear()
    self.session.flush()
    
    if tag_ids:
        tags = self.session.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        article.tags.extend(tags)
        self.session.flush()
```

**Why This Works:**
- Uses SQLAlchemy's relationship management
- `clear()` removes all existing relationships
- `flush()` ensures changes are written to DB immediately
- `extend()` adds new relationships
- No raw SQL needed!

### 2. Service Layer (`article_service.py`)

**New Methods Added:**

```python
def create_with_relations(self, article: Article, category_ids: List[UUID] = None, 
                         tag_ids: List[UUID] = None) -> Article:
    """Create article with categories and tags."""
    # Business logic: Always include primary_category in categories
    created = self.dao.create(article)
    
    if category_ids is not None or article.primary_category_id:
        all_category_ids = list(category_ids) if category_ids else []
        if article.primary_category_id and article.primary_category_id not in all_category_ids:
            all_category_ids.insert(0, article.primary_category_id)
        if all_category_ids:
            self.dao.set_categories(created, all_category_ids)
    
    if tag_ids:
        self.dao.set_tags(created, tag_ids)
    
    self.session.commit()
    return created

def update_with_relations(self, article: Article, category_ids: List[UUID] = None, 
                         tag_ids: List[UUID] = None) -> Article:
    """Update article with categories and tags."""
    updated = self.dao.update(article)
    
    # Only update relations if explicitly provided
    if category_ids is not None:
        all_category_ids = list(category_ids)
        if article.primary_category_id and article.primary_category_id not in all_category_ids:
            all_category_ids.insert(0, article.primary_category_id)
        self.dao.set_categories(updated, all_category_ids)
    
    if tag_ids is not None:
        self.dao.set_tags(updated, tag_ids)
    
    self.session.commit()
    return updated
```

**Business Logic:**
- Automatically includes `primary_category_id` in the categories junction table
- Handles None vs empty list distinction (None = don't update, [] = clear all)
- Orchestrates DAO calls and transaction management

### 3. Controller Layer (`article_controller.py`)

**Simplified Code:**

```python
@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_article():
    data = request.json or {}
    
    # Create Article model
    a = Article(
        id=uuid.uuid4(),
        title=data.get('title'),
        # ... other fields
    )
    
    # Parse relation IDs
    category_ids = [uuid.UUID(cid) for cid in data.get('category_ids', [])] if data.get('category_ids') else []
    tag_ids = [uuid.UUID(tid) for tid in data.get('tag_ids', [])] if data.get('tag_ids') else []
    
    # Delegate to service
    with SessionLocal() as session:
        svc = ArticleService(session)
        created = svc.create_with_relations(a, category_ids, tag_ids)
        return jsonify({'id': str(created.id), 'slug': created.slug}), 201
```

**Controller Responsibilities:**
- Parse HTTP request data
- Create domain models
- Call appropriate service methods
- Format HTTP responses
- NO database logic!

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Controllers: HTTP/JSON handling
- Services: Business logic
- DAOs: Database operations

### 2. **Testability**
- Can test each layer independently
- Mock dependencies easily
- No need to test HTTP and DB together

### 3. **Maintainability**
- Changes to DB logic only affect DAO
- Business rules centralized in service
- Controllers stay thin and readable

### 4. **Reusability**
- Service methods can be called from anywhere (CLI, scheduled jobs, etc.)
- DAO methods can be composed into different business flows

### 5. **SQLAlchemy Native**
- Uses ORM relationships properly
- Type-safe with Python type hints
- No string-based SQL queries
- Database-agnostic (can switch from Postgres easily)

## Data Flow

### Create Article Flow:
```
1. POST /api/articles (Controller)
   ↓
2. Parse JSON → Create Article model (Controller)
   ↓
3. call create_with_relations() (Service)
   ↓
4. call dao.create() (DAO)
   ↓
5. call dao.set_categories() (DAO)
   ↓
6. call dao.set_tags() (DAO)
   ↓
7. session.commit() (Service)
   ↓
8. Return JSON response (Controller)
```

### Update Article Flow:
```
1. PUT /api/articles/:id (Controller)
   ↓
2. Parse JSON → Get existing article (Controller)
   ↓
3. Update article fields (Controller)
   ↓
4. call update_with_relations() (Service)
   ↓
5. call dao.update() (DAO)
   ↓
6. call dao.set_categories() - clears + adds (DAO)
   ↓
7. call dao.set_tags() - clears + adds (DAO)
   ↓
8. session.commit() (Service)
   ↓
9. Return JSON response (Controller)
```

## Key Improvements Over Previous Version

### Before (Raw SQL in Controller):
```python
# ❌ BAD: SQL in controller
session.execute(
    text("DELETE FROM article_category WHERE article_id = :article_id"),
    {"article_id": article.id}
)
for cid in category_ids:
    session.execute(
        text("INSERT INTO article_category (article_id, category_id) VALUES (:article_id, :category_id)"),
        {"article_id": article.id, "category_id": uuid.UUID(cid)}
    )
```

### After (Clean ORM in DAO):
```python
# ✅ GOOD: ORM relationships in DAO
def set_categories(self, article: Article, category_ids: List[UUID]) -> None:
    article.categories.clear()
    self.session.flush()
    
    if category_ids:
        categories = self.session.query(Category).filter(Category.id.in_(category_ids)).all()
        article.categories.extend(categories)
        self.session.flush()
```

## Testing the Changes

### 1. Create Article with Categories & Tags:
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Article",
    "summary": "Testing refactored architecture",
    "body": "Content here",
    "slug": "test-article",
    "primary_category_id": "uuid-here",
    "category_ids": ["uuid1", "uuid2"],
    "tag_ids": ["uuid3", "uuid4"],
    "status": "published"
  }'
```

### 2. Update Article Categories:
```bash
curl -X PUT http://localhost:8000/api/articles/article-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category_ids": ["new-uuid1", "new-uuid2"],
    "tag_ids": ["new-uuid3"]
  }'
```

### 3. Verify in Database:
```sql
-- Check junction table
SELECT a.title, c.name 
FROM articles a
JOIN article_category ac ON a.id = ac.article_id
JOIN categories c ON ac.category_id = c.id
WHERE a.title = 'Test Article';
```

## Expected Behavior

✅ **Primary category automatically included** in junction table  
✅ **No duplicate key errors** (clear before add)  
✅ **Clean separation** of concerns  
✅ **Type-safe** Python code  
✅ **Testable** at each layer  

## Next Steps

1. ✅ Test create article with categories/tags
2. ✅ Test update article categories/tags
3. 🔄 Add similar patterns for other relationships (sections, media)
4. 🔄 Write unit tests for each layer
5. 🔄 Add logging/monitoring at service layer
