const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📚 Attendance System
      </div>
      <div className="navbar-user">
        <span>Welcome, {user.name}</span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          ({user.userType === 'students' ? 'Student' : user.userType === 'teachers' ? 'Teacher' : 'Admin'})
        </span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
