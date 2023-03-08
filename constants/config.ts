let API_ENV = "prod";

const API_ProdUrl = "http://179.0.75.150:5651/api";
const API_LocalhostUrl = "https://localhost:44365/api";

const API_BaseUrl: string = API_ENV == "localhost" ? API_LocalhostUrl : API_ProdUrl;

export { API_ENV, API_BaseUrl };
