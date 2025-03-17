import axios from "axios";

const URL = "http://localhost:3000";

export async function userCreateAccount(userData) {
  try {
    const response = await axios.post(`${URL}/Users`, userData);
    return response.data
  } catch(error) {
    console.error("Error creating account:", error.response?.data || error.message);
    throw error;
  }
}