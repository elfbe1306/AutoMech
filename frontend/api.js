import axios from "axios";

class ApiService {
  static instance = null;

  constructor(baseURL) {
    if (ApiService.instance) {
      return ApiService.instance;
    }
    this.api = axios.create({ baseURL });
    ApiService.instance = this;
  }

  async userCreateAccount(userData) {
    try {
      const response = await this.api.post(`/Users`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async userLogin(userData) {
    try {
      const response = await this.api.post(`/Users/Login`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async chap2Calculation(userInput) {
    try {
      const response = await this.api.post(`/Chap2`, userInput);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async chap2GetCalculation(id) {
    try {
      const response = await this.api.get(`/Chap2/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async chap2UpdateDataAfterChoosingEngine(idCal, idEngine) {
    try {
      const response = await this.api.put(`/Chap2/${idCal}/${idEngine}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
const apiService = new ApiService("https://2d4b-103-238-72-84.ngrok-free.app");

export default apiService;
