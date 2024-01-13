from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
db = SQLAlchemy(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def json(self):
        return {'id': self.id,'username': self.username, 'role': self.role}

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.Text, nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer1 = db.Column(db.Text, nullable=False)
    answer2 = db.Column(db.Text, nullable=False)
    answer3 = db.Column(db.Text, nullable=False)
    answer4 = db.Column(db.Text, nullable=False)

db.create_all()

@app.route('/test', methods=['GET'])
def test():
    return make_response(jsonify({'message': 'test route'}), 200)

@app.route('/create-question', methods=['POST'])
def create_question():
    try:
        data = request.get_json()
        new_question = Question(course=data['course'], question=data['question'], answer1=data['answer1'], answer2=data['answer2'], answer3=data['answer3'], answer4=data['answer4'])
        db.session.add(new_question)
        db.session.commit()
        return make_response(jsonify({'message': 'question created'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error creating question: {e}'}), 500)

@app.route('/get-course-questions/<course>', methods=['GET'])
def get_course_questions(course):
    try:
        questions = Question.query.filter_by(course=course).all()

        questions_list = [
            {
                'id': question.id,
                'course': question.course,
                'question': question.question,
                'answer1': question.answer1,
                'answer2': question.answer2,
                'answer3': question.answer3,
                'answer4': question.answer4,
            }
            for question in questions 
        ]

        return make_response(jsonify({'questions': questions_list}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error getting questions: {e}'}), 500)

# create a user
@app.route('/create-user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(username=data['username'], role=data['role'])
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({'message': 'user created'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error creating user'}), 500)

# get all users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return make_response(jsonify([user.json() for user in users]), 200)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users'}), 500)

# get a user by id
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user'}), 500)
