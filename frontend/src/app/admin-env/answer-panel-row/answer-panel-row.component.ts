import {Component, Input, OnInit} from '@angular/core';
import {Answer, Question} from "../../models/question";
import {InformationService} from "../../services/information.service";

@Component({
  selector: 'app-answer-panel-row',
  templateUrl: './answer-panel-row.component.html',
  styleUrls: ['./answer-panel-row.component.scss']
})
export class AnswerPanelRowComponent implements OnInit{
  @Input() questionId: number = 0;


  answers: Answer[] = [];


  constructor(private infoService: InformationService) {
    this.getAnswers();
  }
  ngOnInit(): void {
  }

  getAnswers() {
      this.infoService.getAnswersFromQuestion(this.questionId).subscribe({
        next: data => {
          console.log(data);
          this.answers = data.answers;
          this.ngOnInit();
        },
        error: data => {},
      });
  }
}
