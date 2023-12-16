# Use python 3 environment
FROM python:3
WORKDIR /app
# Export flask environment variables. These have higher priority than variables defined elsewhere
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
# Copy dependency files and install
COPY ./requirements.txt .
RUN pip install -r requirements.txt
# Copy all files
COPY . .
# Run the server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
