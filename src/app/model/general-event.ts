export class GeneralEvent {
  type: string;
  body: any;

  constructor(type: string, body: any) {
    this.type = type;
    this.body = body;
  }
}
