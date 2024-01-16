import {Question} from "./question";

export class Course {
  constructor(public id: number, public title: string, public colorCode: string | null, public questions: Question[] | null ) {
  }
}
