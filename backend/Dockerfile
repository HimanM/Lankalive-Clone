FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy application code
COPY . .

# Create static directory for media uploads
RUN mkdir -p /app/static/uploads

# Expose port
EXPOSE 8000

# Use Gunicorn for production, fallback to Flask dev server if DEV=true
CMD if [ "$DEV" = "true" ]; then \
        python run.py; \
    else \
        gunicorn -w 4 -b 0.0.0.0:8000 --timeout 120 --access-logfile - --error-logfile - "run:app"; \
    fi
