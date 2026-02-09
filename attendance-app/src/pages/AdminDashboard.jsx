import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ATTENDANCE_DATA, USERS, CLASSES } from '../data/testData';
import { exportToCSV } from '../utils/helpers';

const AdminDashboard = ({ user, onLogout }) => {
  const [filterClass, setFilterClass] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Get all dates from attendance data
  const allDates = [...new Set(ATTENDANCE_DATA.map(r => r.date))];

  // Filter attendance data
  let filteredData = ATTENDANCE_DATA;
  
  if (filterClass !== 'All') {
    filteredData = filteredData.filter(r => r.class === filterClass);
  }
  
  if (filterDate !== 'All') {
    filteredData = filteredData.filter(r => r.date === filterDate);
  }
  
  if (filterStatus !== 'All') {
    filteredData = filteredData.filter(r => r.status === filterStatus);
  }

  // Calculate overall stats
  const totalStudents = USERS.students.length;
  const totalRecords = ATTENDANCE_DATA.length;
  const presentCount = ATTENDANCE_DATA.filter(r => r.status === 'Present').length;
  const absentCount = totalRecords - presentCount;
  const overallAttendance = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  const handleExport = () => {
    exportToCSV(filteredData, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    alert('PDF export would be implemented with a library like jsPDF');
    console.log('Exporting to PDF:', filteredData);
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>← Admin Panel</h2>
          <p>View comprehensive attendance reports and analytics</p>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card">
            <div className="action-card-icon">👥</div>
            <h3>Manage Students</h3>
          </div>
          <div className="action-card" style={{ background: '#FF9800' }}>
            <div className="action-card-icon">👨‍🏫</div>
            <h3>Manage Teachers</h3>
          </div>
          <div className="action-card" style={{ background: '#4CAF50' }}>
            <div className="action-card-icon">📊</div>
            <h3>Attendance Reports</h3>
          </div>
          <div className="action-card" style={{ background: '#9C27B0' }}>
            <div className="action-card-icon">📈</div>
            <h3>Analytics</h3>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button className="btn btn-warning" onClick={handleExportPDF} style={{ flex: '1', minWidth: '200px' }}>
            📄 Export to PDF
          </button>
          <button className="btn btn-success" onClick={handleExport} style={{ flex: '1', minWidth: '200px' }}>
            📊 Export to Excel
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="stat-value">{totalStudents}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#FF9800' }}>
            <h3>Total Records</h3>
            <div className="stat-value" style={{ color: '#FF9800' }}>{totalRecords}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#4CAF50' }}>
            <h3>Present</h3>
            <div className="stat-value" style={{ color: '#4CAF50' }}>{presentCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#1976D2' }}>
            <h3>Overall %</h3>
            <div className="stat-value">{overallAttendance}%</div>
          </div>
        </div>

        {/* Class-wise Statistics */}
        <div className="table-container" style={{ marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '20px', color: '#212121' }}>📚 Class-wise Attendance</h3>
          <div className="stats-grid">
            {CLASSES.map(cls => {
              const classRecords = ATTENDANCE_DATA.filter(r => r.class === cls);
              const classPresent = classRecords.filter(r => r.status === 'Present').length;
              const classPercentage = classRecords.length > 0 
                ? ((classPresent / classRecords.length) * 100).toFixed(1) 
                : 0;
              
              return (
                <div key={cls} className="stat-card" style={{ 
                  borderLeftColor: classPercentage >= 75 ? '#4CAF50' : '#F44336' 
                }}>
                  <h3>{cls}</h3>
                  <div className="stat-value" style={{ 
                    color: classPercentage >= 75 ? '#4CAF50' : '#F44336' 
                  }}>{classPercentage}%</div>
                  <p style={{ fontSize: '12px', color: '#757575', marginTop: '5px' }}>
                    {classPresent}/{classRecords.length} Present
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Records with Filters */}
        <div className="table-container">
          <div className="table-header">
            <h3>📋 Attendance Records</h3>
          </div>

          {/* Filters */}
          <div className="filters" style={{ marginTop: '15px' }}>
            <div className="filter-group">
              <label>Class</label>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="All">All Classes</option>
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date</label>
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                <option value="All">All Dates</option>
                {allDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          {/* Records Table */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td><strong>{record.rollNo}</strong></td>
                    <td>{record.studentName}</td>
                    <td><span style={{ 
                      background: '#E3F2FD', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1976D2'
                    }}>{record.class}</span></td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                        {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
                      </span>
                    </td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                    <div>No records found matching the filters</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredData.length > 0 && (
            <div style={{ 
              marginTop: '15px', 
              padding: '12px',
              background: '#E3F2FD',
              borderRadius: '4px',
              color: '#1976D2', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              📊 Showing {filteredData.length} record(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
