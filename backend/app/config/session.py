from sqlalchemy.orm import sessionmaker
from app.config.db import get_engine


engine = get_engine()
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
