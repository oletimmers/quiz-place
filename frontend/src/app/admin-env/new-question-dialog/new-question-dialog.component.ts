import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {Question} from "../../models/question";
import {InformationService} from "../../services/information.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-new-question-dialog',
  templateUrl: './new-question-dialog.component.html',
  styleUrls: ['./new-question-dialog.component.scss']
})
export class NewQuestionDialogComponent {
  question: Question = new Question("",[]);
  constructor(
    public dialogRef: MatDialogRef<NewQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private informationService: InformationService,
    private snackbar: MatSnackBar
  ) {
    this.question.courseId = data.courseId;
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.question.questionText) {
      this.informationService.createQuestion(this.question).subscribe({
          next: data => {
            this.question.id = data.questionId;
              this.dialogRef.close({
                  question: this.question
              });
            this.snackbar.open("Question created");
          },
          error: data => {
            this.snackbar.open("Question not created");
            this.dialogRef.close();
          }
      });
    }
  }
}
