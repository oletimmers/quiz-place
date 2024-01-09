export class Question {
  constructor(public questionText: string, public answers: Answer[], public image?: string) {}
  hasMultipleCorrectAnswers(): boolean {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect);
    return correctAnswers.length > 1;
  }
}

export class Answer {
  public selected = false;
  constructor(public text: string, public isCorrect: boolean) {}
}
