import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Course} from "../models/course";
import {Question} from "../models/question";

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  private baseURL = environment.API_BASE_URL;

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  public getCourses() {
    return this.httpClient.get<any>(this.baseURL + '/course');
  }

  public getQuestionsFromCourse(id: number) {
    return this.httpClient.get<any>(`${this.baseURL}/course/${id}/questions`);
  }

  public getAnswersFromQuestion(questionId: number) {
    return this.httpClient.get<any>(`${this.baseURL}/question/${questionId}/answers`);
  }

  public createQuestionOld(question: any) {
    console.log("creating question...");
    // EXAMPLE INPUT:
    // question = {
    //   'course': 'FAS',
    //   'question': 'angularQ',
    //   'answer1': 'ans1',
    //   'answer2': 'ans2',
    //   'answer3': 'ans3',
    //   'answer4': 'ans4',
    // };
    return this.httpClient
            .post<any>(this.baseURL + '/create-question', question).pipe(
              catchError(this.handleError)
            );
  }

  public getCourseQuestions(courseName: string) {
    console.log("getting questions for:", courseName);
    // EXAMPLE RESPONSE OF THE GET REQUEST:
    // {
    //   "questions": [
    //       {
    //           "answer1": "answer1",
    //           "answer2": "answer1",
    //           "answer3": "answer1",
    //           "answer4": "answer1",
    //           "course": "FAS",
    //           "id": 9,
    //           "question": "question?"
    //       }
    //   ]
    // }

    return this.httpClient
            .get<any>(this.baseURL + '/get-course-questions/' + courseName).pipe(
              catchError(this.handleError)
            );
  }

  public createCourse(course: Course) {
    return this.httpClient.post<any>(`${this.baseURL}/create-course`, course);
  }

  public createQuestion(question: Question) {
    return this.httpClient.post<any>(`${this.baseURL}/create-question`, question);
  }

  public createAnswer(answer: any) {
    return this.httpClient.post<any>(`${this.baseURL}/create-answer`, answer);
  }
}
