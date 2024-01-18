import {Component, OnInit} from '@angular/core';
import {Course} from "../models/course";
import {Database} from "../staticdatabase";
import {InformationService} from "../services/information.service";

@Component({
  selector: 'app-user-env',
  templateUrl: './user-env.component.html',
  styleUrls: ['./user-env.component.scss']
})
export class UserEnvComponent implements OnInit{
  courses: Course[] = []
  constructor(private informationService:InformationService) {
    this.getCourses();
  }

  ngOnInit(): void {
  }
  selectedCourse: Course | null = null;


  public getCourses(){
    this.informationService.getCourses().subscribe({
        next: value => {
          this.courses = value.courses;
          this.ngOnInit();
        },
        error: exception => {
          alert("Courses can not be retrieved");
        }
    });
  }

  public selectThisCourse(course: Course) {
    // THESE ARE JUST FOR TESTING, WE CAN DELETE THESE
    // this.informationService.createQuestion(null).subscribe( {
    //   next: () => {
    //     console.log("successful question creation");
    //   }
    // });

    this.informationService.getCourseQuestions("FAS").subscribe({
      next: (data) => {
        console.log(data);
      }
    });

    this.selectedCourse = course;
    console.log("YES");
  }

  public reset() { this.selectedCourse = null; }
}
