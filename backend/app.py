from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from os import environ
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
import datetime
import jwt
from functools import wraps
import sys
from sqlalchemy.orm.attributes import flag_modified
# READ ENV VARIABLES
DB_DB = environ.get('POSTGRES_DB')
DB_HOST = environ.get('POSTGRES_HOST')
DB_PORT = environ.get('POSTGRES_PORT')
DB_USER = environ.get('POSTGRES_USER')
DB_PASS = environ.get('POSTGRES_PASSWORD')

URI = 'postgresql://{}:{}@{}:{}/{}'.format(
    DB_USER,
    DB_PASS.strip(),
    DB_HOST,
    DB_PORT,
    DB_DB
)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = URI
db = SQLAlchemy(app)
migrate = Migrate(app, db)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type, Authorization, x-access-tokens'

app.config['SECRET_KEY'] = 'ilovesofwarecontainerization'
adminpw = "superadmin"


# region models

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    scores = db.Column(JSON, default={})

    def json(self):
        return {'id': self.id, 'username': self.username, 'role': self.role, 'scores': self.scores}


class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    color_code = db.Column(db.Text, nullable=False)
    questions = db.relationship('Question', backref='course', lazy='noload')

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'colorCode': self.color_code,
            'questions': [
                {
                    "id": question.id,
                    "questionText": question.question,
                    "answers": [
                        {
                            "text": answer.answer,
                            "isCorrect": answer.is_correct
                        }
                        for answer in Answer.query.filter_by(question_id=question.id)
                    ]
                }
                for question in Question.query.filter_by(course_id=self.id)
            ]
        }


class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    answers = db.relationship('Answer', backref='question')

    # def json(self):
    #     return {'id': self.id,
    #             'title': self.title,
    #             'colorCode': self.color_code,
    #             'questions': self.questions.json}


class Answer(db.Model):
    __tablename__ = 'answer'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.BOOLEAN, nullable=False)

    # def json(self):
    #     return {'question_id': self.question_id,
    #             'answer1': self.answer1,
    #             'answer2': self.answer2,
    #             'answer3': self.answer3,
    #             'answer4': self.answer4}


db.create_all()


# endregion

# region decorators
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return make_response(jsonify({'message': 'a valid token is missing'}), 401)
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return make_response(jsonify({'message': 'token is invalid'}), 401)

        return f(current_user, *args, **kwargs)

    return decorator


def token_required_from_admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return make_response(jsonify({'message': 'a valid token is missing'}), 401)
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
            if current_user.role == "admin":
                return f(current_user, *args, **kwargs)
            else:
                return make_response(jsonify({'message': 'user is not admin'}), 401)
        except:
            return make_response(jsonify({'message': 'token is invalid'}), 401)

    return decorator


# endregion


# region endpoints


@app.route('/test', methods=['GET'])
def test():
    return make_response(jsonify({'message': 'test route'}), 200)


@app.route('/login', methods=['POST'])
def login_user():
    auth = request.get_json()

    if not auth or not auth.get('username') or not auth.get('password'):
        return make_response('Credits not in right format', 400, {'Authentication': 'login required"'})

    user = User.query.filter_by(username=auth["username"]).first()
    # TOTALLY NOT SAFE
    if user and auth["password"] == adminpw:
        token = jwt.encode(
            {'id': user.id, 'role': user.role, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=500)},
            app.config['SECRET_KEY'], "HS256")
        is_admin = False
        if user.role.lower() == 'admin':
            is_admin = True

        return jsonify({'token': token, 'isAdmin': is_admin})

    return make_response('Could not verify', 401, {'Authentication': '"login required"'})


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


@app.route('/update-user-score', methods=['PUT'])
@token_required
def update_user_score(current_user):
    # try:
    data = request.get_json()
    course_id = data["courseId"]
    score = data["score"]
    new_high_score = False

    if current_user.scores is None:
        current_user.scores = dict()

    if current_user.scores.get(str(course_id)):
        # if score exists, check if new highscore
        if current_user.scores[str(course_id)] < score:
            current_user.scores[str(course_id)] = score
            new_high_score = True
    else:
        # when the score does not exist, new entry => new highscore
        current_user.scores[str(course_id)] = score
        new_high_score = True

    flag_modified(current_user, "scores")  # update the JSON field
    db.session.commit()

    return make_response(jsonify({
        'message': 'User score updated successfully',
        'newHighScore': new_high_score,
        'currentHighScore': current_user.scores[str(course_id)]
    }), 201)


# except Exception as e:
#     return make_response(jsonify({'message': 'error updating user score', 'exception': e}), 500)


