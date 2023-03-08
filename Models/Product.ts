import { CategoryColor, CategoryIcons } from "../constants/Enums";
import { Category } from "./Category";

export class Product {
  id: number = 0;
  title: string = "";
  description:string = "";
  categoryId: number = 1;
  category: Category = new Category(0, "Outros", CategoryColor.gray, CategoryIcons.question);
  price: number = 0;
  imageUrl: string = "";
  isFavorite: boolean = false;

  constructor(
    id: number,
    title: string,
    description: string,
    category: Category | undefined,
    price: number,
    imageUrl: string,
    isFavorite: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    if (category) {
      this.category = category;
      this.categoryId = category.id;
    }
    this.price = price;
    this.imageUrl = imageUrl;
    this.isFavorite = isFavorite;
  }
}
