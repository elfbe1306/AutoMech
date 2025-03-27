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

  async chap2Calculation(userId, id = null, userInput) {
    try {
      const url = id ? `/Chap2/${userId}/${id}` : `/Chap2/${userId}`;
      const response = await this.api.post(url, userInput);
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
const apiService = new ApiService("http://localhost:3000");

export default apiService;
