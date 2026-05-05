# Python base
FROM python:3.10-slim

# Workdir
WORKDIR /app

# Copy files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose API port
EXPOSE 8000

# Default command (API)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]