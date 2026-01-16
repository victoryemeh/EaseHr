// API Configuration and Utility Functions
// API Configuration and Utility Functions
// IMPORTANT: Add this to your HTML files (before api.js):
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

const API_BASE_URL = "https://ease-hr.onrender.com";

// Configure axios defaults
if (typeof axios !== "undefined") {
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.timeout = 15000; // 15s timeout to avoid hanging
  axios.defaults.withCredentials = false; // using Bearer tokens, not cookies

  // Interceptors for debugging and consistent error handling
  axios.interceptors.request.use((config) => {
    const method = (config.method || "GET").toUpperCase();
    try {
      console.log(`[API ▶] ${method} ${API_BASE_URL}${config.url}`);
    } catch (_) {}
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      const method = (response.config?.method || "GET").toUpperCase();
      try {
        console.log(
          `[API ✓] ${method} ${API_BASE_URL}${response.config?.url} → ${response.status}`
        );
      } catch (_) {}
      return response;
    },
    (error) => {
      const cfg = error.config || {};
      const method = (cfg.method || "GET").toUpperCase();
      try {
        console.warn(
          `[API ✗] ${method} ${API_BASE_URL}${cfg.url} → ${
            error.response?.status ?? "NETWORK/CORS"
          }`
        );
      } catch (_) {}
      return Promise.reject(error);
    }
  );
}

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
// API Request Handler using Axios
const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = true
) => {
  try {
    const config = {
      method,
      url: endpoint,
    };

    // Add auth header if required
    if (requiresAuth) {
      const token = TokenManager.getToken();
      if (!token) {
        throw new Error("Unauthorized: No token found");
      }
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    // Add body for POST/PUT/PATCH requests
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || `HTTP ${status}`;

      if (status === 401) {
        TokenManager.clear();
        window.location.href = "./Onboarding/select-role.html";
      }

      console.error("API Error:", message);
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received (network/CORS error)
      console.error("Network Error:", error.message);
      const corsMsg =
        "Network error: Could not reach server. Check CORS settings on backend and ensure:\n" +
        "- Backend allows requests from your domain\n" +
        "- Backend includes 'Access-Control-Allow-Origin' header\n" +
        "- Backend includes 'Access-Control-Allow-Credentials' if using cookies";
      throw new Error(corsMsg);
    } else {
      // Error in request setup
      console.error("Error:", error.message);
      throw error;
    }
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
