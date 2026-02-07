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
          <h2>Admin Dashboard</h2>
          <p>View comprehensive attendance reports and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="stat-value">{totalStudents}</div>
          </div>
          <div className="stat-card">
            <h3>Total Records</h3>
            <div className="stat-value">{totalRecords}</div>
          </div>
          <div className="stat-card">
            <h3>Present</h3>
            <div className="stat-value" style={{ color: '#28a745' }}>{presentCount}</div>
          </div>
          <div className="stat-card">
            <h3>Overall Attendance</h3>
            <div className="stat-value">{overallAttendance}%</div>
          </div>
        </div>

        {/* Class-wise Statistics */}
        <div className="table-container" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Class-wise Attendance</h3>
          <div className="stats-grid">
            {CLASSES.map(cls => {
              const classRecords = ATTENDANCE_DATA.filter(r => r.class === cls);
              const classPresent = classRecords.filter(r => r.status === 'Present').length;
              const classPercentage = classRecords.length > 0 
                ? ((classPresent / classRecords.length) * 100).toFixed(1) 
                : 0;
              
              return (
                <div key={cls} className="stat-card">
                  <h3>{cls}</h3>
                  <div className="stat-value">{classPercentage}%</div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
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
            <h3>Attendance Records</h3>
            <div className="table-actions">
              <button className="btn btn-success" onClick={handleExport}>
                📊 Export to Excel
              </button>
              <button className="btn btn-danger" onClick={handleExportPDF}>
                📄 Export to PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
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
                    <td>{record.rollNo}</td>
                    <td>{record.studentName}</td>
                    <td>{record.class}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    No records found matching the filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredData.length > 0 && (
            <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
              Showing {filteredData.length} record(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
