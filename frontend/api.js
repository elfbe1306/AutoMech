import axios from "axios";

const URL = "http://localhost:3000";

export async function userCreateAccount(userData) {
  try {
    const response = await axios.post(`${URL}/Users`, userData);
    return response.data;
  } catch(error) {
    throw error;
  }
}

export async function userLogin(userData) {
  try {
    const response = await axios.post(`${URL}/Users/Login`, userData);
    return response.data;
  } catch(error) {
    throw error;
  }
}