import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Course} from "../../models/course";
import {Question, Answer} from "../../models/question";
import {ShuffleMachine} from "../../services/ShuffleMachine";
import {Database} from "../../staticdatabase";
import {Result} from "../../models/result";
import {NgbCarousel} from "@ng-bootstrap/ng-bootstrap";
import {UserEnvComponent} from "../user-env.component";

@Component({
  selector: 'app-question-carousel',
  templateUrl: './question-carousel.component.html',
  styleUrls: ['./question-carousel.component.scss']
})
export class QuestionCarouselComponent {
  @Input() course: Course = new Course("", null, null);

  constructor(private user: UserEnvComponent) {}

  async ngOnChanges() {
    console.log('Input course in app-question-carousel:', this.course);
    this.questions = await this.loadQuestions();;
    console.log("Questions loaded!")
  }

  process = 0;
  questions: Question[] = [];
  currentSlide: number = 1;

  // @ts-ignore
  @ViewChild('carousel') carousel: NgbCarousel;

  async fetchQuestions() {
    console.log(this.course.title);

    try {
      const response = await fetch(`http://localhost:4000/get-course-questions/${this.course.title}`, {
        method: 'GET',
      });

      if (!response.ok) { throw new Error('Network response was not ok: ${response.statusText}'); }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.questions) {
          const questions = data.questions;
          console.log(questions);
          return questions;
        } else { throw new Error('Response did not include JSON object'); }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchAnswer(id: number) {
    console.log(this.course.title);

    try {
      const response = await fetch(`http://localhost:4000/get-answer/${id}`, {
        method: 'GET',
      });

      if (!response.ok) { throw new Error('Network response was not ok: ${response.statusText}'); }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.answer) {
          const answer = data.answer;
          console.log(answer);
          return answer;
        } else { throw new Error('Response did not include JSON object'); }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async loadQuestions() {
    const questions_data = await this.fetchQuestions();
    let questions_list = []
    for (var q of questions_data){
      let question = q['question'];
      // Retrieve the answers using the id
      let id = q['id']
      let answer_data = await this.fetchAnswer(id);
      let answers = [ new Answer(q['answer1'], Boolean(answer_data['answer1'])),
                      new Answer(q['answer2'], Boolean(answer_data['answer2'])),
                      new Answer(q['answer3'], Boolean(answer_data['answer3'])),
                      new Answer(q['answer4'], Boolean(answer_data['answer4'])) ]
      // Create Question object and add to array
      questions_list.push( new Question(question, answers) )
    }
    let temp_questions = ShuffleMachine.shuffleArray(questions_list);
    temp_questions.forEach((question: Question)=> {
      question.answers = ShuffleMachine.shuffleArray(question.answers);
    });
    return temp_questions;
  }

  processResult(result: Result) {
    if (!result.result) {
      result.question.answers.forEach((answer)=>{
        answer.selected = false;
      });
      result.question.answers = ShuffleMachine.shuffleArray(result.question.answers);
      this.questions.push(result.question);
    }
    this.updateProcess();
    this.currentSlide ++;
    this.carousel.next();
  }

  updateProcess() {
    this.process = this.currentSlide / this.questions.length * 100;
    console.log("Process: " + this.process + "\n " + this.currentSlide + "\n " + this.questions.length)
  }

  return() {
    this.user.reset();
  }
}
