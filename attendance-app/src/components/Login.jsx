import { useState, useEffect } from 'react';
import { authenticateUser, saveCurrentUser, initializeStorage } from '../utils/localStorageService';

const Login = ({ onLogin, onShowRegister }) => {
  const [userType, setUserType] = useState('students');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize localStorage on component mount
  useEffect(() => {
    initializeStorage();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Authenticate user from localStorage
    const result = authenticateUser(username, password, userType);
    
    if (result.success) {
      // Save current user session
      saveCurrentUser(result.user, userType);
      
      // Pass user data to parent component
      onLogin({ ...result.user, userType });
    } else {
      setError(result.message || 'Invalid username or password');
    }
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
            <span style={{ fontSize: '28px' }}>📚</span>
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600'
          }}>
            Online Attendance App
          </h1>
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
        <div style={{ padding: '30px 25px' }}>
          <form onSubmit={handleLogin}>
            {/* Username Input */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '20px', color: '#1976D2' }}>👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
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

            {/* Password Input */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <span style={{ fontSize: '20px', color: '#1976D2' }}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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

            {error && (
              <div style={{ 
                padding: '12px', 
                background: '#FFEBEE', 
                color: '#C62828', 
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                borderLeft: '4px solid #C62828'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Login Button */}
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
              Login
            </button>

            {/* Forgot Password */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <a
                href="#"
                style={{
                  color: '#1976D2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Register Link */}
            <div style={{ 
              textAlign: 'center', 
              paddingTop: '15px',
              borderTop: '1px solid #E0E0E0'
            }}>
              <span style={{ color: '#757575', fontSize: '14px' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onShowRegister}
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
                Register here
              </button>
            </div>
          </form>

          {/* Test Credentials */}
          <div style={{
            marginTop: '25px',
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
              🔑 Default Test Credentials:
            </h4>
            {userType === 'students' && (
              <div style={{ fontSize: '13px', color: '#424242' }}>
                <p style={{ margin: '5px 0' }}><strong>Username:</strong> student1</p>
                <p style={{ margin: '5px 0' }}><strong>Password:</strong> student123</p>
                <p style={{ margin: '5px 0', fontSize: '12px', fontStyle: 'italic' }}>
                  Or register to create your own account!
                </p>
              </div>
            )}
            {userType === 'teachers' && (
              <div style={{ fontSize: '13px', color: '#424242' }}>
                <p style={{ margin: '5px 0' }}><strong>Username:</strong> teacher1</p>
                <p style={{ margin: '5px 0' }}><strong>Password:</strong> teacher123</p>
                <p style={{ margin: '5px 0', fontSize: '12px', fontStyle: 'italic' }}>
                  Or register to create your own account!
                </p>
              </div>
            )}
            {userType === 'admin' && (
              <div style={{ fontSize: '13px', color: '#424242' }}>
                <p style={{ margin: '5px 0' }}><strong>Username:</strong> admin</p>
                <p style={{ margin: '5px 0' }}><strong>Password:</strong> admin123</p>
                <p style={{ margin: '5px 0', fontSize: '12px', fontStyle: 'italic' }}>
                  Or register to create your own account!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Blue Wave Bottom */}
        <div style={{
          height: '80px',
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
              height: '40px'
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

export default Login;