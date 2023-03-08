import { ItemStatus } from "../constants/Enums";
import { Product } from "./Product";
import { Table } from "./Table";

export class Item {
  id: number = 0;
  count: number = 0;
  discount: number = 0;
  additional: number = 0;
  status: ItemStatus = ItemStatus.Pendente;
  paid: boolean = false;
  note: string = "";
  productId: number = 0;
  tableId: number = 0;
  product: Product | undefined = undefined;
  table: Table | undefined = undefined;

  public constructor(
    id: number,
    productId: number,
    tableId: number,
    product: Product | undefined,
    table: Table | undefined,
    count: number,
    discount: number,
    additional: number,
    status: ItemStatus,
    paid: boolean,
    note: string
  ) {
    this.id = id;
    this.productId = productId;
    this.tableId = tableId;
    this.product = product;
    this.table = table;
    this.count = count;
    this.discount = discount;
    this.additional = additional;
    this.status = status;
    this.paid = paid;
    this.note = note;
  }
}
