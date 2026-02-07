import { useState } from 'react';
import { USERS } from '../data/testData';
import { authenticateUser } from '../utils/helpers';

const Login = ({ onLogin }) => {
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
          <h1>📚 Attendance System</h1>
          <p>Login to manage attendance</p>
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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="test-credentials">
          <h4>Test Credentials:</h4>
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
  );
};

export default Login;
