import { API_BaseUrl } from "../constants/config";
import { Category } from "../models/Category";

function GetAllCategories(): Promise<Array<Category>> {
  const result = fetch(`${API_BaseUrl}/categories/all`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Array<Category>;
    })
    .catch((error) => {
      console.error(error.json());
      return new Array<Category>();
    });

  return result;
}

function GetCategoryById(categoryId:number): Promise<Category|null> {
  const result = fetch(`${API_BaseUrl}/categories?categoryId=${categoryId}`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Category;
    })
    .catch((error) => {
      console.error(error.json());
      return null;
    });

  return result;
}

function PostCategory(category: Category): Promise<any> {
  const result = fetch(`${API_BaseUrl}/categories`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error.json());
    return false;
  });

  return result;
}

function PutCategory(category: Category, categoryId:number): Promise<any> {
  const result = fetch(`${API_BaseUrl}/categories?categoryId=${categoryId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error.json());
    return false;
  });

  return result;
}

function DeleteCategory(categoryId: number): Promise<any> {
  const result = fetch(`${API_BaseUrl}/categories?categoryId=${categoryId}`, {
    method: "DELETE",
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error.json());
    return false;
  });

  return result;
}


export {GetAllCategories, GetCategoryById, PostCategory, PutCategory, DeleteCategory}