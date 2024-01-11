import {Component, OnInit} from '@angular/core';
import {Course} from "../models/course";
import {Database} from "../staticdatabase";

@Component({
  selector: 'app-user-env',
  templateUrl: './user-env.component.html',
  styleUrls: ['./user-env.component.scss']
})
export class UserEnvComponent {
  ngOnInit(): void {
  }
  selectedCourse: Course | null = null;


  public getCourses(): Course[]{
    return [
      new Course("Coding and Cryptography", "#A9D8B8", null),
      new Course("Software Security", "#A7C4B5", null),
      new Course("Digital Architecture", "#BC4B51", Database.questionList),
      new Course("Service Oriented Design", "#9AA0A8", null),
      new Course("Fundamentals of Adaptive Software", "#BEFFC7", null),
    ];
  }

  public selectThisCourse(course: Course) {
    this.selectedCourse = course;
    console.log("yes")
  }
}
