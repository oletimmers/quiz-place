import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Answer, Question} from "../../models/question";
import {Result} from "../../models/result";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question: Question = new Question("", []);
  @Output() result: EventEmitter<Result> = new EventEmitter();

  submitted = false;
  goodAnswer = false;
  selectedAnswer = "";

  public getSubTitle(): string {
    if (this.question.hasMultipleCorrectAnswers()){
      return "Multiple answers possible";
    }
    return "Only one answer possible";
  }

  submit() {
    if (this.question.hasMultipleCorrectAnswers()) {
      let answerConcept = true;
      this.question.answers.forEach((answer) => {
        answerConcept = answerConcept && (answer.isCorrect == answer.selected);
      });
      this.goodAnswer = answerConcept;
    } else {
      this.goodAnswer = this.selectedAnswer == this.question.answers.filter((answer: Answer) => answer.isCorrect)[0].text;
    }
    this.submitted = true;
  }

  nextSlide() {
    this.result.emit(new Result(this.goodAnswer, this.question));
  }

}
