import { CategoryColor, CategoryIcons } from "../constants/Enums";
import { Category } from "./Category";
import { Item } from "./Item";

export class Table {
  id: number = 0;
  name: string = "";
  paidValue: number = 0;
  items: Array<Item> = [];

  constructor(
    id: number,
    name: string,
    paidValue: number,
    items: Array<Item>,
  ) {
    this.id = id;
    this.name = name;
    this.paidValue = paidValue;
    this.items = items;
  }
}
