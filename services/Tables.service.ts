import { exp } from "react-native-reanimated";
import { API_BaseUrl } from "../constants/config";
import { Table } from "../models/Table";

function GetAllTables(): Promise<Array<Table>> {
  const result = fetch(`${API_BaseUrl}/tables/all`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Array<Table>;
    })
    .catch((error) => {
      console.error(error);
      return new Array<Table>();
    });

  return result;
}

function GetTableById(tableId: number): Promise<Table | null> {
  const result = fetch(`${API_BaseUrl}/tables?tableId=${tableId}`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Table;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return result;
}

function PostTable(table: Table): Promise<any> {
  const result = fetch(`${API_BaseUrl}/tables`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(table),
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

  return result;
}

function PutTable(table: Table, tableId: number): Promise<any> {
  console.log(JSON.stringify(table));
  const result = fetch(`${API_BaseUrl}/tables?tableId=${tableId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(table),
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

  return result;
}

function DeleteTable(tableId: number): Promise<any> {
  const result = fetch(`${API_BaseUrl}/tables?tableId=${tableId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

  return result;
}

export { GetAllTables, GetTableById, PostTable, PutTable, DeleteTable };
