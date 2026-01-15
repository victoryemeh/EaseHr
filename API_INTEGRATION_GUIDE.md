# EaseHR HRMS API Integration Guide

## Overview

This document provides a comprehensive guide to the EaseHR application with full HRMS API integration. All endpoints from the API documentation have been integrated into the frontend with proper authentication, validation, and error handling.

## API Base URL

```
https://ease-hr.onrender.com
```

## Project Structure

```
EaseHr/
├── assets/
│   ├── api.js                 # API utility module & authentication
│   ├── auth.js               # Legacy auth (backup)
│   └── global.css            # Global styling
├── Onboarding/
│   ├── select-role.html     # Role selection page
│   ├── select-role-new.js   # Navigation logic
│   ├── employee-login.html  # Employee login
│   ├── employee-signup.html # Employee registration
│   ├── manager-login.html   # Manager login
│   ├── manager-signup.html  # Manager registration
│   ├── manager-signup.js    # Manager signup logic
│   ├── verify-account.html  # Account verification
│   └── splash.html          # Splash screen
├── Employee/
│   ├── dashboard.html       # Employee dashboard
│   ├── dashboard.js         # Employee dashboard logic
│   ├── leave-application-form.html
│   ├── leave-status-tracker.html
│   ├── time-clock.html
│   └── [other employee pages]
├── manager/
│   ├── dashboard.html       # Manager dashboard (legacy)
│   ├── dashboard-new.html   # Manager dashboard (updated)
│   ├── dashboard.js         # Manager dashboard logic
│   ├── leave-app-mgt.html
│   ├── task-assignment.html
│   └── [other manager pages]
└── index.html               # Root index page
```

## API Module Structure

### `assets/api.js` - Core API Module

This module contains all API communication functions with the following main components:

#### 1. **Token Management**

```javascript
TokenManager.getToken(); // Get JWT token
TokenManager.setToken(); // Store JWT token
TokenManager.clearToken(); // Clear token
TokenManager.getRole(); // Get user role
TokenManager.setRole(); // Store user role
TokenManager.getUserId(); // Get user ID
TokenManager.setUserId(); // Store user ID
TokenManager.clear(); // Clear all stored data
```

#### 2. **Authentication API**

```javascript
AuthAPI.register(name, email, password, role);
// Register a new user (manager or employee)
// Params: name (string), email (string), password (string), role ("manager" or "employee")
// Returns: { token, id, data }

AuthAPI.login(email, password);
// Login existing user
// Returns: { token, id, data }

AuthAPI.logout();
// Clear local authentication data
```

#### 3. **Employee API**

```javascript
EmployeeAPI.getAll();
// Get all employees (manager only)
// Returns: { data: [employees] }

EmployeeAPI.getById(employeeId);
// Get specific employee details
// Returns: { data: employee }

EmployeeAPI.updateProfile(employeeId, data);
// Update employee profile
// Params: employeeId (string), data { name, email, ... }
// Returns: { data: updated_employee }
```

#### 4. **Leave API**

```javascript
LeaveAPI.apply(fromDate, toDate, reason);
// Employee applies for leave
// Params: fromDate (YYYY-MM-DD), toDate (YYYY-MM-DD), reason (string)
// Returns: { data: leave_request }

LeaveAPI.getAll();
// Manager gets all leave requests
// Returns: { data: [leaves] }

LeaveAPI.getHistory();
// Employee gets their leave history
// Returns: { data: [leaves] }

LeaveAPI.getEmployeeLeaves(employeeId);
// Manager gets employee's leave history
// Returns: { data: [leaves] }

LeaveAPI.approve(leaveId);
// Manager approves leave request
// Returns: { data: updated_leave }

LeaveAPI.reject(leaveId);
// Manager rejects leave request
// Returns: { data: updated_leave }

LeaveAPI.cancel(leaveId);
// Employee cancels their leave request
// Returns: { data: cancelled_leave }
```

#### 5. **Attendance API**

```javascript
AttendanceAPI.clockIn();
// Employee clocks in
// Returns: { data: attendance_record }

AttendanceAPI.clockOut();
// Employee clocks out
// Returns: { data: attendance_record }

AttendanceAPI.getHistory();
// Employee gets attendance history
// Returns: { data: [attendance_records] }
```

#### 6. **Shift API**

```javascript
ShiftAPI.create(shiftName, startTime, endTime);
// Manager creates a new shift
// Params: shiftName (string), startTime (HH:MM), endTime (HH:MM)
// Returns: { data: shift }

ShiftAPI.getAll();
// Get all shifts
// Returns: { data: [shifts] }

ShiftAPI.assign(shiftId, employeeId);
// Manager assigns shift to employee
// Returns: { data: assignment }
```

#### 7. **Validation Utilities**

```javascript
Validator.email(email); // Validate email format
Validator.password(password); // Validate password (min 6 chars)
Validator.required(value); // Validate non-empty string
Validator.matchPasswords(p1, p2); // Compare two passwords
Validator.dateRange(from, to); // Validate date range
```

