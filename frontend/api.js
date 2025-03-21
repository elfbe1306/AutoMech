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

export async function chap2Calculation(userInput) {
  try {
    const response = await axios.post(`${URL}/Chap2`, userInput)
    return response;
  } catch(error) {
    throw error;
  }
}

export async function chap2GetCalculation(id) {
  try {
    const response = await axios.get(`${URL}/Chap2/${id}`)
    return response;
  } catch(error) {
    throw error
  }
}

export async function chap2UpdateDataAferChoosingEngine(idCal, idEngine) {
  try {
    const response = await axios.put(`${URL}/Chap2/${idCal}/${idEngine}`)
  } catch(error) {
    throw error
  }
}