FROM python:3.6-slim-buster

WORKDIR /backend

ENV FLASK_APP=app.py

ENV FLASK_RUN_HOST=0.0.0.0

ENV FLASK_ENV=development

ENV DB_URL=postgresql://postgres:postgres@flask_db:5432/postgres

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 4000

CMD ["flask", "run", "--host=0.0.0.0", "--port=4000"]