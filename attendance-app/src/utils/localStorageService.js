// Local Storage Service for User Management
// This service handles all localStorage operations for user authentication

const STORAGE_KEYS = {
  USERS: 'attendance_app_users',
  CURRENT_USER: 'attendance_app_current_user'
};

// Initialize localStorage with default test users if empty
export const initializeStorage = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  
  if (!existingUsers) {
    const defaultUsers = {
      students: [
        {
          id: 'S001',
          username: 'student1',
          email: 'student1@example.com',
          password: 'student123',
          name: 'John Doe',
          class: 'CS-A',
          rollNo: '001'
        }
      ],
      teachers: [
        {
          id: 'T001',
          username: 'teacher1',
          email: 'teacher1@example.com',
          password: 'teacher123',
          name: 'Jane Smith',
          department: 'Computer Science'
        }
      ],
      admin: [
        {
          id: 'A001',
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'Super Admin'
        }
      ]
    };
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

// Get all users from localStorage
export const getAllUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : { students: [], teachers: [], admin: [] };
};

// Save users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Register a new user
export const registerUser = (userType, userData) => {
  const allUsers = getAllUsers();
  
  // Check if username already exists in the user type
  const usernameExists = allUsers[userType].some(
    user => user.username.toLowerCase() === userData.username.toLowerCase()
  );
  
  if (usernameExists) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Check if email already exists across all user types
  const emailExists = Object.values(allUsers).some(userTypeArray =>
    userTypeArray.some(user => user.email.toLowerCase() === userData.email.toLowerCase())
  );
  
  if (emailExists) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Add new user to the appropriate user type array
  allUsers[userType].push(userData);
  
  // Save to localStorage
  saveUsers(allUsers);
  
  return { success: true, message: 'Registration successful' };
};

// Authenticate user
export const authenticateUser = (username, password, userType) => {
  const allUsers = getAllUsers();
  const users = allUsers[userType] || [];
  
  const user = users.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    // Don't store password in current user session
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, message: 'Invalid username or password' };
};

// Save current logged-in user
export const saveCurrentUser = (user, userType) => {
  const currentUser = { ...user, userType };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
};

// Get current logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Clear all data (useful for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeStorage();
};

// Get users by type
export const getUsersByType = (userType) => {
  const allUsers = getAllUsers();
  return allUsers[userType] || [];
};