#### 8. **UI Helper Functions**

```javascript
showError(message); // Display error alert
showSuccess(message); // Display success alert
```

## Authentication Flow

### Registration Flow

1. **Employee Registration**

   - URL: `/Onboarding/employee-signup.html`
   - User enters: Full Name, Email, Phone, Password, Confirm Password
   - Validation: Email format, password strength, password match
   - API Call: `AuthAPI.register(name, email, password, "employee")`
   - Redirect: `verify-account.html`

2. **Manager Registration**
   - URL: `/Onboarding/manager-signup.html`
   - User enters: Company Info + Manager Personal Info
   - Validation: Email format, password strength
   - API Call: `AuthAPI.register(name, email, password, "manager")`
   - Redirect: `verify-account.html`

### Login Flow

1. **Employee Login**

   - URL: `/Onboarding/employee-login.html`
   - User enters: Email, Password
   - API Call: `AuthAPI.login(email, password)`
   - Response stores: Token, Role, User ID
   - Redirect: `/Employee/dashboard.html`

2. **Manager Login**
   - URL: `/Onboarding/manager-login.html`
   - User enters: Email, Password
   - API Call: `AuthAPI.login(email, password)`
   - Response stores: Token, Role, User ID
   - Redirect: `/manager/dashboard.html`

## Employee Dashboard Features

**File**: `Employee/dashboard.html` with `Employee/dashboard.js`

### Features Implemented:

1. **Profile Management**

   - Display employee name and greeting
   - Update profile (name, email)
   - Auto-load on dashboard access

2. **Leave Management**

   - Apply for leave with date range and reason
   - View leave history (approved, rejected, pending)
   - Cancel pending leave requests
   - Real-time status updates

3. **Attendance Tracking**

   - Clock in / Clock out functionality
   - View attendance history
   - Track time spent per day

4. **Quick Actions**
   - Available buttons for: Apply Leave, Clock In, Clock Out, Update Profile

### Usage:

```javascript
// Apply for leave
await LeaveAPI.apply("2026-01-20", "2026-01-22", "Vacation");

// Clock in
await AttendanceAPI.clockIn();

// Clock out
await AttendanceAPI.clockOut();

// View leave history
const leaves = await LeaveAPI.getHistory();

// Update profile
await EmployeeAPI.updateProfile(employeeId, { name, email });
```

## Manager Dashboard Features

**File**: `manager/dashboard-new.html` with `manager/dashboard.js`

### Features Implemented:

1. **Employee Management**

   - View all employees
   - View employee details
   - Get employee-specific leave history
   - Search and filter employees

2. **Leave Approval System**

   - View all pending leave requests
   - Approve leave requests
   - Reject leave requests
   - Track leave status

3. **Shift Management**

   - Create new shifts
   - Assign shifts to employees
   - Manage shift schedules

4. **Dashboard Analytics**
   - Employee count
   - Pending leave count
   - Quick action buttons

### Usage:

```javascript
// Get all employees
const employees = await EmployeeAPI.getAll();

// Get all leave requests
const leaves = await LeaveAPI.getAll();

// Approve leave
await LeaveAPI.approve(leaveId);

// Create shift
const shift = await ShiftAPI.create("Morning", "09:00", "17:00");

// Assign shift
await ShiftAPI.assign(shiftId, employeeId);

// Get employee leave history
const history = await LeaveAPI.getEmployeeLeaves(employeeId);
```

## Navigation Flow

```
select-role.html
├── Employee Path
│   ├── employee-login.html (existing users) → Employee/dashboard.html
│   └── employee-signup.html (new users) → verify-account.html → Employee/dashboard.html
└── Manager Path
    ├── manager-login.html (existing users) → manager/dashboard.html
    └── manager-signup.html (new users) → verify-account.html → manager/dashboard.html
```

## Error Handling

All API calls include comprehensive error handling:

1. **Network Errors**: Display user-friendly error messages
2. **Authentication Errors**: Auto-redirect to login on 401 (Unauthorized)
3. **Validation Errors**: Show field-level validation before API call
4. **API Errors**: Display server-provided error messages

### Error Display:

```javascript
// Errors are shown in #error-message element
<div id="error-message" style="display: none; ..."></div>

// Success messages shown in #success-message element
<div id="success-message" style="display: none; ..."></div>
```

## Form Validation

All forms include client-side validation before API calls:

### Email Validation

```javascript
Validator.email("user@example.com"); // ✓ valid
Validator.email("invalid-email"); // ✗ invalid
```

### Password Validation

```javascript
Validator.password("password123"); // ✓ valid (6+ chars)
Validator.password("pass"); // ✗ invalid (too short)
```

### Date Range Validation

```javascript
Validator.dateRange("2026-01-20", "2026-01-22"); // ✓ valid
Validator.dateRange("2026-01-22", "2026-01-20"); // ✗ invalid
```

