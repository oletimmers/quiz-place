export class ResultVM {
  constructor(public score: number, public newHighScore: boolean = false, public currentHighScore: number | null = null) {
  }

}
