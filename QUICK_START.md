# EaseHR Quick Start Guide

## Getting Started

### 1. Open the Application

Navigate to the root of your project and open `Onboarding/select-role.html` in a web browser.

### 2. Choose Your Role

- **Employee**: Click "Continue as Employee"
- **Manager**: Click "Continue as Manager"

### 3. Authenticate

- **New User**: Click "Register" to create a new account
- **Existing User**: Click "Log In" to access your account

## For Employees

### Registration

1. Click "Continue as Employee"
2. Click "Register"
3. Fill in the form:
   - Full Name (required)
   - Email (required, must be valid)
   - Phone Number (optional)
   - Password (required, minimum 6 characters)
   - Confirm Password (required, must match)
4. Click "Create Account"
5. Verify your account
6. You'll be redirected to the dashboard

### Login

1. Click "Continue as Employee"
2. Click "Log In"
3. Enter your email and password
4. Click "Log In"
5. You'll be redirected to the dashboard

### Dashboard Features

#### Apply for Leave

1. Click "Apply Leave" button
2. Enter start date (YYYY-MM-DD format)
3. Enter end date (YYYY-MM-DD format)
4. Enter reason for leave
5. Submit
6. You'll see your leave request with "Pending" status

#### Clock In/Out

1. Click "Clock In" when you arrive at work
2. Click "Clock Out" when you leave work
3. View your attendance history on the dashboard

#### Update Profile

1. Click "Update Profile"
2. Edit your name and/or email
3. Save changes
4. Changes appear immediately

#### View Leave History

- See all your leave requests (Approved, Pending, Rejected)
- Cancel pending leave requests if needed
- View reason and dates for each leave

#### View Attendance

- See your clock in/out times
- Track daily work hours
- View attendance status

## For Managers

### Registration

1. Click "Continue as Manager"
2. Click "Register Company"
3. Fill in Company Information:
   - Company Name (required)
   - Company Email (required)
   - Company Description (optional)
   - Company Location (optional)
4. Fill in Personal Information:
   - Full Name (required)
   - Email (required)
   - Phone Number (optional)
   - Position/Role (optional)
5. Set Password (required, minimum 6 characters)
6. Click "Register Company"
7. Verify your account
8. You'll be redirected to the dashboard

### Login

1. Click "Continue as Manager"
2. Click "Log In"
3. Enter your email and password
4. Click "Log In"
5. You'll be redirected to the dashboard

### Dashboard Features

#### Manage Employees

1. **View All Employees**: Click "View All Employees" button
2. Each employee card shows:
   - Employee name
   - Email address
   - Click to view their leave history

#### Approve/Reject Leaves

1. **Pending Leaves Section** shows all leave requests needing approval
2. For each leave request:
   - Employee name
   - Leave dates
   - Reason
   - Click "Approve" or "Reject"
3. Approved leaves show with green border
4. Rejected leaves show with red border

#### Create Shifts

1. Click "Create New Shift" button
2. Enter shift details:
   - Shift Name (e.g., "Morning", "Evening")
   - Start Time (e.g., "09:00")
   - End Time (e.g., "17:00")
3. Save the shift

#### Assign Shifts to Employees

1. After creating a shift, get the shift ID
2. Select an employee from the list
3. Assign the shift to the employee
4. The assignment is confirmed immediately

#### View Leave Analytics

- **Team Members**: Shows count of employees
- **Leave Requests**: Shows count of pending requests
- Quick overview of team status

## Common Actions

### Logging Out

1. Click the "Logout" button (bottom navigation)
2. You'll be redirected to the role selection page
3. You can log in with a different account

### Resetting Password

1. On login page, click "Forgotten Password?"
2. Follow the password reset instructions
3. (Note: This feature may require backend support)

### Switching Between Employee and Manager

1. Logout from current account
2. Return to select-role.html
3. Choose different role
4. Login with appropriate credentials

## Important Notes

### Date Formats

- All dates should be in format: **YYYY-MM-DD**
- Example: January 20, 2026 = 2026-01-20

### Time Formats

- All times should be in 24-hour format: **HH:MM**
- Example: 9:00 AM = 09:00
- Example: 5:00 PM = 17:00

### Email Requirements

- Must be a valid email address
- Format: username@domain.com
- Used for login and notifications

### Password Requirements

- Minimum 6 characters
- Case-sensitive
- No specific complexity rules (alphanumeric mix optional)

## Troubleshooting

### "Invalid Email" Error

- Check email format
- Make sure @ and domain are included
- Example valid: john@example.com

### "Passwords Do Not Match" Error

- Ensure both password fields contain exactly the same text
- Check for typos
- Caps Lock may be on

### "Login Failed" Error

- Verify email is correct
- Check password is correct
- Make sure account is registered
- Clear browser cache and try again

### "Failed to Load Dashboard" Error

- Check internet connection
- Verify API server is running
- Clear browser cookies/cache
- Try incognito/private browsing mode

### Cannot See Employees/Leaves

- If manager: Log in with manager account
- If employee: You won't see other employees' info
- Try refreshing the page

### Clock In/Out Not Working

- Ensure you're logged in as an employee
- Check internet connection
- Try clicking once and wait for confirmation

## Tips for Best Experience

1. **Keep Tokens Secure**: Don't share your login credentials
2. **Use Consistent Data**: Use same email for all activities
3. **Plan Ahead**: Apply for leaves in advance when possible
4. **Regular Backups**: Note important dates/leave periods
5. **Check Notifications**: Stay updated on leave approvals
6. **Verify Changes**: Always confirm after updating information

## Support

For issues or questions:

1. Check the API Integration Guide (API_INTEGRATION_GUIDE.md)
2. Review the troubleshooting section above
3. Check browser console for error messages (F12)
4. Verify API server status at https://ease-hr.onrender.com/

## File Locations

| File                              | Purpose                     |
| --------------------------------- | --------------------------- |
| `Onboarding/select-role.html`     | Role selection (START HERE) |
| `Onboarding/employee-login.html`  | Employee login              |
| `Onboarding/employee-signup.html` | Employee registration       |
| `Onboarding/manager-login.html`   | Manager login               |
| `Onboarding/manager-signup.html`  | Manager registration        |
| `Employee/dashboard.html`         | Employee workspace          |
| `manager/dashboard-new.html`      | Manager workspace           |
| `assets/api.js`                   | API communication (core)    |

## API Status

**API Base URL**: https://ease-hr.onrender.com/

**Status**: Live and accessible

**Last Verified**: January 15, 2026

---

**Version**: 1.0.0
**Last Updated**: January 15, 2026
