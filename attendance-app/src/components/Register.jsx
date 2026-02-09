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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1976D2 0%, #1565C0 60%, #0D47A1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          color: 'white',
          padding: '25px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '28px' }}>📝</span>
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '600'
            }}>
              Create Account
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '13px', 
              opacity: 0.9 
            }}>
              Register as a new user
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #E0E0E0',
          background: 'white'
        }}>
          <button
            onClick={() => setUserType('students')}
            style={{
              flex: 1,
              padding: '15px',
              background: 'transparent',
              border: 'none',
              borderBottom: userType === 'students' ? '3px solid #1976D2' : '3px solid transparent',
              color: userType === 'students' ? '#1976D2' : '#757575',
              fontSize: '15px',
              fontWeight: userType === 'students' ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Student
          </button>
          <button
            onClick={() => setUserType('teachers')}
            style={{
              flex: 1,
              padding: '15px',
              background: 'transparent',
              border: 'none',
              borderBottom: userType === 'teachers' ? '3px solid #1976D2' : '3px solid transparent',
              color: userType === 'teachers' ? '#1976D2' : '#757575',
              fontSize: '15px',
              fontWeight: userType === 'teachers' ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Teacher
          </button>
          <button
            onClick={() => setUserType('admin')}
            style={{
              flex: 1,
              padding: '15px',
              background: 'transparent',
              border: 'none',
              borderBottom: userType === 'admin' ? '3px solid #1976D2' : '3px solid transparent',
              color: userType === 'admin' ? '#1976D2' : '#757575',
              fontSize: '15px',
              fontWeight: userType === 'admin' ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Admin
          </button>
        </div>

        {/* Form Content */}
        <div style={{ 
          padding: '30px 25px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: '#424242',
                fontWeight: '500'
              }}>
                Full Name *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '18px' }}>👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#424242'
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: '#424242',
                fontWeight: '500'
              }}>
                Username *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '18px' }}>👨‍💼</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username (min 4 characters)"
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#424242'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: '#424242',
                fontWeight: '500'
              }}>
                Password *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#424242'
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px',
                color: '#424242',
                fontWeight: '500'
              }}>
                Confirm Password *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '18px' }}>🔐</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#424242'
                  }}
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {userType === 'students' && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#424242',
                    fontWeight: '500'
                  }}>
                    Class *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    background: '#FAFAFA'
                  }}>
                    <span style={{ fontSize: '18px' }}>🏫</span>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '15px',
                        color: '#424242'
                      }}
                    >
                      {CLASSES.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#424242',
                    fontWeight: '500'
                  }}>
                    Roll Number *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    background: '#FAFAFA'
                  }}>
                    <span style={{ fontSize: '18px' }}>🔢</span>
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleChange}
                      placeholder="Enter your roll number"
                      required
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '15px',
                        color: '#424242'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Teacher Specific Fields */}
            {userType === 'teachers' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#424242',
                  fontWeight: '500'
                }}>
                  Department *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  background: '#FAFAFA'
                }}>
                  <span style={{ fontSize: '18px' }}>🏢</span>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter your department"
                    required
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '15px',
                      color: '#424242'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Admin Specific Fields */}
            {userType === 'admin' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#424242',
                  fontWeight: '500'
                }}>
                  Role *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  background: '#FAFAFA'
                }}>
                  <span style={{ fontSize: '18px' }}>👑</span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '15px',
                      color: '#424242'
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div style={{ 
                padding: '12px', 
                background: '#FFEBEE', 
                color: '#C62828', 
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                borderLeft: '4px solid #C62828'
              }}>
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div style={{ 
                padding: '12px', 
                background: '#E8F5E9', 
                color: '#2E7D32', 
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                borderLeft: '4px solid #4CAF50'
              }}>
                ✓ {success}
              </div>
            )}

            {/* Register Button */}
            <button 
              type="submit" 
              style={{
                width: '100%',
                background: '#FFC107',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '15px'
              }}
            >
              Register
            </button>

            {/* Login Link */}
            <div style={{ 
              textAlign: 'center', 
              paddingTop: '15px',
              borderTop: '1px solid #E0E0E0'
            }}>
              <span style={{ color: '#757575', fontSize: '14px' }}>
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1976D2',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Login here
              </button>
            </div>
          </form>

          {/* Registration Info */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#E3F2FD',
            borderRadius: '8px',
            borderLeft: '4px solid #1976D2'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '14px', 
              color: '#1565C0',
              fontWeight: '600'
            }}>
              📌 Registration Info:
            </h4>
            <div style={{ fontSize: '12px', color: '#424242', lineHeight: '1.6' }}>
              • Username must be at least 4 characters<br />
              • Password must be at least 6 characters<br />
              • All fields marked with * are required<br />
              • Data will be stored temporarily (no backend)
            </div>
          </div>
        </div>

        {/* Blue Wave Bottom */}
        <div style={{
          height: '60px',
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          marginTop: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg 
            style={{
              position: 'absolute',
              top: '-2px',
              left: 0,
              width: '100%',
              height: '30px'
            }}
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" 
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Register;