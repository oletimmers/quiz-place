import {Component, OnInit} from '@angular/core';
import {Course} from "../models/course";
import {InformationService} from "../services/information.service";
import { environment } from 'src/environments/environment';

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
          alert("Courses can not be retrieved " + environment.API_BASE_URL);
        }
    });
  }

  public selectThisCourse(course: Course) {
    this.selectedCourse = course;
  }

  public reset() { this.selectedCourse = null; }
}
