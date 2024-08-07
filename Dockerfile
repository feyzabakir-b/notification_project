FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN python manage.py collectstatic --noinput

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "notification_project.asgi:application"]
