// API Configuration and Utility Functions
const API_BASE_URL = "https://ease-hr.onrender.com";

// Token management
const TokenManager = {
  getToken: () => localStorage.getItem("easehr_token"),
  setToken: (token) => localStorage.setItem("easehr_token", token),
  clearToken: () => localStorage.removeItem("easehr_token"),
  getRole: () => localStorage.getItem("easehr_role"),
  setRole: (role) => localStorage.setItem("easehr_role", role),
  getUserId: () => localStorage.getItem("easehr_userId"),
  setUserId: (id) => localStorage.setItem("easehr_userId", id),
  clear: () => {
    localStorage.removeItem("easehr_token");
    localStorage.removeItem("easehr_role");
    localStorage.removeItem("easehr_userId");
    localStorage.removeItem("easehr_user");
  },
};

// API Request Handler
const apiRequest = async (
  endpoint,
  method,
  body = null,
  requiresAuth = true
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = TokenManager.getToken();
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Response isn't JSON
      }

      if (response.status === 401) {
        TokenManager.clear();
        window.location.href = "/Onboarding/select-role.html";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API Functions
const AuthAPI = {
  register: async (name, email, password, role) => {
    return apiRequest(
      "/api/auth/register",
      "POST",
      {
        name,
        email,
        password,
        role,
      },
      false
    );
  },

  login: async (email, password) => {
    return apiRequest(
      "/api/auth/login",
      "POST",
      {
        email,
        password,
      },
      false
    );
  },

  logout: () => {
    TokenManager.clear();
  },
};

// Employee API Functions
const EmployeeAPI = {
  getAll: async () => {
    return apiRequest("/api/employees/all", "GET", null, true);
  },

  getById: async (employeeId) => {
    return apiRequest(`/api/employees/${employeeId}`, "GET", null, true);
  },

  updateProfile: async (employeeId, data) => {
    return apiRequest(`/api/employees/${employeeId}`, "PUT", data, true);
  },
};

// Leave API Functions
const LeaveAPI = {
  apply: async (fromDate, toDate, reason) => {
    return apiRequest(
      "/api/leaves/",
      "POST",
      {
        fromDate,
        toDate,
        reason,
      },
      true
    );
  },

  getAll: async () => {
    return apiRequest("/api/leaves/all", "GET", null, true);
  },

  getHistory: async () => {
    return apiRequest("/api/leaves/history", "GET", null, true);
  },

  getEmployeeLeaves: async (employeeId) => {
    return apiRequest(`/api/leaves/employee/${employeeId}`, "GET", null, true);
  },

  approve: async (leaveId) => {
    return apiRequest(
      `/api/leaves/${leaveId}`,
      "PUT",
      {
        status: "approved",
      },
      true
    );
  },

  reject: async (leaveId) => {
    return apiRequest(
      `/api/leaves/${leaveId}`,
      "PUT",
      {
        status: "rejected",
      },
      true
    );
  },

  cancel: async (leaveId) => {
    return apiRequest(`/api/leaves/${leaveId}`, "DELETE", null, true);
  },
};

// Attendance API Functions
const AttendanceAPI = {
  clockIn: async () => {
    return apiRequest("/api/attendance/clockin", "POST", {}, true);
  },

  clockOut: async () => {
    return apiRequest("/api/attendance/clockout", "POST", {}, true);
  },

  getHistory: async () => {
    return apiRequest("/api/attendance/history", "GET", null, true);
  },
};

// Shift API Functions
const ShiftAPI = {
  create: async (shiftName, startTime, endTime) => {
    return apiRequest(
      "/api/shifts/",
      "POST",
      {
        shiftName,
        startTime,
        endTime,
      },
      true
    );
  },

  getAll: async () => {
    return apiRequest("/api/shifts/", "GET", null, true);
  },

  assign: async (shiftId, employeeId) => {
    return apiRequest(
      `/api/shifts/${shiftId}/assign/${employeeId}`,
      "POST",
      {},
      true
    );
  },
};

// Helper function to show error messages
const showError = (message) => {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  } else {
    alert(message);
  }
};

// Helper function to show success messages
const showSuccess = (message) => {
  const successDiv = document.getElementById("success-message");
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = "block";
    setTimeout(() => {
      successDiv.style.display = "none";
    }, 5000);
  }
};

// Validation helper functions
const Validator = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  required: (value) => {
    return value && value.trim().length > 0;
  },

  matchPasswords: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  dateRange: (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return from < to;
  },
};
