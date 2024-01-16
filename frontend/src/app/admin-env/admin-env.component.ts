import {Component, OnInit} from '@angular/core';
import {InformationService} from "../services/information.service";
import {Course} from "../models/course";
import {map, Observable, share, shareReplay} from "rxjs";

@Component({
  selector: 'app-admin-env',
  templateUrl: './admin-env.component.html',
  styleUrls: ['./admin-env.component.scss']
})

export class AdminEnvComponent implements OnInit {

  courses: Course[] = [];

  obsQuestions: { [id: number] : Observable<any>; } = {};


  constructor(private informationService: InformationService) {
    this.getCourses();
  }

  ngOnInit(): void {
  }


  public getCourses(){
    this.informationService.getCourses().subscribe({
      next: value => {
        this.courses = value.courses;
        this.courses.forEach((course) => {
          this.obsQuestions[course.id] = this.getQuestionsFromCourse(course.id);
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

