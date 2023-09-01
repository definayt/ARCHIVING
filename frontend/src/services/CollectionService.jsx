import http from "../http-common";
import axios from "axios";

const getAll = async(params) => {
  const response = await axios.get("http://localhost:5000/collection", {
    params: params
});
return response
  // return http.get("/collection", { params });
};

const get = (id) => {
  return http.get(`/collection/${id}`);
};

const create = (data) => {
  return http.post("/collection", data);
};

const update = (id, data) => {
  return http.put(`/collection/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/collection/${id}`);
};

const removeAll = () => {
  return http.delete(`/collection`);
};

const findByTitle = (title) => {
  return http.get(`/collection?title=${title}`);
};

const CollectionService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default CollectionService;