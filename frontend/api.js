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

  async UserCreateAccount(userData) {
    try {
      const response = await this.api.post(`/Users`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async UserLoginAccount(userData) {
    try {
      const response = await this.api.post('/Users/Login', userData)
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter2InputData(userData, userID, recordID = null) {
    try {
      const url = recordID ? `/chapter2/${userID}/${recordID}` : `/chapter2/${userID}`;
      const response = await this.api.post(url, userData);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter2FetchData(recordID) {
    try {
      const response = await this.api.get(`/chapter2/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter2AfterChoosingEngine(recordID, selectEngineID) {
    try {
      const response = await this.api.post(`/chapter2/update/engine/${recordID}`, {selectEngineID});
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter3BeforeChoosingChain(recordID) {
    try {
      const response = await this.api.get(`/chapter3/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter3Calculation(recordID, userData) {
    try {
      const response = await this.api.post(`/chapter3/calculation/${recordID}`, userData);
      return response.data;
    } catch(error) {
      throw error;
    }
  }
}

// Singleton instance
const apiService = new ApiService("http://localhost:3000");

export default apiService;
