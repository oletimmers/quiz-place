export class Question {
  constructor(public questionText: string, public answers: Answer[], public id: number | null = null, public courseId = 0) {}

  public hasMultipleCorrectAnswers(): boolean {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length > 1;
  }
}

export class Answer {
  constructor(public text: string, public isCorrect: boolean, public questionId: number | null = null , public selected: boolean = false) {}
}
