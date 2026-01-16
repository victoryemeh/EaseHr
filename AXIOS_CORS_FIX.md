# AXIOS Integration & CORS Fix Guide

## ✅ What Was Changed

1. **Refactored `assets/api.js`** from Fetch API → **AXIOS**
2. **Added AXIOS CDN** to all auth pages:
   - `Onboarding/employee-login.html`
   - `Onboarding/employee-signup.html`
   - `Onboarding/manager-login.html`
   - `Onboarding/manager-signup.html`
   - `manager/dashboard-new.html`

## Why AXIOS?

- ✅ **Better error handling** - distinguishes between network errors and server errors
- ✅ **Automatic timeout** - prevents hanging requests
- ✅ **JSON automatic** - no manual JSON stringify/parse needed
- ✅ **Request/Response interceptors** - easier to add global auth logic
- ✅ **Works with CORS** - handles preflight requests better

---

## 🔴 "Failed to Fetch" - CORS Issue

The error you're seeing is **CORS (Cross-Origin Resource Sharing)** blocking the request.

### Why It Happens

Your frontend is at: `https://yourdomain.com`  
Your API is at: `https://ease-hr.onrender.com`

Browsers block these requests unless the API allows it.

### ✅ Fix: Configure Backend CORS

You need to add CORS headers to your backend. Here are solutions for common backends:

---

## Backend CORS Fixes

### 1️⃣ **Node.js / Express**

```javascript
const cors = require("cors");
const app = express();

// Option A: Allow all origins (for development only)
app.use(cors());

// Option B: Allow specific origins (recommended for production)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://yourusername.github.io",
      "https://yourdomain.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 2️⃣ **Python / Flask**

```python
from flask_cors import CORS
from flask import Flask

app = Flask(__name__)

# Option A: Allow all
CORS(app)

# Option B: Specific origins
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://yourusername.github.io",
            "https://yourdomain.com"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

### 3️⃣ **Python / Django**

```python
# In settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourusername.github.io",
    "https://yourdomain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

### 4️⃣ **Java / Spring Boot**

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "https://yourusername.github.io",
                        "https://yourdomain.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 5️⃣ **Go / Gin**

```go
package main

import "github.com/gin-contrib/cors"

func main() {
    r := gin.Default()

    config := cors.DefaultConfig()
    config.AllowOrigins = []string{
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourusername.github.io",
        "https://yourdomain.com",
    }
    config.AllowCredentials = true
    config.AllowHeaders = []string{"Content-Type", "Authorization"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}

    r.Use(cors.New(config))
    // ... routes
}
```

---

## 📋 Checklist

After configuring CORS on backend:

- [ ] Backend includes `Access-Control-Allow-Origin` header
- [ ] Backend includes `Access-Control-Allow-Methods` header (POST, PUT, GET, DELETE)
- [ ] Backend includes `Access-Control-Allow-Headers` header (Content-Type, Authorization)
- [ ] Backend includes `Access-Control-Allow-Credentials` header (if using cookies/auth)
- [ ] Credentials mode set to `true` in axios (done in api.js)

---

## 🧪 Test the Login Endpoint

After backend CORS is configured:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the request to `/api/auth/login`
5. Check the headers:
   - Should see `200` or `401` (success or auth error)
   - NOT `0` or Network Error

If you still see network error:

- Check backend is running
- Verify API_BASE_URL in `assets/api.js` is correct
- Check browser console for error message

---

## 🔧 API_BASE_URL

**File:** `assets/api.js` (line 5)

```javascript
const API_BASE_URL = "https://ease-hr.onrender.com";
```

Make sure this matches your backend URL.

---

## 📝 Error Messages

| Error                                                           | Cause               | Fix                                 |
| --------------------------------------------------------------- | ------------------- | ----------------------------------- |
| "Network error: Could not reach server. Check CORS settings..." | CORS not configured | Configure CORS on backend           |
| `Failed to fetch`                                               | Network unreachable | Check API_BASE_URL, backend running |
| `HTTP 401`                                                      | Invalid credentials | Check email/password                |
| `HTTP 500`                                                      | Server error        | Check backend logs                  |

---

## ✅ Verification

Once fixed, login should:

1. Make POST request to `/api/auth/login`
2. Receive 200 response with token
3. Store token in localStorage
4. Redirect to dashboard

Browser console should show:

```
✅ Login successful
```

NO network errors in DevTools Network tab.

---

## 🚀 Deployment Notes

When deploying to GitHub Pages:

- Update `CORS_ALLOWED_ORIGINS` with: `https://yourusername.github.io`
- Test on the deployed domain, not localhost

Example for GitHub Pages deployment:

```javascript
// production
const API_BASE_URL = "https://your-backend.com"; // deployed backend
```
