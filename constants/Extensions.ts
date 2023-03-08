import "intl";
import "intl/locale-data/jsonp/pt-BR";

function PadNumber(value: number, count: number | undefined): string {
  if (count == undefined) count = 2;

  return (new Array(count).join("0") + value).slice(-count);
}

function FillOdd(data: any, columns: number) {
  while (data.length % columns != 0) {
    data.push(Object.create(data[0]));
    data[data.length - 1].id = 0;
  }
  return data;
}

function Added(collection: Array<any>, newItem: any, prepend?: boolean) {
  if (newItem == null || newItem == undefined) return collection;
  const coll = [...collection];
  if(prepend === true){
    coll.unshift(newItem);
  }
  else{
    coll.push(newItem);
  }
  return coll;
}

const Formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function FormatCurrency(value: number) {
  return Formatter.format(value).replace("$", "$ ");
}

function ValidateNumber(value: string): string {
  const _value = value.replace(",", ".");
  const n = Number(_value);
  if (isNaN(n) || _value.split(".").length - 1 > 1 || /[a-zA-Z]/g.test(_value)) {
    console.log("true");
    return "";
  }
  return n.toString();
}

export { PadNumber, FillOdd, Added, Formatter, FormatCurrency, ValidateNumber };
