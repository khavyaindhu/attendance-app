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
        {/* Today's Status - Simple text format */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#424242', fontWeight: '500' }}>
            Today's Status: <span style={{ color: '#4CAF50', fontWeight: '600' }}>Present</span>
          </h3>
        </div>

        {/* Attendance Report Card - Blue Header */}
        <div className="table-container" style={{ marginBottom: '25px', padding: '0', overflow: 'hidden' }}>
          <div style={{ 
            background: '#1976D2', 
            color: 'white', 
            padding: '15px 20px',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            Attendance Report
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '30px 20px',
          }}>
            {/* Bar Chart */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end',
              height: '180px',
              marginBottom: '10px',
              position: 'relative',
              paddingLeft: '20px'
            }}>
              {/* Y-axis markers */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#999'
              }}>
                <div>5</div>
                <div>4</div>
                <div>3</div>
                <div>2</div>
                <div>1</div>
                <div>0</div>
              </div>

              {/* Bars */}
              {[
                { month: 'Jan', height: 80, color: '#4CAF50', percentage: '80%' },
                { month: 'Feb', height: 75, color: '#1976D2', percentage: '75%' },
                { month: 'Mar', height: 60, color: '#F44336', percentage: '60%' },
                { month: 'Apr', height: 85, color: '#4CAF50', percentage: '85%' },
                { month: 'May', height: 90, color: '#1976D2', percentage: '90%' }
              ].map((item, idx) => (
                <div key={item.month} style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  {/* Percentage above bar */}
                  <div style={{ 
                    position: 'absolute',
                    top: `${100 - item.height}%`,
                    transform: 'translateY(-20px)',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1976D2'
                  }}>
                    {item.percentage}
                  </div>
                  
                  {/* Bar */}
                  <div style={{
                    width: '50px',
                    height: `${item.height}%`,
                    background: item.color,
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '8px',
                    marginTop: 'auto'
                  }}></div>
                  
                  {/* Month label */}
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#616161',
                    fontWeight: '500'
                  }}>
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ 
            marginBottom: '15px', 
            color: '#424242', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Notifications
          </h3>
          
          {/* Notification Cards with Yellow Circle Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#FFC107',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>!</span>
              </div>
              <p style={{ 
                margin: 0, 
                color: '#424242',
                fontSize: '14px'
              }}>
                Absent on 12th April.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#FFC107',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>!</span>
              </div>
              <p style={{ 
                margin: 0, 
                color: '#424242',
                fontSize: '14px'
              }}>
                Low Attendance Alert.
              </p>
            </div>

            {!checkInTime && (
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>!</span>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#424242',
                  fontSize: '14px'
                }}>
                  Don't forget to check in for today!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '25px' }}>
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
