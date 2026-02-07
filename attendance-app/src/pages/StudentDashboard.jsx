import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ATTENDANCE_DATA } from '../data/testData';
import { getCurrentDate } from '../utils/helpers';

const StudentDashboard = ({ user, onLogout }) => {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // Filter attendance for this student
  const myAttendance = ATTENDANCE_DATA.filter(record => record.studentId === user.id);
  
  // Calculate stats
  const totalDays = myAttendance.length;
  const presentDays = myAttendance.filter(record => record.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  const handleCheckIn = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(time);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setCheckOutTime(time);
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Student Dashboard</h2>
          <p>View your attendance and mark check-in/check-out</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Days</h3>
            <div className="stat-value">{totalDays}</div>
          </div>
          <div className="stat-card">
            <h3>Present</h3>
            <div className="stat-value" style={{ color: '#28a745' }}>{presentDays}</div>
          </div>
          <div className="stat-card">
            <h3>Absent</h3>
            <div className="stat-value" style={{ color: '#dc3545' }}>{absentDays}</div>
          </div>
          <div className="stat-card">
            <h3>Attendance %</h3>
            <div className="stat-value">{attendancePercentage}%</div>
          </div>
        </div>

        {/* Check-in/Check-out Section */}
        <div className="table-container" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Today's Attendance</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <button 
                className="btn btn-success" 
                onClick={handleCheckIn}
                disabled={checkInTime}
              >
                {checkInTime ? `Checked In: ${checkInTime}` : 'Check In'}
              </button>
            </div>
            <div>
              <button 
                className="btn btn-primary" 
                onClick={handleCheckOut}
                disabled={!checkInTime || checkOutTime}
              >
                {checkOutTime ? `Checked Out: ${checkOutTime}` : 'Check Out'}
              </button>
            </div>
            {checkInTime && checkOutTime && (
              <div style={{ color: '#28a745', fontWeight: '600' }}>
                ✓ Attendance marked for today
              </div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="table-container">
          <div className="table-header">
            <h3>My Attendance History</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.map((record) => (
                <tr key={record.id}>
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

export default StudentDashboard;
