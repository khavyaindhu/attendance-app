import { useState, useEffect } from 'react';
import { 
  studentCheckIn, 
  studentCheckOut, 
  getStudentAttendance, 
  getStudentStats,
  getStudentTodayStatus,
  initializeAttendanceSystem
} from '../utils/attendanceStorageService';

const StudentDashboard = ({ user, onLogout }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [myAttendance, setMyAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0
  });

  // Initialize and load data
  useEffect(() => {
    initializeAttendanceSystem();
    loadData();
  }, []);

  const loadData = () => {
    // Get today's status
    const status = getStudentTodayStatus(user.id);
    setTodayStatus(status);
    
    // Get attendance history
    const attendance = getStudentAttendance(user.id);
    setMyAttendance(attendance);
    
    // Get statistics
    const studentStats = getStudentStats(user.id);
    setStats(studentStats);
  };

  const handleCheckIn = () => {
    const result = studentCheckIn(user.id, user.name, user.rollNo, user.class);
    
    if (result.success) {
      loadData(); // Reload data
    } else {
      alert(result.message);
    }
  };

  const handleCheckOut = () => {
    const result = studentCheckOut(user.id);
    
    if (result.success) {
      loadData(); // Reload data
    } else {
      alert(result.message);
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Blue Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <button 
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Student Dashboard</h2>
      </div>
      
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Today's Status */}
        <div style={{ 
          marginBottom: '20px',
          background: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            color: '#424242', 
            fontWeight: '500',
            margin: 0
          }}>
            Today's Status: <span style={{ 
              color: todayStatus?.checkIn ? '#4CAF50' : '#F44336', 
              fontWeight: '600' 
            }}>
              {todayStatus?.checkIn ? 'Present' : 'Not Checked In'}
            </span>
          </h3>
        </div>

        {/* Attendance Report Card */}
        <div style={{ 
          marginBottom: '25px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {/* Blue Header */}
          <div style={{ 
            background: '#1976D2', 
            color: 'white', 
            padding: '15px 20px',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            Attendance Report
          </div>
          
          {/* Chart Content */}
          <div style={{ 
            background: 'white', 
            padding: '30px 20px',
          }}>
            {/* Bar Chart */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'flex-end',
              height: '200px',
              marginBottom: '10px',
              position: 'relative',
              paddingLeft: '25px'
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
                fontSize: '11px',
                color: '#999',
                paddingBottom: '20px'
              }}>
                <div>5</div>
                <div>4</div>
                <div>3</div>
                <div>2</div>
                <div>1</div>
                <div>0</div>
              </div>

              {/* Bars - showing actual attendance percentage */}
              {[
                { month: 'Jan', height: 80, color: '#4CAF50', percentage: '80%' },
                { month: 'Feb', height: 75, color: '#1976D2', percentage: '75%' },
                { month: 'Mar', height: 60, color: '#F44336', percentage: '60%' },
                { month: 'Apr', height: 85, color: '#4CAF50', percentage: '85%' },
                { month: 'Current', height: parseFloat(stats.percentage) || 0, color: parseFloat(stats.percentage) >= 75 ? '#4CAF50' : '#F44336', percentage: `${stats.percentage}%` }
              ].map((item, idx) => (
                <div key={item.month} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  {/* Percentage above bar */}
                  <div style={{ 
                    position: 'absolute',
                    bottom: `calc(${item.height}% + 5px)`,
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#1976D2'
                  }}>
                    {item.percentage}
                  </div>
                  
                  {/* Bar */}
                  <div style={{
                    width: '45px',
                    height: `${item.height}%`,
                    background: item.color,
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '5px'
                  }}></div>
                  
                  {/* Month label */}
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#616161',
                    fontWeight: '500',
                    marginTop: '5px'
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
          
          {/* Notification Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {parseFloat(stats.percentage) < 75 && (
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  !
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#424242',
                  fontSize: '14px'
                }}>
                  Low Attendance Alert: {stats.percentage}%
                </p>
              </div>
            )}

            {!todayStatus?.checkIn && (
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  !
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

            {stats.absentDays > 0 && (
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  !
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#424242',
                  fontSize: '14px'
                }}>
                  You have {stats.absentDays} absent day{stats.absentDays > 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #1976D2'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#757575' }}>Total Days</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1976D2' }}>{stats.totalDays}</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #4CAF50'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#757575' }}>Present</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50' }}>{stats.presentDays}</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #F44336'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#757575' }}>Absent</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#F44336' }}>{stats.absentDays}</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #FF9800'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#757575' }}>Attendance %</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF9800' }}>{stats.percentage}%</div>
          </div>
        </div>

        {/* Check-in/Check-out Section */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#212121', fontSize: '16px', fontWeight: '600' }}>
            Today's Attendance
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={handleCheckIn}
              disabled={todayStatus?.checkIn}
              style={{
                background: todayStatus?.checkIn ? '#E8F5E9' : '#4CAF50',
                color: todayStatus?.checkIn ? '#2E7D32' : 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: todayStatus?.checkIn ? 'not-allowed' : 'pointer',
                boxShadow: todayStatus?.checkIn ? 'none' : '0 2px 6px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {todayStatus?.checkIn ? `✓ Checked In: ${todayStatus.checkIn}` : '📍 Check In'}
            </button>
            
            <button 
              onClick={handleCheckOut}
              disabled={!todayStatus?.checkIn || todayStatus?.checkOut}
              style={{
                background: todayStatus?.checkOut ? '#E3F2FD' : (!todayStatus?.checkIn ? '#E0E0E0' : '#1976D2'),
                color: todayStatus?.checkOut ? '#1565C0' : (!todayStatus?.checkIn ? '#9E9E9E' : 'white'),
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: (!todayStatus?.checkIn || todayStatus?.checkOut) ? 'not-allowed' : 'pointer',
                boxShadow: (!todayStatus?.checkIn || todayStatus?.checkOut) ? 'none' : '0 2px 6px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {todayStatus?.checkOut ? `✓ Checked Out: ${todayStatus.checkOut}` : '🚪 Check Out'}
            </button>
            
            {todayStatus?.checkIn && todayStatus?.checkOut && (
              <div style={{ 
                color: '#2E7D32', 
                fontWeight: '600',
                background: '#E8F5E9',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '8px'
              }}>
                ✓ Attendance marked for today
              </div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1976D2',
            color: 'white',
            padding: '15px 20px',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            📋 My Attendance History
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F5F5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600' }}>Check In</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600' }}>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {myAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#757575' }}>
                      No attendance records yet. Check in to get started!
                    </td>
                  </tr>
                ) : (
                  myAttendance.reverse().map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>{record.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: record.status === 'Present' ? '#E8F5E9' : '#FFEBEE',
                          color: record.status === 'Present' ? '#2E7D32' : '#C62828'
                        }}>
                          {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>{record.checkIn}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>{record.checkOut}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;