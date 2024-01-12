import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Course} from "../../models/course";
import {Question} from "../../models/question";
import {ShuffleMachine} from "../../services/ShuffleMachine";
import {Database} from "../../staticdatabase";
import {Result} from "../../models/result";
import {NgbCarousel} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-question-carousel',
  templateUrl: './question-carousel.component.html',
  styleUrls: ['./question-carousel.component.scss']
})
export class QuestionCarouselComponent {
  @Input() course: Course = new Course("", null, null);

  ngOnChanges() {
    console.log('Input course in app-question-carousel:', this.course);
    if (this.course.questions != null) {
      this.questions = this.getQuestions();
      console.log("Questions loaded!")
    }
  }

  process = 0;
  questions: Question[] = [];
  currentSlide: number = 1;

  // @ts-ignore
  @ViewChild('carousel') carousel: NgbCarousel;

  getQuestions() {
    let tempQuestions = ShuffleMachine.shuffleArray(Database.questionList);
    tempQuestions.forEach((question: Question)=> {
      question.answers = ShuffleMachine.shuffleArray(question.answers);
    });
    return tempQuestions;
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
}
