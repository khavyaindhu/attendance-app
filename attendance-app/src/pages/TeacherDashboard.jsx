import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ATTENDANCE_DATA, USERS, CLASSES } from '../data/testData';
import { exportToCSV } from '../utils/helpers';

const TeacherDashboard = ({ user, onLogout }) => {
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [selectedDate, setSelectedDate] = useState('2024-02-01');
  const [attendanceMarks, setAttendanceMarks] = useState({});

  // Get students for selected class
  const studentsInClass = USERS.students.filter(s => s.class === selectedClass);

  // Filter attendance data
  const filteredAttendance = ATTENDANCE_DATA.filter(
    record => record.class === selectedClass
  );

  // Calculate stats
  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(r => r.status === 'Present').length;
  const absentCount = totalRecords - presentCount;
  const avgAttendance = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  const handleMarkAttendance = (studentId, status) => {
    setAttendanceMarks(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    alert('Attendance saved successfully! (This would save to backend)');
    console.log('Attendance marks:', attendanceMarks);
  };

  const handleExport = () => {
    exportToCSV(filteredAttendance, `attendance_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Teacher Dashboard</h2>
          <p>Mark and view student attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Records</h3>
            <div className="stat-value">{totalRecords}</div>
          </div>
          <div className="stat-card">
            <h3>Present</h3>
            <div className="stat-value" style={{ color: '#28a745' }}>{presentCount}</div>
          </div>
          <div className="stat-card">
            <h3>Absent</h3>
            <div className="stat-value" style={{ color: '#dc3545' }}>{absentCount}</div>
          </div>
          <div className="stat-card">
            <h3>Avg Attendance</h3>
            <div className="stat-value">{avgAttendance}%</div>
          </div>
        </div>

        {/* Mark Attendance Section */}
        <div className="table-container" style={{ marginBottom: '30px' }}>
          <div className="table-header">
            <h3>Mark Attendance</h3>
            <div className="filters">
              <div className="filter-group">
                <label>Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="attendance-grid">
            {studentsInClass.map(student => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                <p>Roll No: {student.rollNo}</p>
                <div className="attendance-buttons">
                  <button
                    className="btn btn-success"
                    style={{ 
                      background: attendanceMarks[student.id] === 'Present' ? '#28a745' : '#e0e0e0',
                      color: attendanceMarks[student.id] === 'Present' ? 'white' : '#666'
                    }}
                    onClick={() => handleMarkAttendance(student.id, 'Present')}
                  >
                    Present
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ 
                      background: attendanceMarks[student.id] === 'Absent' ? '#dc3545' : '#e0e0e0',
                      color: attendanceMarks[student.id] === 'Absent' ? 'white' : '#666'
                    }}
                    onClick={() => handleMarkAttendance(student.id, 'Absent')}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={handleSaveAttendance}>
              Save Attendance
            </button>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="table-container">
          <div className="table-header">
            <h3>Attendance Records - {selectedClass}</h3>
            <div className="table-actions">
              <button className="btn btn-success" onClick={handleExport}>
                Export to Excel
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.rollNo}</td>
                  <td>{record.studentName}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
