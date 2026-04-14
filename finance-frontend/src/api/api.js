import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post(`${API_URL}/transactions/`, data);
  return response.data;
};

// ВОТ ЭТОГО НЕ ХВАТАЛО:
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};