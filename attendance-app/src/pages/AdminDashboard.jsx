import { useState, useEffect } from 'react';
import { 
  getAllAttendanceRecords,
  getAttendanceForExport,
  getAllStudents,
  initializeAttendanceSystem
} from '../utils/attendanceStorageService';
import { getAllUsers } from '../utils/localStorageService';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalAttendanceRecords: 0
  });
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);

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

  const handleExport = () => {
    const data = getAttendanceForExport();
    
    if (data.length === 0) {
      alert('No attendance data to export');
      return;
    }
    
    // Convert to CSV
    const headers = ['Date', 'Student Name', 'Roll No', 'Class', 'Status', 'Check In', 'Check Out'];
    const csvContent = [
      headers.join(','),
      ...data.map(record => [
        record.date,
        record.studentName,
        record.rollNo,
        record.class,
        record.status,
        record.checkIn,
        record.checkOut
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('✓ Attendance data exported successfully!');
  };

  const handleExportPDF = () => {
    alert('PDF export would be implemented with a library like jsPDF.\n\nFor now, please use the Excel export option.');
  };

  const handleManageStudents = () => {
    const students = getAllStudents();
    setModalData(students);
    setModalType('students');
  };

  const handleManageTeachers = () => {
    const allUsers = getAllUsers();
    setModalData(allUsers.teachers || []);
    setModalType('teachers');
  };

  const handleViewReports = () => {
    const records = getAllAttendanceRecords();
    setModalData(records);
    setModalType('reports');
  };

  const handleViewAnalytics = () => {
    const records = getAllAttendanceRecords();
    const presentRecords = records.filter(r => r.status === 'Present').length;
    const absentRecords = records.filter(r => r.status === 'Absent').length;
    const percentage = records.length > 0 ? ((presentRecords / records.length) * 100).toFixed(1) : 0;
    
    setModalData({
      totalRecords: records.length,
      presentRecords,
      absentRecords,
      percentage
    });
    setModalType('analytics');
  };

  const closeModal = () => {
    setModalData(null);
    setModalType(null);
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
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Admin Panel</h2>
      </div>
      
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #1976D2'
          }}>
            <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Total Students</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1976D2' }}>{stats.totalStudents}</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #4CAF50'
          }}>
            <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Total Teachers</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50' }}>{stats.totalTeachers}</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #FF9800'
          }}>
            <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Total Admins</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF9800' }}>{stats.totalAdmins}</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #F44336'
          }}>
            <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Attendance Records</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#F44336' }}>{stats.totalAttendanceRecords}</div>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div 
            onClick={handleManageStudents}
            style={{
              background: '#1976D2',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Manage Students</h3>
          </div>

          <div 
            onClick={handleManageTeachers}
            style={{
              background: '#1976D2',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🏫</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Manage Teachers</h3>
          </div>

          <div 
            onClick={handleViewReports}
            style={{
              background: '#1976D2',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Attendance Reports</h3>
          </div>

          <div 
            onClick={handleViewAnalytics}
            style={{
              background: '#1976D2',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Analytics</h3>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <button 
            onClick={handleExportPDF}
            style={{
              background: '#FFC107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>📄</span>
            Export to PDF
          </button>

          <button 
            onClick={handleExport}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>📊</span>
            Export to Excel (CSV)
          </button>
        </div>

        {/* Info Card */}
        <div style={{
          padding: '15px',
          background: '#E3F2FD',
          borderRadius: '8px',
          borderLeft: '4px solid #1976D2'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#1565C0',
            fontWeight: '600'
          }}>
            ℹ️ Admin Features:
          </h4>
          <div style={{ fontSize: '12px', color: '#424242', lineHeight: '1.6' }}>
            • View all registered users (students, teachers, admins)<br />
            • Export attendance data to CSV/Excel<br />
            • View comprehensive analytics<br />
            • All data stored in browser's localStorage<br />
            • Data persists across sessions
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalData && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: '#1976D2',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {modalType === 'students' && '👥 Student Management'}
                {modalType === 'teachers' && '👨‍🏫 Teacher Management'}
                {modalType === 'reports' && '📊 Attendance Reports'}
                {modalType === 'analytics' && '📈 Analytics Dashboard'}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1
            }}>
              {/* Students Modal */}
              {modalType === 'students' && (
                <div>
                  <div style={{
                    background: '#E3F2FD',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#1565C0'
                  }}>
                    Total Students: <strong>{modalData.length}</strong>
                  </div>

                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>
                      No students registered yet
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F5F5F5' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Class</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Roll No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.map((student, index) => (
                            <tr key={student.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{student.name}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{student.email}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>
                                <span style={{
                                  padding: '4px 8px',
                                  background: '#E3F2FD',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#1976D2'
                                }}>
                                  {student.class}
                                </span>
                              </td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{student.rollNo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Teachers Modal */}
              {modalType === 'teachers' && (
                <div>
                  <div style={{
                    background: '#E8F5E9',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#2E7D32'
                  }}>
                    Total Teachers: <strong>{modalData.length}</strong>
                  </div>

                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>
                      No teachers registered yet
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F5F5F5' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Department</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.map((teacher, index) => (
                            <tr key={teacher.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{teacher.name}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{teacher.email}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>
                                <span style={{
                                  padding: '4px 8px',
                                  background: '#E8F5E9',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#4CAF50'
                                }}>
                                  {teacher.department}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Reports Modal */}
              {modalType === 'reports' && (
                <div>
                  <div style={{
                    background: '#FFF3E0',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#E65100'
                  }}>
                    Total Records: <strong>{modalData.length}</strong>
                  </div>

                  {modalData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>
                      No attendance records yet
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F5F5F5' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Student</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Class</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#616161', fontWeight: '600', borderBottom: '2px solid #E0E0E0' }}>Check In</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.slice().reverse().map((record, index) => (
                            <tr key={record.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{record.date}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{record.studentName}</td>
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>
                                <span style={{
                                  padding: '4px 8px',
                                  background: '#E3F2FD',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#1976D2'
                                }}>
                                  {record.class}
                                </span>
                              </td>
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
                              <td style={{ padding: '12px', fontSize: '14px', color: '#424242' }}>{record.checkIn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Modal */}
              {modalType === 'analytics' && (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      background: '#E3F2FD',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      borderLeft: '4px solid #1976D2'
                    }}>
                      <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Total Records</div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#1976D2' }}>{modalData.totalRecords}</div>
                    </div>

                    <div style={{
                      background: '#E8F5E9',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      borderLeft: '4px solid #4CAF50'
                    }}>
                      <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Present</div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#4CAF50' }}>{modalData.presentRecords}</div>
                    </div>

                    <div style={{
                      background: '#FFEBEE',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      borderLeft: '4px solid #F44336'
                    }}>
                      <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Absent</div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#F44336' }}>{modalData.absentRecords}</div>
                    </div>

                    <div style={{
                      background: '#FFF3E0',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      borderLeft: '4px solid #FF9800'
                    }}>
                      <div style={{ fontSize: '12px', color: '#757575', marginBottom: '8px' }}>Attendance %</div>
                      <div style={{ fontSize: '36px', fontWeight: '700', color: '#FF9800' }}>{modalData.percentage}%</div>
                    </div>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0'
                  }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#424242' }}>
                      Attendance Distribution
                    </h4>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#424242', fontWeight: '500' }}>Present</span>
                        <span style={{ fontSize: '14px', color: '#4CAF50', fontWeight: '600' }}>{modalData.presentRecords}</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '30px', 
                        background: '#E0E0E0', 
                        borderRadius: '15px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${modalData.totalRecords > 0 ? (modalData.presentRecords / modalData.totalRecords * 100) : 0}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#424242', fontWeight: '500' }}>Absent</span>
                        <span style={{ fontSize: '14px', color: '#F44336', fontWeight: '600' }}>{modalData.absentRecords}</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '30px', 
                        background: '#E0E0E0', 
                        borderRadius: '15px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${modalData.totalRecords > 0 ? (modalData.absentRecords / modalData.totalRecords * 100) : 0}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #F44336 0%, #EF5350 100%)',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#E3F2FD',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1565C0',
                    textAlign: 'center'
                  }}>
                    Overall attendance rate: <strong>{modalData.percentage}%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '15px 20px',
              borderTop: '1px solid #E0E0E0',
              background: '#FAFAFA',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeModal}
                style={{
                  background: '#1976D2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;