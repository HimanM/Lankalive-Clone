from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
import os
import sys
from pathlib import Path


DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5433/lankalive')


def get_engine() -> Engine:
	# echo can be controlled via env
	echo = os.getenv('SQL_ECHO', 'False').lower() in ('1', 'true', 'yes')
	return create_engine(DATABASE_URL, echo=echo)


def init_db_from_sql(sql_path: str):
	"""Execute the provided SQL script to initialize schema."""
	engine = get_engine()
	sql_file = Path(sql_path)
	if not sql_file.exists():
		raise FileNotFoundError(f"SQL file not found: {sql_path}")

	sql_text = sql_file.read_text(encoding='utf-8')
	with engine.begin() as conn:
		conn.execute(text(sql_text))


def test_connection():
	engine = get_engine()
	try:
		with engine.connect() as conn:
			r = conn.execute(text('SELECT 1'))
			return r.scalar() == 1
	except SQLAlchemyError as e:
		print('DB connection test failed:', e)
		return False


def main():
	import argparse

	parser = argparse.ArgumentParser(description='DB utilities for backend')
	parser.add_argument('--init', action='store_true', help='Initialize DB from sql_script/init_schema.sql')
	parser.add_argument('--test', action='store_true', help='Test DB connection')
	args = parser.parse_args()

	if args.init:
		# derive path relative to workspace root
		root = Path(__file__).resolve().parents[3]
		sql_path = root / 'sql_script' / 'init_schema.sql'
		print('Initializing DB from', sql_path)
		init_db_from_sql(str(sql_path))
		print('Initialization complete')
		return

	if args.test:
		ok = test_connection()
		print('Connection OK' if ok else 'Connection FAILED')
		return

	parser.print_help()


if __name__ == '__main__':
	main()

