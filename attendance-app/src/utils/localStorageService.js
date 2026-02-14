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

// Update an existing user
export const updateUser = (userType, userId, updatedData) => {
  try {
    const allUsers = getAllUsers();
    const userIndex = allUsers[userType].findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    // Check if email is being changed and if it already exists
    if (updatedData.email !== allUsers[userType][userIndex].email) {
      const emailExists = Object.values(allUsers).some(userTypeArray =>
        userTypeArray.some(user => 
          user.email.toLowerCase() === updatedData.email.toLowerCase() && user.id !== userId
        )
      );
      
      if (emailExists) {
        return { success: false, message: 'Email already exists' };
      }
    }
    
    // Update user data
    allUsers[userType][userIndex] = updatedData;
    saveUsers(allUsers);
    
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, message: 'Update failed' };
  }
};

// Delete a user
export const deleteUser = (userType, userId) => {
  try {
    const allUsers = getAllUsers();
    const userIndex = allUsers[userType].findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    // Remove user from array
    allUsers[userType].splice(userIndex, 1);
    saveUsers(allUsers);
    
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Delete failed' };
  }
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

// Validate login (alias for authenticateUser for compatibility)
export const validateLogin = (username, password, userType) => {
  return authenticateUser(username, password, userType);
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

// Get user by ID
export const getUserById = (userType, userId) => {
  const allUsers = getAllUsers();
  return allUsers[userType].find(user => user.id === userId);
};

// Get users by class (for students)
export const getStudentsByClass = (className) => {
  const allUsers = getAllUsers();
  return allUsers.students.filter(student => student.class === className);
};

// Get users by department (for teachers)
export const getTeachersByDepartment = (department) => {
  const allUsers = getAllUsers();
  return allUsers.teachers.filter(teacher => teacher.department === department);
};

// Check if username exists in a specific user type
export const usernameExists = (username, userType) => {
  const allUsers = getAllUsers();
  return allUsers[userType].some(
    user => user.username.toLowerCase() === username.toLowerCase()
  );
};

// Check if email exists across all user types
export const emailExists = (email, userType = null) => {
  const allUsers = getAllUsers();
  
  if (userType) {
    // Check only in specific user type
    return allUsers[userType].some(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  // Check across all user types
  return Object.values(allUsers).some(userTypeArray =>
    userTypeArray.some(user => user.email.toLowerCase() === email.toLowerCase())
  );
};

// Export all users data (for backup)
export const exportAllData = () => {
  return getAllUsers();
};

// Import users data (for restore)
export const importAllData = (data) => {
  try {
    saveUsers(data);
    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: 'Import failed' };
  }
};

// Clear all data (useful for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeStorage();
  return { success: true, message: 'All data cleared successfully' };
};

// Get users by type
export const getUsersByType = (userType) => {
  const allUsers = getAllUsers();
  return allUsers[userType] || [];
};