import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleRegisterSuccess = (newUser) => {
    setRegisteredUsers([...registeredUsers, newUser]);
    console.log('User registered successfully:', newUser);
    console.log('All registered users:', [...registeredUsers, newUser]);
  };

  if (!currentUser) {
    if (showRegister) {
      return (
        <Register 
          onBackToLogin={handleBackToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    }
    return <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />;
  }

  // Render appropriate dashboard based on user type
  if (currentUser.userType === 'students') {
    return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentUser.userType === 'teachers') {
    return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentUser.userType === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />;
}

export default App;
