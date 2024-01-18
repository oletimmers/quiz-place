import {Component, OnInit} from '@angular/core';
import {InformationService} from "../services/information.service";
import {Course} from "../models/course";
import {map, Observable, share, shareReplay} from "rxjs";
import {Question} from "../models/question";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NewCourseDialogComponent} from "./new-course-dialog/new-course-dialog.component";
import {NewQuestionDialogComponent} from "./new-question-dialog/new-question-dialog.component";
import {MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'app-admin-env',
  templateUrl: './admin-env.component.html',
  styleUrls: ['./admin-env.component.scss'],
  viewProviders: [MatExpansionPanel]
})

export class AdminEnvComponent implements OnInit {

  courses: Course[] = [];

  obsQuestions: { [id: number] : Observable<Question[]>; } = {};


  constructor(
    private informationService: InformationService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar) {
    this.getCourses();
  }

  ngOnInit(): void {
  }


  openNewCourseDialog() {
    const dialogRef = this.dialog.open(NewCourseDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.course) {
        this.snackbar.open('Course created successfully');
        this.getCourses();
      } else {
        this.snackbar.open(`Course not created.`);
      }
    });
  }

  openNewQuestionDialog(courseId: number) {
    const dialogRef = this.dialog.open(NewQuestionDialogComponent, {data: {
        courseId: courseId
      }});
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.question) {
        this.snackbar.open('Question created successfully');
        this.getCourses();
      }
    });
  }


  public getCourses(){
    this.informationService.getCourses().subscribe({
      next: value => {
        this.courses = value.courses;
        this.courses.forEach((course) => {
          if (course.id) {
            this.obsQuestions[course.id] = this.getQuestionsFromCourse(course.id);
          }
        });
        this.ngOnInit();

      },
      error: exception => {
        console.log("Courses can not be retrieved");
      }
    });
  }

  public getQuestionsFromCourse(id: number) {
    return this.informationService.getQuestionsFromCourse(id).pipe(
      map(data => {
        return data.questions;
      })
    );
  }


}

