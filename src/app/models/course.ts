import {Question} from "./question";

export class Course {
  constructor(public title: string, public colorCode: string | null, public questions: Question[] | null ) {
  }
}
