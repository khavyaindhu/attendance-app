import { useState } from 'react';
import { CLASSES } from '../data/testData';

const Register = ({ onBackToLogin, onRegisterSuccess }) => {
  const [userType, setUserType] = useState('students');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    // Student specific
    class: 'CS-A',
    rollNo: '',
    // Teacher specific
    department: '',
    // Admin specific
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 4) {
      setError('Username must be at least 4 characters');
      return;
    }

    // Create user object based on type
    let newUser = {
      id: `${userType === 'students' ? 'S' : userType === 'teachers' ? 'T' : 'A'}${Date.now()}`,
      username: formData.username,
      password: formData.password,
      name: formData.name
    };

    if (userType === 'students') {
      newUser.class = formData.class;
      newUser.rollNo = formData.rollNo;
    } else if (userType === 'teachers') {
      newUser.department = formData.department;
    } else if (userType === 'admin') {
      newUser.role = formData.role;
    }

    // Simulate registration success
    console.log('New user registered:', newUser);
    setSuccess('Registration successful! You can now login.');
    
    // Clear form
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      class: 'CS-A',
      rollNo: '',
      department: '',
      role: 'Admin'
    });

    // Callback to notify parent
    if (onRegisterSuccess) {
      onRegisterSuccess(newUser);
    }

    // Redirect to login after 2 seconds
    setTimeout(() => {
      onBackToLogin();
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h1>📝 Create Account</h1>
          <p>Register as a new user</p>
        </div>

        <div className="user-type-selector">
          <button
            className={`user-type-btn ${userType === 'students' ? 'active' : ''}`}
            onClick={() => setUserType('students')}
          >
            Student
          </button>
          <button
            className={`user-type-btn ${userType === 'teachers' ? 'active' : ''}`}
            onClick={() => setUserType('teachers')}
          >
            Teacher
          </button>
          <button
            className={`user-type-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleRegister}>
          {/* Common Fields */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (min 4 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Student Specific Fields */}
          {userType === 'students' && (
            <>
              <div className="form-group">
                <label>Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                >
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            </>
          )}

          {/* Teacher Specific Fields */}
          {userType === 'teachers' && (
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                required
              />
            </div>
          )}

          {/* Admin Specific Fields */}
          {userType === 'admin' && (
            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: '10px', 
              background: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              padding: '10px', 
              background: '#d4edda', 
              color: '#155724', 
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          <button type="submit" className="login-btn">
            Register
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onBackToLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              Already have an account? Login here
            </button>
          </div>
        </form>

        <div className="test-credentials" style={{ marginTop: '20px' }}>
          <h4>📌 Registration Info:</h4>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            • Username must be at least 4 characters<br />
            • Password must be at least 6 characters<br />
            • All fields marked with * are required<br />
            • Data will be stored temporarily (no backend)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
