import {Component, Input} from '@angular/core';
import {Answer, Question} from "../../models/question";
import {MatExpansionPanel} from "@angular/material/expansion";
import {InformationService} from "../../services/information.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-question-panel',
  templateUrl: './question-panel.component.html',
  styleUrls: ['./question-panel.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class QuestionPanelComponent {

  @Input() question: Question | null = null;

  newAnswer = "";
  newAnswerIsCorrect = false;

  constructor(
      private informationService: InformationService,
      private snackbar: MatSnackBar
  ) {
  }

  submitNewAnswer(){
    if (!this.question || !this.question.questionText) {
      return;
    }
    const isCorrect = this.newAnswerIsCorrect ? 1 : 0;
    const answerToAdd = {
      questionId: this.question.id,
      answer: this.newAnswer,
      isCorrect: isCorrect
    };
    this.informationService.createAnswer(answerToAdd).subscribe({
      next: data => {
        const answerToAddInList = new Answer(this.newAnswer, this.newAnswerIsCorrect);
        if (this.question) {
          this.question.answers.push(answerToAddInList);
          this.newAnswer = "";
          this.newAnswerIsCorrect = false;
          this.snackbar.open("Answer created");
        }
      },
    });

  }
}
