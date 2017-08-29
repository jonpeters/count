export class Category {
  _id: string;
  name: string;
  count: number;
  selected: boolean;

  constructor(name: string) {
    this.name = name;
  }
}
