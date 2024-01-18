import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {InformationService} from "../../services/information.service";
import {Course} from "../../models/course";

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.scss']
})
export class NewCourseDialogComponent {
  title: string = "";
  colorCode: string = "";

  constructor(
    public dialogRef: MatDialogRef<NewCourseDialogComponent>,
    private informationService: InformationService
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    const courseToAdd = new Course(this.title, this.colorCode);
    this.informationService.createCourse(courseToAdd).subscribe({
      next: data => {
        courseToAdd.id = data.courseId;
        this.dialogRef.close({
          course: courseToAdd
        });
      },
      error: data => {
        console.error(data.message);
        this.dialogRef.close();
      }
    });
  }
}
