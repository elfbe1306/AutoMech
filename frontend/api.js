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

  async Chapter4PreData(recordID) {
    try {
      const response = await this.api.get(`/chapter4/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter4Calculation(recordID, userData) {
    try {
      const response = await this.api.post(`/chapter4/calculation/${recordID}`, userData);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter4SecondCalculation(recordID, userData) {
    try {
      const response = await this.api.post(`/chapter4/secondcalculation/${recordID}`, userData);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter5Calculation(recordID, userInput) {
    try {
      const response = await this.api.post(`/chapter5/${recordID}`, userInput);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter5SecondCalculation(recordID, userInput) {
    try {
      const response = await this.api.post(`/chapter5/secondcalculation/${recordID}`, userInput);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async Chapter5RecordSave(recordID, userInput) {
    try {
      const response = await this.api.post(`/chapter5/saverecord/${recordID}`, userInput);
      return response.data;
    } catch(error) {
      throw error;
    }
  }
  
  async FetchReportData(recordID) {
    try {
      const response = await this.api.post(`/fetchcalculation/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async FetchHistoryData() {
    try {
      const response = await this.api.get(`/fetchhistory`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async FetchReportDataHistory(recordID) {
    try {
      const response = await this.api.post(`/fetchsecondcalculation/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async DeleteRecord(recordID) {
    try {
      const response = await this.api.get(`/deleterecord/${recordID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async GetUser(userID) {
    try {
      const response = await this.api.get(`/getuser/${userID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }

  async CountTotalRecord(userID) {
    try {
      const response = await this.api.get(`/countrecord/${userID}`);
      return response.data;
    } catch(error) {
      throw error;
    }
  }
}

// Singleton instance
const apiService = new ApiService("https://4f14-103-238-72-82.ngrok-free.app");

export default apiService;
