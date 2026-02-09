const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        ← {user.userType === 'students' ? 'Student Dashboard' : 
            user.userType === 'teachers' ? 'Teacher Dashboard' : 'Admin Panel'}
      </div>
      <div className="navbar-user">
        <span>{user.name}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
