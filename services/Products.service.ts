import { exp } from "react-native-reanimated";
import { API_BaseUrl } from "../constants/config";
import { Product } from "../models/Product";

function GetAllProducts(): Promise<Array<Product>> {
  const result = fetch(`${API_BaseUrl}/products/all`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Array<Product>;
    })
    .catch((error) => {
      console.error(error);
      return new Array<Product>();
    });

  return result;
}

function GetProductById(productId:number): Promise<Product|null> {
  const result = fetch(`${API_BaseUrl}/products?productId=${productId}`)
    .then((response) => response.json())
    .then((json) => {
      return json.data as Product;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return result;
}

function PostProduct(product: Product): Promise<any> {
  const result = fetch(`${API_BaseUrl}/products`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error);
    return false;
  });

  return result;
}

function PutProduct(product: Product, productId:number): Promise<any> {
  const result = fetch(`${API_BaseUrl}/products?productId=${productId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error);
    return false;
  });

  return result;
}

function DeleteProduct(productId: number): Promise<any> {
  const result = fetch(`${API_BaseUrl}/products?productId=${productId}`, {
    method: "DELETE",
  })
  .then((response) => response.json())
  .then((json) => {
    return json
  })
  .catch((error) => {
    console.error(error);
    return false;
  });

  return result;
}

export { GetAllProducts, PostProduct, GetProductById, PutProduct, DeleteProduct };