@app.route('/create-course', methods=['POST'])
@token_required_from_admin
def create_course(current_user):
    try:
        data = request.get_json()
        if not data.get('colorCode'):
            data['colorCode'] = 'white'
        new_course = Course(
            title=data['title'],
            color_code=data['colorCode']
        )
        db.session.add(new_course)
        db.session.commit()
        return make_response(
            jsonify({'message': f'course created, id: {new_course.id}', 'courseId': f'{new_course.id}'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error creating course: {e}'}), 500)


@app.route('/create-question', methods=['POST'])
@token_required_from_admin
def create_question(current_user):
    try:
        data = request.get_json()
        new_question = Question(
            question=data['questionText'],
            course_id=data['courseId'],
        )
        db.session.add(new_question)
        db.session.commit()
        return make_response(
            jsonify({'message': f'question created, id: {new_question.id}', 'questionId': f'{new_question.id}'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error creating question: {e}'}), 500)


@app.route('/create-answer', methods=['POST'])
@token_required_from_admin
def create_answer(current_user):
    try:
        data = request.get_json()
        new_answer = Answer(
            question_id=data['questionId'],
            answer=data['answer'],
            # in JSON 0 or 1
            is_correct=data['isCorrect']
        )
        db.session.add(new_answer)
        db.session.commit()
        return make_response(jsonify({'message': f'answer created, answer_id: {new_answer.id}'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error creating answer: {e}'}), 500)


@app.route('/course', methods=['GET'])
def get_all_courses():
    try:
        courses = Course.query.all()
        courses_list = [
            {
                'id': course.id,
                'title': course.title,
                'colorCode': course.color_code
            }
            for course in courses
        ]
        return make_response(jsonify({'courses': courses_list}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error getting questions: {e}'}), 500)


@app.route('/course/<course_id>/questions', methods=['GET'])
def get_course_questions(course_id):
    try:
        questions = Question.query.filter_by(course_id=course_id).all()
        questions_list = [
            {
                'id': question.id,
                'courseId': question.course_id,
                'questionText': question.question,
                "answers": [
                    {
                        "text": answer.answer,
                        "isCorrect": answer.is_correct
                    }
                    for answer in Answer.query.filter_by(question_id=question.id).all()
                ]
            }
            for question in questions
        ]
        return make_response(jsonify({'questions': questions_list}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error getting questions: {e}'}), 500)


@app.route('/course/<course_id>', methods=['GET'])
def get_course(course_id):
    """
    @efe, I want to retrieve the whole course with all of its questions and answers (nested) with this function.
    :param course_id:
    :return:
    """
    try:
        course = Course.query.filter_by(id=course_id).first()
        return make_response(jsonify({'course': course.json()}), 201)
    except Exception as e:
        return make_response(jsonify({'message': f'error getting questions: {e}'}), 500)


# @app.route('/get-answers/<int:question_id>')
# def get_answer(question_id):
#     try:
#         answers = Answer.query.filter_by(question_id=question_id).all()
#         if answers:
#             return make_response(jsonify({'answers': answers}), 200)
#         return make_response(jsonify({'message': 'answer not found'}), 404)
#     except Exception as e:
#         return make_response(jsonify({'message': f'error getting answer: {e}'}), 500)


# @app.route('/get-course-questions/<course>', methods=['GET'])
# def get_course_questions(course):
#     try:
#         questions = Question.query.filter_by(course=course).all()
#
#         questions_list = [
#             {
#                 'id': question.id,
#                 'course': question.course,
#                 'question': question.question,
#                 'answer1': question.answer1,
#                 'answer2': question.answer2,
#                 'answer3': question.answer3,
#                 'answer4': question.answer4,
#             }
#             for question in questions
#         ]
#
#         return make_response(jsonify({'questions': questions_list}), 201)
#     except Exception as e:
#         return make_response(jsonify({'message': f'error getting questions: {e}'}), 500)

# get all users
@app.route('/users', methods=['GET'])
@token_required_from_admin
def get_users():
    try:
        users = User.query.all()
        return make_response(jsonify([user.json() for user in users]), 200)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting users'}), 500)


# get a user by id
@app.route('/users/<int:id>', methods=['GET'])
@token_required_from_admin
def get_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting user'}), 500)

if __name__ == '__main__':
    app.run(debug=True)
# endregion

# CODE TO DROP TABLES
# # Reflect the existing database tables
# db.metadata.reflect(bind=db.engine)

# # Drop the table if it exists
# if 'users' in db.metadata.tables:
#     obsolete_table = db.metadata.tables['users']
#     obsolete_table.drop(db.engine)

# # Commit the changes
# db.session.commit()
