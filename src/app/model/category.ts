export class Category {
  _id: string;
  name: string;
  selected: boolean;

  constructor(name: string) {
    this.name = name;
  }
}
