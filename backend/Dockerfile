FROM python:3.6-slim-buster

WORKDIR /backend

ENV FLASK_APP=app.py

ENV FLASK_RUN_HOST=0.0.0.0

ENV FLASK_ENV=development

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "run"]