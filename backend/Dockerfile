# Use Python 3.14 slim image
FROM python:3.14-slim

# Set working directory
WORKDIR /src

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install  -r requirements.txt

# Copy the rest of the backend code
COPY src/ ./  

# Expose Flask default port
EXPOSE 5000

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask app
CMD ["python", "app.py"]