## Testing Endpoints

### Test Workflow (as per API Documentation):

1. **Register Manager**

   ```
   POST /api/auth/register
   Body: { name, email, password, role: "manager" }
   ```

2. **Register Employee**

   ```
   POST /api/auth/register
   Body: { name, email, password, role: "employee" }
   ```

3. **Manager Login**

   ```
   POST /api/auth/login
   Body: { email, password }
   ```

4. **Create Shift (Manager)**

   ```
   POST /api/shifts/
   Body: { shiftName, startTime, endTime }
   ```

5. **Assign Shift to Employee (Manager)**

   ```
   POST /api/shifts/:shiftId/assign/:employeeId
   ```

6. **Employee Apply Leave**

   ```
   POST /api/leaves/
   Body: { fromDate, toDate, reason }
   ```

7. **Manager Approve Leave**

   ```
   PUT /api/leaves/:leaveId
   Body: { status: "approved" }
   ```

8. **Manager Reject Leave**

   ```
   PUT /api/leaves/:leaveId
   Body: { status: "rejected" }
   ```

9. **Employee Clock In**

   ```
   POST /api/attendance/clockin
   ```

10. **Employee Clock Out**
    ```
    POST /api/attendance/clockout
    ```

## Security Features

1. **Token-Based Authentication**

   - JWT tokens stored in localStorage
   - Automatic inclusion in Authorization header for protected routes

2. **Role-Based Access Control**

   - Employee routes restricted to employees
   - Manager routes restricted to managers
   - Auto-redirect on unauthorized access

3. **Password Security**

   - Minimum 6 characters enforced
   - Password confirmation on registration
   - Never displayed in plain text in logs

4. **Input Validation**
   - Email format validation
   - Date range validation
   - Required field checks
   - Client-side validation before API calls

## Files Updated/Created

### Core API Module:

- ✅ `assets/api.js` - NEW (comprehensive API utility)

### Authentication Pages:

- ✅ `Onboarding/employee-login.html` - UPDATED
- ✅ `Onboarding/employee-login-new.html` - NEW (cleaner version)
- ✅ `Onboarding/employee-signup.html` - UPDATED
- ✅ `Onboarding/manager-login.html` - NEW
- ✅ `Onboarding/manager-signup.html` - UPDATED
- ✅ `Onboarding/manager-signup.js` - UPDATED
- ✅ `Onboarding/select-role.html` - UPDATED
- ✅ `Onboarding/select-role-new.js` - NEW

### Dashboard Pages:

- ✅ `Employee/dashboard.js` - NEW (with full API integration)
- ✅ `manager/dashboard-new.html` - NEW (updated UI)
- ✅ `manager/dashboard.js` - NEW (with full API integration)

## How to Use

### 1. For Employees:

1. Navigate to `select-role.html`
2. Click "Continue as Employee"
3. Choose "Register" for new account OR "Log In" for existing
4. Access `/Employee/dashboard.html` after authentication
5. Use quick action buttons to: Apply Leave, Clock In/Out, Update Profile

### 2. For Managers:

1. Navigate to `select-role.html`
2. Click "Continue as Manager"
3. Choose "Register" for new company OR "Log In" for existing
4. Access `/manager/dashboard.html` after authentication
5. Use dashboard to: Manage employees, review/approve leaves, create shifts

## Features Summary

| Feature              | Employee | Manager |
| -------------------- | -------- | ------- |
| Login/Register       | ✓        | ✓       |
| View Profile         | ✓        | ✓       |
| Update Profile       | ✓        | ✓       |
| Apply for Leave      | ✓        | ✗       |
| View Leave History   | ✓        | ✗       |
| Cancel Leave         | ✓        | ✗       |
| View All Leaves      | ✗        | ✓       |
| Approve/Reject Leave | ✗        | ✓       |
| Clock In/Out         | ✓        | ✗       |
| View Attendance      | ✓        | ✗       |
| View All Employees   | ✗        | ✓       |
| Create Shifts        | ✗        | ✓       |
| Assign Shifts        | ✗        | ✓       |

## Troubleshooting

### Issue: "Unauthorized" error on login

**Solution**: Check that email and password are correct. Ensure user is registered in the system.

### Issue: Leave request fails

**Solution**: Verify date range is valid (start date < end date). Check that the user is authenticated.

### Issue: API connection fails

**Solution**: Check internet connection and verify API base URL is `https://ease-hr.onrender.com`

### Issue: Page redirects to login unexpectedly

**Solution**: Token may have expired. Log out and log in again.

## Future Enhancements

- [ ] Email notification system for leave approvals
- [ ] Advanced analytics dashboard for managers
- [ ] Team performance metrics
- [ ] Automated leave balance calculation
- [ ] Calendar integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Two-factor authentication

---

**API Documentation Reference**: https://ease-hr.onrender.com/
**Last Updated**: January 15, 2026
**Version**: 1.0.0
