import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Course} from "../../models/course";
import {Question, Answer} from "../../models/question";
import {ShuffleMachine} from "../../services/ShuffleMachine";
import {Result} from "../../models/result";
import {NgbCarousel} from "@ng-bootstrap/ng-bootstrap";
import {UserEnvComponent} from "../user-env.component";
import {InformationService} from "../../services/information.service";
import {QuestionComponent} from "../question/question.component";
import {ResultVM} from "./result.viewmodel";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-question-carousel',
  templateUrl: './question-carousel.component.html',
  styleUrls: ['./question-carousel.component.scss']
})
export class QuestionCarouselComponent implements OnInit{
  @Input() course: Course = new Course("", null, null);

  constructor(private user: UserEnvComponent, private informationService: InformationService, private auth: AuthService) {}

  async ngOnChanges() {
    console.log('Input course in app-question-carousel:', this.course);
    this.fetchQuestions();
    console.log("Questions loaded!")
  }

  process = 0;
  questions: Question[] = [];
  currentSlide: number = 1;
  goodAnswers: number = 0;

  result: ResultVM | null = null;

  // @ts-ignore
  @ViewChild('carousel') carousel: NgbCarousel;

  fetchQuestions() {
    console.log(this.course.title);
    if (!this.course.id) {
      return;
    }
    try {
      // const response = await fetch(`http://localhost:4000/get-course-questions/${this.course.title}`, {
      //   method: 'GET',
      // });
      this.informationService.getQuestionsFromCourse(this.course.id).subscribe({
        next: (data) => {
          this.questions = data.questions.map((question: any) => Object.assign(new Question(
            question.questionText,
            question.answers,
            question.id,
            question.courseId
            )));
          this.questions.forEach((question: Question) => {
            question.answers.forEach((answer: Answer) => {
              answer.selected = false;
            });
          });
          this.ngOnInit();
        },
        error: (data) => {
          throw new Error(`Network response was not ok: ${data.message}`);
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  processResult(result: Result) {
    if (result.result) {
      this.goodAnswers ++;
    }
    this.updateProcess();
    this.currentSlide ++;
    this.carousel.next();
  }

  updateProcess() {
    this.process = this.currentSlide / this.questions.length * 100;
    // console.log("Process: " + this.process + "\n " + this.currentSlide + "\n " + this.questions.length)
    if (this.process >= 100) {
      this.calculateAndUpdateScore();
    }
  }


  calculateAndUpdateScore() {
    let score = this.goodAnswers / this.questions.length * 10;
    score = Math.round(score * 10) / 10;
    // send this score and retrieve latest high score
    let newHighScore = false;
    let currentHighScore: number;
    if (this.course.id) {
      console.log("SENDINGNEWSCORE");
      if (this.auth.getToken()) {
        this.informationService.putNewUserHighScore(this.course.id, score).subscribe({
          next: data => {
            newHighScore = data.newHighScore;
            currentHighScore = data.currentHighScore;
            this.result = new ResultVM(score, newHighScore, currentHighScore);
          },
          error: err => {
            console.error(err);
            this.result = new ResultVM(score, false, null);
          }
        });
      } else {
        this.result = new ResultVM(score, false, null);
      }
    }
  }

  return() {
    this.user.reset();
  }

  ngOnInit(): void {
  }
}
