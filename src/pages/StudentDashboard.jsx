import { useState, useEffect } from 'react';
import { 
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
    const status = getStudentTodayStatus(user.id);
    setTodayStatus(status);

    const attendance = getStudentAttendance(user.id);
    setMyAttendance(attendance);

    const studentStats = getStudentStats(user.id);
    setStats(studentStats);
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── Blue Header ──────────────────────────────────────────────────── */}
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

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>

        {/* ── Today's Status ───────────────────────────────────────────────── */}
        <div style={{
          marginBottom: '20px',
          background: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '16px', color: '#424242', fontWeight: '500', margin: 0 }}>
            Today's Status:{' '}
            <span style={{
              color: todayStatus?.status === 'Present' ? '#4CAF50' : '#F44336',
              fontWeight: '600'
            }}>
              {todayStatus?.status === 'Present' ? 'Present' : 'Not Marked'}
            </span>
          </h3>
          {/* Show today's subject and time if marked */}
          {todayStatus?.subject && (
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#757575' }}>
              📚 {todayStatus.subject}
              {todayStatus.time && (
                <span style={{ marginLeft: '10px' }}>🕐 {todayStatus.time}</span>
              )}
            </p>
          )}
        </div>

        {/* ── Attendance Report (Bar Chart) ────────────────────────────────── */}
        <div style={{
          marginBottom: '25px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            background: '#1976D2',
            color: 'white',
            padding: '15px 20px',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            Attendance Report
          </div>

          <div style={{ background: 'white', padding: '30px 20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              height: '200px',
              marginBottom: '10px',
              position: 'relative',
              paddingLeft: '25px'
            }}>
              {/* Y-axis */}
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
                {['100', '80', '60', '40', '20', '0'].map(v => <div key={v}>{v}</div>)}
              </div>

              {/* Bars */}
              {[
                { month: 'Jan',     height: 80, color: '#4CAF50', percentage: '80%' },
                { month: 'Feb',     height: 75, color: '#1976D2', percentage: '75%' },
                { month: 'Mar',     height: 60, color: '#F44336', percentage: '60%' },
                { month: 'Apr',     height: 85, color: '#4CAF50', percentage: '85%' },
                {
                  month: 'Current',
                  height: parseFloat(stats.percentage) || 0,
                  color: parseFloat(stats.percentage) >= 75 ? '#4CAF50' : '#F44336',
                  percentage: `${stats.percentage}%`
                }
              ].map((item) => (
                <div key={item.month} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: `calc(${item.height}% + 5px)`,
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#1976D2'
                  }}>
                    {item.percentage}
                  </div>
                  <div style={{
                    width: '45px',
                    height: `${item.height}%`,
                    background: item.color,
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '5px'
                  }}></div>
                  <div style={{ fontSize: '12px', color: '#616161', fontWeight: '500', marginTop: '5px' }}>
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Notifications ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '15px', color: '#424242', fontSize: '18px', fontWeight: '600' }}>
            Notifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Low attendance warning */}
            {parseFloat(stats.percentage) < 75 && (
              <div style={{
                background: 'white', padding: '15px', borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#FFC107', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  fontSize: '16px', fontWeight: '700', color: 'white'
                }}>!</div>
                <p style={{ margin: 0, color: '#424242', fontSize: '14px' }}>
                  Low Attendance Alert: {stats.percentage}%
                </p>
              </div>
            )}

            {/* Not marked today */}
            {todayStatus?.status !== 'Present' && (
              <div style={{
                background: 'white', padding: '15px', borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#FFC107', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  fontSize: '16px', fontWeight: '700', color: 'white'
                }}>!</div>
                <p style={{ margin: 0, color: '#424242', fontSize: '14px' }}>
                  Your attendance has not been marked for today.
                </p>
              </div>
            )}

            {/* Absent days */}
            {stats.absentDays > 0 && (
              <div style={{
                background: 'white', padding: '15px', borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#FFC107', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  fontSize: '16px', fontWeight: '700', color: 'white'
                }}>!</div>
                <p style={{ margin: 0, color: '#424242', fontSize: '14px' }}>
                  You have {stats.absentDays} absent day{stats.absentDays > 1 ? 's' : ''}.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '25px'
        }}>
          {[
            { label: 'Total Days',    value: stats.totalDays,   color: '#1976D2' },
            { label: 'Present',       value: stats.presentDays, color: '#4CAF50' },
            { label: 'Absent',        value: stats.absentDays,  color: '#F44336' },
            { label: 'Attendance %',  value: `${stats.percentage}%`, color: '#FF9800' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${color}`
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#757575' }}>{label}</h3>
              <div style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Attendance History ───────────────────────────────────────────── */}
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
                  {['Date', 'Status', 'Subject', 'Time'].map((heading) => (
                    <th key={heading} style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      color: '#616161',
                      fontWeight: '600'
                    }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#757575' }}>
                      No attendance records yet. Your teacher will mark attendance for you.
                    </td>
                  </tr>
                ) : (
                  [...myAttendance].reverse().map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #F0F0F0' }}>

                      {/* Date */}
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>
                        {record.date}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: record.status === 'Present' ? '#E8F5E9' : '#FFEBEE',
                          color:      record.status === 'Present' ? '#2E7D32' : '#C62828'
                        }}>
                          {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
                        </span>
                      </td>

                      {/* Subject */}
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>
                        {record.subject ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#E3F2FD',
                            color: '#1565C0',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            📚 {record.subject}
                          </span>
                        ) : (
                          <span style={{ color: '#BDBDBD', fontSize: '12px' }}>—</span>
                        )}
                      </td>

                      {/* Time */}
                      <td style={{ padding: '12px', fontSize: '13px', color: '#424242' }}>
                        {record.time ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#616161',
                            fontSize: '12px'
                          }}>
                            🕐 {record.time}
                          </span>
                        ) : (
                          <span style={{ color: '#BDBDBD', fontSize: '12px' }}>—</span>
                        )}
                      </td>

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