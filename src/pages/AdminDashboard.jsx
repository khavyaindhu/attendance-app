import { useState, useEffect } from 'react';
import { 
  getAllAttendanceRecords,
  getAttendanceForExport,
  getAllStudents,
  initializeAttendanceSystem
} from '../utils/attendanceStorageService';
import { getAllUsers, registerUser, updateUser, deleteUser } from '../utils/localStorageService';
import { CLASSES } from '../data/testData';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalAttendanceRecords: 0
  });
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  useEffect(() => {
    initializeAttendanceSystem();
    loadStats();
  }, []);

  const loadStats = () => {
    const allUsers = getAllUsers();
    const attendanceRecords = getAllAttendanceRecords();
    setStats({
      totalStudents: allUsers.students?.length || 0,
      totalTeachers: allUsers.teachers?.length || 0,
      totalAdmins: allUsers.admin?.length || 0,
      totalAttendanceRecords: attendanceRecords.length
    });
  };

  // ── Build a studentId → { name, rollNo } map from localStorage ──────────
  const buildStudentMap = () => {
    const allUsers = getAllUsers();
    const map = {};
    (allUsers.students || []).forEach((s) => {
      map[s.id] = { name: s.name, rollNo: s.rollNo };
    });
    return map;
  };

  const resetForm = () => {
    setFormData({
      username: '', email: '', password: '',
      name: '', class: 'CS-A', rollNo: '',
      department: '', role: 'Admin'
    });
    setFormError('');
    setEditMode(false);
    setCurrentEditItem(null);
    setGeneratedCredentials(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // ── Student handlers ──────────────────────────────────────────────────────
  const handleAddStudent = () => {
    setFormData({ username: '', email: '', password: generatePassword(), name: '', class: 'CS-A', rollNo: '' });
    setModalType('add-student');
    setEditMode(false);
    setGeneratedCredentials(null);
  };

  const handleEditStudent = (student) => {
    setCurrentEditItem(student);
    setFormData({ username: student.username, email: student.email, password: student.password, name: student.name, class: student.class, rollNo: student.rollNo });
    setModalType('add-student');
    setEditMode(true);
    setGeneratedCredentials(null);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const result = deleteUser('students', studentId);
      if (result.success) {
        loadStats();
        if (modalType === 'students') setModalData(getAllStudents());
        alert('✓ Student deleted successfully!');
      } else {
        alert('❌ Failed to delete student: ' + result.message);
      }
    }
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateEmail(formData.email))          { setFormError('Please enter a valid email address'); return; }
    if (!editMode && formData.password.length < 6) { setFormError('Password must be at least 6 characters'); return; }
    if (formData.username.length < 4)             { setFormError('Username must be at least 4 characters'); return; }
    if (!formData.rollNo)                         { setFormError('Roll number is required'); return; }

    if (editMode) {
      const result = updateUser('students', currentEditItem.id, { ...currentEditItem, username: formData.username, email: formData.email, name: formData.name, class: formData.class, rollNo: formData.rollNo });
      if (result.success) { alert('✓ Student updated successfully!'); loadStats(); closeModal(); }
      else setFormError(result.message);
    } else {
      const result = registerUser('students', { id: `S${Date.now()}`, username: formData.username, email: formData.email, password: formData.password, name: formData.name, class: formData.class, rollNo: formData.rollNo });
      if (result.success) { setGeneratedCredentials({ username: formData.username, email: formData.email, password: formData.password, userType: 'Student' }); loadStats(); }
      else setFormError(result.message);
    }
  };

  // ── Teacher handlers ──────────────────────────────────────────────────────
  const handleAddTeacher = () => {
    setFormData({ username: '', email: '', password: generatePassword(), name: '', department: '' });
    setModalType('add-teacher');
    setEditMode(false);
    setGeneratedCredentials(null);
  };

  const handleEditTeacher = (teacher) => {
    setCurrentEditItem(teacher);
    setFormData({ username: teacher.username, email: teacher.email, password: teacher.password, name: teacher.name, department: teacher.department });
    setModalType('add-teacher');
    setEditMode(true);
    setGeneratedCredentials(null);
  };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const result = deleteUser('teachers', teacherId);
      if (result.success) {
        loadStats();
        if (modalType === 'teachers') { const allUsers = getAllUsers(); setModalData(allUsers.teachers || []); }
        alert('✓ Teacher deleted successfully!');
      } else {
        alert('❌ Failed to delete teacher: ' + result.message);
      }
    }
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateEmail(formData.email))          { setFormError('Please enter a valid email address'); return; }
    if (!editMode && formData.password.length < 6) { setFormError('Password must be at least 6 characters'); return; }
    if (formData.username.length < 4)             { setFormError('Username must be at least 4 characters'); return; }
    if (!formData.department)                     { setFormError('Department is required'); return; }

    if (editMode) {
      const result = updateUser('teachers', currentEditItem.id, { ...currentEditItem, username: formData.username, email: formData.email, name: formData.name, department: formData.department });
      if (result.success) { alert('✓ Teacher updated successfully!'); loadStats(); closeModal(); }
      else setFormError(result.message);
    } else {
      const result = registerUser('teachers', { id: `T${Date.now()}`, username: formData.username, email: formData.email, password: formData.password, name: formData.name, department: formData.department });
      if (result.success) { setGeneratedCredentials({ username: formData.username, email: formData.email, password: formData.password, userType: 'Teacher' }); loadStats(); }
      else setFormError(result.message);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const data = getAttendanceForExport();
    if (data.length === 0) { alert('No attendance data to export'); return; }

    const headers = ['Date', 'Student Name', 'Roll No', 'Class', 'Subject', 'Check In Time', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(r => [r.date, r.studentName, r.rollNo, r.class, r.subject, r.time, r.status].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('✓ Attendance data exported successfully!');
  };

  const handleExportPDF = () => alert('PDF export would be implemented with a library like jsPDF.\n\nFor now, please use the Excel export option.');

  // ── Modal openers ─────────────────────────────────────────────────────────
  const handleManageStudents = () => { setModalData(getAllStudents()); setModalType('students'); };

  const handleManageTeachers = () => { const u = getAllUsers(); setModalData(u.teachers || []); setModalType('teachers'); };

  const handleViewReports = () => {
    // Enrich raw records with student name + roll no
    const studentMap = buildStudentMap();
    const records = getAllAttendanceRecords().map(r => ({
      ...r,
      studentName: studentMap[r.studentId]?.name   || '—',
      rollNo:      studentMap[r.studentId]?.rollNo || '—',
    }));
    setModalData(records);
    setModalType('reports');
  };

  const handleViewAnalytics = () => {
    const records = getAllAttendanceRecords();
    const presentRecords = records.filter(r => r.status === 'Present').length;
    const absentRecords  = records.filter(r => r.status === 'Absent').length;
    const percentage     = records.length > 0 ? ((presentRecords / records.length) * 100).toFixed(1) : 0;
    setModalData({ totalRecords: records.length, presentRecords, absentRecords, percentage });
    setModalType('analytics');
  };

  const closeModal = () => { setModalData(null); setModalType(null); resetForm(); };

  const copyCredentials = () => {
    const text = `Login Credentials for ${generatedCredentials.userType}:\nUsername: ${generatedCredentials.username}\nEmail: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}`;
    navigator.clipboard.writeText(text).then(() => alert('✓ Credentials copied to clipboard!')).catch(() => alert('Failed to copy. Please copy manually.'));
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const thStyle = { padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' };
  const tdStyle = { padding: '12px', fontSize: '14px', color: '#424242' };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Blue Header */}
      <div style={{ background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '5px' }}>←</button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Admin Panel</h2>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
          {[
            { label: 'Total Students',       value: stats.totalStudents,          color: '#1976D2' },
            { label: 'Total Teachers',       value: stats.totalTeachers,          color: '#4CAF50' },
            { label: 'Total Admins',         value: stats.totalAdmins,            color: '#FF9800' },
            { label: 'Attendance Records',   value: stats.totalAttendanceRecords, color: '#F44336' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
              <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>{label}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
          {[
            { emoji: '👥',    label: 'Manage Students',     onClick: handleManageStudents },
            { emoji: '👨‍🏫', label: 'Manage Teachers',     onClick: handleManageTeachers },
            { emoji: '📊',    label: 'Attendance Reports',  onClick: handleViewReports },
            { emoji: '📈',    label: 'Analytics',           onClick: handleViewAnalytics },
          ].map(({ emoji, label, onClick }) => (
            <div key={label} onClick={onClick}
              style={{ background: '#1976D2', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{emoji}</div>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{label}</h3>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <button onClick={handleExportPDF} style={{ background: '#FFC107', color: '#000', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📄</span> Export to PDF
          </button>
          <button onClick={handleExport} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📊</span> Export to Excel (CSV)
          </button>
        </div>

        {/* Info Card */}
        <div style={{ padding: '15px', background: '#E3F2FD', borderRadius: '8px', borderLeft: '4px solid #1976D2' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1565C0', fontWeight: '600' }}>ℹ️ Admin Features:</h4>
          <div style={{ fontSize: '12px', color: '#424242', lineHeight: '1.6' }}>
            • Add, edit, and delete students & teachers<br />
            • View all registered users<br />
            • Export attendance data to CSV/Excel<br />
            • View comprehensive analytics<br />
            • All data stored in browser's localStorage
          </div>
        </div>
      </div>

      {/* ── Modal Overlay ───────────────────────────────────────────────────── */}
      {(modalData || modalType === 'add-student' || modalType === 'add-teacher') && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }} onClick={closeModal}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', margin: 'auto' }} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ background: '#1976D2', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {modalType === 'students'    && '👥 Student Management'}
                {modalType === 'teachers'    && '👨‍🏫 Teacher Management'}
                {modalType === 'reports'     && '📊 Attendance Reports'}
                {modalType === 'analytics'   && '📈 Analytics Dashboard'}
                {modalType === 'add-student' && (editMode ? '✏️ Edit Student'  : '➕ Add New Student')}
                {modalType === 'add-teacher' && (editMode ? '✏️ Edit Teacher'  : '➕ Add New Teacher')}
              </h3>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '0', width: '30px', height: '30px' }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>

              {/* ── Add/Edit Student Form ─────────────────────────────────── */}
              {modalType === 'add-student' && !generatedCredentials && (
                <form onSubmit={handleSaveStudent}>
                  {[
                    { label: 'Full Name *',      name: 'name',     type: 'text',  placeholder: "Enter student's full name",          icon: '👤' },
                    { label: 'Email Address *',  name: 'email',    type: 'email', placeholder: 'Enter email address',                 icon: '📧' },
                    { label: 'Username *',       name: 'username', type: 'text',  placeholder: 'Choose a username (min 4 characters)', icon: '👨‍💼', disabled: editMode },
                  ].map(({ label, name, type, placeholder, icon, disabled }) => (
                    <div key={name} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>{label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FAFAFA' }}>
                        <span style={{ fontSize: '18px' }}>{icon}</span>
                        <input type={type} name={name} value={formData[name] || ''} onChange={handleChange} placeholder={placeholder} required disabled={disabled}
                          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242', opacity: disabled ? 0.6 : 1 }} />
                      </div>
                      {disabled && <div style={{ fontSize: '12px', color: '#757575', marginTop: '5px' }}>Username cannot be changed</div>}
                    </div>
                  ))}

                  {!editMode && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>Password * (Auto-generated)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FFF3E0' }}>
                        <span style={{ fontSize: '18px' }}>🔒</span>
                        <input type="text" name="password" value={formData.password} readOnly style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242', fontWeight: '600' }} />
                        <button type="button" onClick={() => setFormData({ ...formData, password: generatePassword() })} style={{ background: '#FF9800', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Regenerate</button>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>Class *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FAFAFA' }}>
                      <span style={{ fontSize: '18px' }}>🏫</span>
                      <select name="class" value={formData.class} onChange={handleChange} required style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242' }}>
                        {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>Roll Number *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FAFAFA' }}>
                      <span style={{ fontSize: '18px' }}>🔢</span>
                      <input type="text" name="rollNo" value={formData.rollNo || ''} onChange={handleChange} placeholder="Enter roll number" required style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242' }} />
                    </div>
                  </div>

                  {formError && <div style={{ padding: '12px', background: '#FFEBEE', color: '#C62828', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', borderLeft: '4px solid #C62828' }}>⚠️ {formError}</div>}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>{editMode ? 'Update Student' : 'Create Student'}</button>
                    <button type="button" onClick={closeModal} style={{ flex: 1, background: '#757575', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              )}

              {/* ── Student Credentials ───────────────────────────────────── */}
              {modalType === 'add-student' && generatedCredentials && <CredentialsCard creds={generatedCredentials} onCopy={copyCredentials} onClose={closeModal} />}

              {/* ── Add/Edit Teacher Form ─────────────────────────────────── */}
              {modalType === 'add-teacher' && !generatedCredentials && (
                <form onSubmit={handleSaveTeacher}>
                  {[
                    { label: 'Full Name *',     name: 'name',     type: 'text',  placeholder: "Enter teacher's full name", icon: '👤' },
                    { label: 'Email Address *', name: 'email',    type: 'email', placeholder: 'Enter email address',        icon: '📧' },
                    { label: 'Username *',      name: 'username', type: 'text',  placeholder: 'Choose a username (min 4 characters)', icon: '👨‍💼', disabled: editMode },
                  ].map(({ label, name, type, placeholder, icon, disabled }) => (
                    <div key={name} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>{label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FAFAFA' }}>
                        <span style={{ fontSize: '18px' }}>{icon}</span>
                        <input type={type} name={name} value={formData[name] || ''} onChange={handleChange} placeholder={placeholder} required disabled={disabled}
                          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242', opacity: disabled ? 0.6 : 1 }} />
                      </div>
                      {disabled && <div style={{ fontSize: '12px', color: '#757575', marginTop: '5px' }}>Username cannot be changed</div>}
                    </div>
                  ))}

                  {!editMode && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>Password * (Auto-generated)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FFF3E0' }}>
                        <span style={{ fontSize: '18px' }}>🔒</span>
                        <input type="text" name="password" value={formData.password} readOnly style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242', fontWeight: '600' }} />
                        <button type="button" onClick={() => setFormData({ ...formData, password: generatePassword() })} style={{ background: '#FF9800', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Regenerate</button>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#424242', fontWeight: '500' }}>Department *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '1px solid #E0E0E0', borderRadius: '8px', background: '#FAFAFA' }}>
                      <span style={{ fontSize: '18px' }}>🏢</span>
                      <input type="text" name="department" value={formData.department || ''} onChange={handleChange} placeholder="Enter department" required style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', color: '#424242' }} />
                    </div>
                  </div>

                  {formError && <div style={{ padding: '12px', background: '#FFEBEE', color: '#C62828', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', borderLeft: '4px solid #C62828' }}>⚠️ {formError}</div>}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>{editMode ? 'Update Teacher' : 'Create Teacher'}</button>
                    <button type="button" onClick={closeModal} style={{ flex: 1, background: '#757575', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              )}

              {/* ── Teacher Credentials ───────────────────────────────────── */}
              {modalType === 'add-teacher' && generatedCredentials && <CredentialsCard creds={generatedCredentials} onCopy={copyCredentials} onClose={closeModal} />}

              {/* ── Students List ─────────────────────────────────────────── */}
              {modalType === 'students' && (
                <div>
                  <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', color: '#1565C0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Total Students: <strong>{modalData.length}</strong></span>
                    <button onClick={handleAddStudent} style={{ background: '#1976D2', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>➕ Add Student</button>
                  </div>
                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>No students registered yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ background: '#F5F5F5' }}>
                          {['Name','Email','Class','Roll No','Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {modalData.map(student => (
                            <tr key={student.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              <td style={tdStyle}>{student.name}</td>
                              <td style={tdStyle}>{student.email}</td>
                              <td style={tdStyle}><span style={{ padding: '4px 8px', background: '#E3F2FD', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#1976D2' }}>{student.class}</span></td>
                              <td style={tdStyle}>{student.rollNo}</td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleEditStudent(student)} style={{ background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>✏️ Edit</button>
                                  <button onClick={() => handleDeleteStudent(student.id)} style={{ background: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>🗑️ Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Teachers List ─────────────────────────────────────────── */}
              {modalType === 'teachers' && (
                <div>
                  <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', color: '#2E7D32', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Total Teachers: <strong>{modalData.length}</strong></span>
                    <button onClick={handleAddTeacher} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>➕ Add Teacher</button>
                  </div>
                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>No teachers registered yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ background: '#F5F5F5' }}>
                          {['Name','Email','Department','Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {modalData.map(teacher => (
                            <tr key={teacher.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              <td style={tdStyle}>{teacher.name}</td>
                              <td style={tdStyle}>{teacher.email}</td>
                              <td style={tdStyle}><span style={{ padding: '4px 8px', background: '#E8F5E9', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#4CAF50' }}>{teacher.department}</span></td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleEditTeacher(teacher)} style={{ background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>✏️ Edit</button>
                                  <button onClick={() => handleDeleteTeacher(teacher.id)} style={{ background: '#F44336', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}>🗑️ Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Reports ───────────────────────────────────────────────── */}
              {modalType === 'reports' && (
                <div>
                  <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', color: '#E65100' }}>
                    Total Records: <strong>{modalData.length}</strong>
                  </div>
                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>No attendance records yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F5F5F5' }}>
                            {['Date', 'Student', 'Class', 'Subject', 'Status', 'Check In'].map(h => (
                              <th key={h} style={thStyle}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...modalData].reverse().map((record) => (
                            <tr key={record.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              {/* Date */}
                              <td style={tdStyle}>{record.date}</td>

                              {/* Student name — resolved from studentId */}
                              <td style={tdStyle}>
                                <div style={{ fontWeight: '500' }}>{record.studentName}</div>
                                {record.rollNo && record.rollNo !== '—' && (
                                  <div style={{ fontSize: '11px', color: '#9E9E9E' }}>Roll: {record.rollNo}</div>
                                )}
                              </td>

                              {/* Class */}
                              <td style={tdStyle}>
                                <span style={{ padding: '4px 8px', background: '#E3F2FD', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#1976D2' }}>
                                  {record.class}
                                </span>
                              </td>

                              {/* Subject */}
                              <td style={tdStyle}>
                                {record.subject ? (
                                  <span style={{ padding: '3px 8px', background: '#F3E5F5', borderRadius: '8px', fontSize: '12px', fontWeight: '500', color: '#7B1FA2' }}>
                                    {record.subject}
                                  </span>
                                ) : <span style={{ color: '#BDBDBD' }}>—</span>}
                              </td>

                              {/* Status */}
                              <td style={{ padding: '12px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: record.status === 'Present' ? '#E8F5E9' : '#FFEBEE', color: record.status === 'Present' ? '#2E7D32' : '#C62828' }}>
                                  {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
                                </span>
                              </td>

                              {/* Check In Time (was `time` in new schema) */}
                              <td style={tdStyle}>
                                {record.time ? (
                                  <span style={{ fontSize: '13px', color: '#1976D2', fontWeight: '500' }}>
                                    🕐 {record.time}
                                  </span>
                                ) : <span style={{ color: '#BDBDBD' }}>—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Analytics ─────────────────────────────────────────────── */}
              {modalType === 'analytics' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                    {[
                      { label: 'Total Records', value: modalData.totalRecords,   color: '#1976D2', bg: '#E3F2FD' },
                      { label: 'Present',       value: modalData.presentRecords, color: '#4CAF50', bg: '#E8F5E9' },
                      { label: 'Absent',        value: modalData.absentRecords,  color: '#F44336', bg: '#FFEBEE' },
                      { label: 'Attendance %',  value: `${modalData.percentage}%`, color: '#FF9800', bg: '#FFF3E0' },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} style={{ background: bg, padding: '20px', borderRadius: '12px', textAlign: 'center', borderLeft: `4px solid ${color}` }}>
                        <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>{label}</div>
                        <div style={{ fontSize: '36px', fontWeight: '700', color }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E0E0E0' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#424242' }}>Attendance Distribution</h4>
                    {[
                      { label: 'Present', count: modalData.presentRecords, color1: '#4CAF50', color2: '#66BB6A' },
                      { label: 'Absent',  count: modalData.absentRecords,  color1: '#F44336', color2: '#EF5350' },
                    ].map(({ label, count, color1, color2 }) => (
                      <div key={label} style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '14px', color: '#424242', fontWeight: '500' }}>{label}</span>
                          <span style={{ fontSize: '14px', color: color1, fontWeight: '600' }}>{count}</span>
                        </div>
                        <div style={{ width: '100%', height: '30px', background: '#E0E0E0', borderRadius: '15px', overflow: 'hidden' }}>
                          <div style={{ width: `${modalData.totalRecords > 0 ? (count / modalData.totalRecords * 100) : 0}%`, height: '100%', background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`, transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', padding: '15px', background: '#E3F2FD', borderRadius: '8px', fontSize: '13px', color: '#1565C0', textAlign: 'center' }}>
                    Overall attendance rate: <strong>{modalData.percentage}%</strong>
                  </div>
                </div>
              )}

            </div>{/* end modal body */}

            {/* Modal Footer */}
            {modalType !== 'add-student' && modalType !== 'add-teacher' && (
              <div style={{ padding: '15px 20px', borderTop: '1px solid #E0E0E0', background: '#FAFAFA', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ background: '#1976D2', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

// ── Reusable credentials card ──────────────────────────────────────────────
const CredentialsCard = ({ creds, onCopy, onClose }) => (
  <div>
    <div style={{ background: '#E8F5E9', padding: '20px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#2E7D32', fontSize: '18px' }}>{creds.userType} Created Successfully!</h3>
      <p style={{ margin: 0, color: '#424242', fontSize: '14px' }}>Share these credentials with the {creds.userType.toLowerCase()}</p>
    </div>
    <div style={{ background: '#F5F5F5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      {[['Username', creds.username], ['Email', creds.email]].map(([label, val]) => (
        <div key={label} style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', color: '#757575', marginBottom: '5px' }}>{label}</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#424242' }}>{val}</div>
        </div>
      ))}
      <div>
        <div style={{ fontSize: '12px', color: '#757575', marginBottom: '5px' }}>Password</div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1976D2', fontFamily: 'monospace', background: '#E3F2FD', padding: '10px', borderRadius: '6px' }}>{creds.password}</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={onCopy} style={{ flex: 1, background: '#1976D2', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>📋 Copy Credentials</button>
      <button onClick={onClose} style={{ flex: 1, background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Done</button>
    </div>
    <div style={{ marginTop: '15px', padding: '12px', background: '#FFF3E0', borderRadius: '8px', fontSize: '13px', color: '#E65100', borderLeft: '4px solid #FF9800' }}>
      ⚠️ Make sure to save these credentials! The {creds.userType.toLowerCase()} will need them to login.
    </div>
  </div>
);

export default AdminDashboard;