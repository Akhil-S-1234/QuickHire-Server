export class Otp {
  constructor(
      public email: string,
      public otp: string,
      public createdAt: Date = new Date()
  ) {}
}
