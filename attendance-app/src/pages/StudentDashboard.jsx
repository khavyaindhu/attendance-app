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
          <h2>← Student Dashboard</h2>
          <p>View your attendance and mark check-in/check-out</p>
        </div>

        {/* Today's Status Card */}
        <div className="status-card" style={{ marginBottom: '20px' }}>
          <div>
            <h3>Today's Status:</h3>
          </div>
          <div className="status-value" style={{ 
            color: checkInTime && checkOutTime ? '#4CAF50' : '#FF9800',
            fontSize: '18px'
          }}>
            {checkInTime && checkOutTime ? '✓ Present' : checkInTime ? '⏱ Checked In' : 'Not Marked'}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Days</h3>
            <div className="stat-value">{totalDays}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#4CAF50' }}>
            <h3>Present</h3>
            <div className="stat-value" style={{ color: '#4CAF50' }}>{presentDays}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#F44336' }}>
            <h3>Absent</h3>
            <div className="stat-value" style={{ color: '#F44336' }}>{absentDays}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#FF9800' }}>
            <h3>Attendance %</h3>
            <div className="stat-value" style={{ color: '#FF9800' }}>{attendancePercentage}%</div>
          </div>
        </div>

        {/* Attendance Report Card */}
        <div className="table-container" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#1976D2' }}>📊 Attendance Report</h3>
          <div style={{ 
            background: '#E3F2FD', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center' 
          }}>
            <p style={{ color: '#1976D2', fontSize: '14px', marginBottom: '10px' }}>
              Monthly Attendance Trend
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'flex-end',
              height: '120px',
              marginTop: '20px'
            }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, idx) => {
                const heights = [80, 75, 60, 85, 90];
                return (
                  <div key={month} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: `${heights[idx]}%`,
                      background: idx % 2 === 0 ? '#4CAF50' : '#1976D2',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '5px'
                    }}></div>
                    <div style={{ fontSize: '11px', color: '#616161' }}>{month}</div>
                    <div style={{ fontSize: '10px', color: '#1976D2', fontWeight: '600' }}>
                      {heights[idx]}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Check-in/Check-out Section */}
        <div className="table-container" style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '20px', color: '#212121' }}>Today's Attendance</h3>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-success" 
              onClick={handleCheckIn}
              disabled={checkInTime}
              style={{
                opacity: checkInTime ? 0.6 : 1,
                cursor: checkInTime ? 'not-allowed' : 'pointer'
              }}
            >
              {checkInTime ? `✓ Checked In: ${checkInTime}` : '📍 Check In'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleCheckOut}
              disabled={!checkInTime || checkOutTime}
              style={{
                opacity: (!checkInTime || checkOutTime) ? 0.6 : 1,
                cursor: (!checkInTime || checkOutTime) ? 'not-allowed' : 'pointer'
              }}
            >
              {checkOutTime ? `✓ Checked Out: ${checkOutTime}` : '🚪 Check Out'}
            </button>
            {checkInTime && checkOutTime && (
              <div style={{ 
                color: '#4CAF50', 
                fontWeight: '600',
                background: '#E8F5E9',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                ✓ Attendance marked for today
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px', color: '#212121', fontSize: '18px' }}>🔔 Notifications</h3>
          {absentDays > 2 && (
            <div className="notification-card">
              <div className="icon">⚠️</div>
              <p>Low Attendance Alert: You have been absent {absentDays} days</p>
            </div>
          )}
          {attendancePercentage < 75 && (
            <div className="notification-card" style={{ background: '#FFEBEE', borderLeftColor: '#F44336' }}>
              <div className="icon" style={{ color: '#F44336' }}>⛔</div>
              <p>Attendance below 75%. Please maintain regular attendance.</p>
            </div>
          )}
          {!checkInTime && (
            <div className="notification-card" style={{ background: '#E3F2FD', borderLeftColor: '#1976D2' }}>
              <div className="icon" style={{ color: '#1976D2' }}>📌</div>
              <p>Don't forget to check in for today!</p>
            </div>
          )}
        </div>

        {/* Attendance History */}
        <div className="table-container">
          <div className="table-header">
            <h3>📋 My Attendance History</h3>
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
                      {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
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
