import { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
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

  return <Login onLogin={handleLogin} />;
}

export default App;
