import { mockUser, mockProviders, mockBookings } from "./mockData";

export const authAPI = {
  login: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: "fake-jwt-token",
            user: mockUser
          }
        });
      }, 500);
    });
  }
};

export const userAPI = {
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockUser });
      }, 500);
    });
  },

  updateProfile: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data });
      }, 500);
    });
  }
};

export const providerAPI = {
  getAllProviders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockProviders });
      }, 500);
    });
  }
};

export const bookingAPI = {
  getUserBookings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockBookings });
      }, 500);
    });
  }
};
