import { useState } from 'react';
import { USERS } from '../data/testData';
import { authenticateUser } from '../utils/helpers';

const Login = ({ onLogin, onShowRegister }) => {
  const [userType, setUserType] = useState('students');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(username, password, userType, USERS);
    
    if (user) {
      onLogin({ ...user, userType });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>📚 Online Attendance App</h1>
          <p>Login to manage attendance</p>
        </div>

        <div className="user-type-selector">
          <button
            className={`user-type-btn ${userType === 'students' ? 'active' : ''}`}
            onClick={() => setUserType('students')}
          >
            Login
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

        <div className="login-form-content">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>📧 Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>🔒 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div style={{ 
                padding: '10px', 
                background: '#FFEBEE', 
                color: '#C62828', 
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '14px',
                borderLeft: '4px solid #C62828'
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn">
              Login
            </button>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a
                href="#"
                style={{
                  color: '#1976D2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Forgot Password?
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                onClick={onShowRegister}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1976D2',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'underline'
                }}
              >
                Don't have an account? Register here
              </button>
            </div>
          </form>

          <div className="test-credentials">
            <h4>🔑 Test Credentials:</h4>
            {userType === 'students' && (
              <>
                <p><strong>Username:</strong> student1</p>
                <p><strong>Password:</strong> student123</p>
              </>
            )}
            {userType === 'teachers' && (
              <>
                <p><strong>Username:</strong> teacher1</p>
                <p><strong>Password:</strong> teacher123</p>
              </>
            )}
            {userType === 'admin' && (
              <>
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
