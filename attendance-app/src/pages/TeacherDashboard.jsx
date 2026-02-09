import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ATTENDANCE_DATA, USERS, CLASSES } from '../data/testData';
import { exportToCSV } from '../utils/helpers';

const TeacherDashboard = ({ user, onLogout }) => {
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [attendanceMarks, setAttendanceMarks] = useState({});

  // Get students for selected class
  const studentsInClass = USERS.students.filter(s => s.class === selectedClass);

  // Initialize attendance marks for students
  useState(() => {
    const initialMarks = {};
    studentsInClass.forEach(student => {
      initialMarks[student.id] = 'Present'; // Default all to Present
    });
    setAttendanceMarks(initialMarks);
  }, [selectedClass]);

  // Calculate counts
  const presentCount = Object.values(attendanceMarks).filter(status => status === 'Present').length;
  const absentCount = studentsInClass.length - presentCount;

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
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Teacher Dashboard</h2>
      </div>
      
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Today's Attendance Summary */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#212121' 
          }}>
            Today's Attendance
          </h3>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '15px' 
          }}>
            <div style={{ 
              flex: '1',
              background: '#4CAF50', 
              padding: '15px', 
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>Present:</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{presentCount}</div>
            </div>
            
            <div style={{ 
              flex: '1',
              background: '#F44336', 
              padding: '15px', 
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>Absent:</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{absentCount}</div>
            </div>
          </div>

          <button 
            style={{
              width: '100%',
              background: '#1976D2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <span style={{ fontSize: '20px' }}>📱</span>
            Scan QR Code
          </button>
        </div>

        {/* Student List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#212121' 
          }}>
            Student List
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px',
              color: '#666',
              fontWeight: '500'
            }}>
              Select Class
            </label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                background: 'white'
              }}
            >
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Student Checkboxes */}
          <div style={{ marginBottom: '15px' }}>
            {studentsInClass.map(student => (
              <div 
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                onClick={() => handleMarkAttendance(
                  student.id, 
                  attendanceMarks[student.id] === 'Present' ? 'Absent' : 'Present'
                )}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={attendanceMarks[student.id] === 'Present'}
                    onChange={() => {}}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#4CAF50'
                    }}
                  />
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: '500',
                    color: '#212121'
                  }}>
                    {student.name}
                  </span>
                </div>

                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: attendanceMarks[student.id] === 'Present' ? '#E8F5E9' : '#FFEBEE',
                  color: attendanceMarks[student.id] === 'Present' ? '#2E7D32' : '#C62828',
                  border: attendanceMarks[student.id] === 'Present' ? '1px solid #4CAF50' : '1px solid #F44336'
                }}>
                  {attendanceMarks[student.id] === 'Present' ? '✓ Present' : '✗ Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mark Attendance Button */}
        <button 
          onClick={handleSaveAttendance}
          style={{
            width: '100%',
            background: '#FFC107',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;




// import { useState } from 'react';
// import Navbar from '../components/Navbar';
// import { ATTENDANCE_DATA, USERS, CLASSES } from '../data/testData';
// import { exportToCSV } from '../utils/helpers';

// const TeacherDashboard = ({ user, onLogout }) => {
//   const [selectedClass, setSelectedClass] = useState('CS-A');
//   const [selectedDate, setSelectedDate] = useState('2024-02-01');
//   const [attendanceMarks, setAttendanceMarks] = useState({});

//   // Get students for selected class
//   const studentsInClass = USERS.students.filter(s => s.class === selectedClass);

//   // Filter attendance data
//   const filteredAttendance = ATTENDANCE_DATA.filter(
//     record => record.class === selectedClass
//   );

//   // Calculate stats
//   const totalRecords = filteredAttendance.length;
//   const presentCount = filteredAttendance.filter(r => r.status === 'Present').length;
//   const absentCount = totalRecords - presentCount;
//   const avgAttendance = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

//   const handleMarkAttendance = (studentId, status) => {
//     setAttendanceMarks(prev => ({
//       ...prev,
//       [studentId]: status
//     }));
//   };

//   const handleSaveAttendance = () => {
//     alert('Attendance saved successfully! (This would save to backend)');
//     console.log('Attendance marks:', attendanceMarks);
//   };

//   const handleExport = () => {
//     exportToCSV(filteredAttendance, `attendance_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
//   };

//   return (
//     <div className="dashboard">
//       <Navbar user={user} onLogout={onLogout} />
      
//       <div className="dashboard-content">
//         {/* <div className="dashboard-header">
//           <h2>← Teacher Dashboard</h2>
//           <p>Mark and view student attendance</p>
//         </div> */}

//         {/* Today's Attendance Summary */}
//         <div className="table-container" style={{ marginBottom: '20px' }}>
//           <h3 style={{ marginBottom: '15px', color: '#212121' }}>Today's Attendance</h3>
//           <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
//             <div style={{ 
//               flex: '1', 
//               minWidth: '120px',
//               background: '#E8F5E9', 
//               padding: '15px', 
//               borderRadius: '8px',
//               borderLeft: '4px solid #4CAF50'
//             }}>
//               <div style={{ fontSize: '12px', color: '#2E7D32', marginBottom: '5px' }}>Present</div>
//               <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>{presentCount}</div>
//             </div>
//             <div style={{ 
//               flex: '1', 
//               minWidth: '120px',
//               background: '#FFEBEE', 
//               padding: '15px', 
//               borderRadius: '8px',
//               borderLeft: '4px solid #F44336'
//             }}>
//               <div style={{ fontSize: '12px', color: '#C62828', marginBottom: '5px' }}>Absent</div>
//               <div style={{ fontSize: '24px', fontWeight: '700', color: '#F44336' }}>{absentCount}</div>
//             </div>
//           </div>
//           <div style={{ marginTop: '15px' }}>
//             <button className="btn btn-primary" style={{ width: '100%' }}>
//               📱 Scan QR Code
//             </button>
//           </div>
//         </div>

//         {/* Mark Attendance Section */}
//         <div className="table-container" style={{ marginBottom: '25px' }}>
//           <div className="table-header">
//             <h3>📝 Student List - Mark Attendance</h3>
//             <div className="filters">
//               <div className="filter-group">
//                 <label>Class</label>
//                 <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//                   {CLASSES.map(cls => (
//                     <option key={cls} value={cls}>{cls}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="filter-group">
//                 <label>Date</label>
//                 <input 
//                   type="date" 
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           <div style={{ marginTop: '20px' }}>
//             {studentsInClass.map(student => (
//               <div key={student.id} className="checkbox-item">
//                 <input 
//                   type="checkbox" 
//                   id={student.id}
//                   checked={attendanceMarks[student.id] === 'Present'}
//                   onChange={(e) => handleMarkAttendance(student.id, e.target.checked ? 'Present' : 'Absent')}
//                 />
//                 <label htmlFor={student.id}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//                     <span style={{ fontWeight: '500' }}>{student.name}</span>
//                     <span style={{ 
//                       padding: '4px 10px', 
//                       borderRadius: '4px',
//                       fontSize: '11px',
//                       fontWeight: '600',
//                       background: attendanceMarks[student.id] === 'Present' ? '#E8F5E9' : '#FFEBEE',
//                       color: attendanceMarks[student.id] === 'Present' ? '#2E7D32' : '#C62828'
//                     }}>
//                       {attendanceMarks[student.id] === 'Present' ? '✓ Present' : '✗ Absent'}
//                     </span>
//                   </div>
//                   <div style={{ fontSize: '12px', color: '#757575' }}>Roll No: {student.rollNo}</div>
//                 </label>
//               </div>
//             ))}
//           </div>

//           <div style={{ marginTop: '20px' }}>
//             <button className="btn btn-warning" onClick={handleSaveAttendance} style={{ width: '100%' }}>
//               💾 Mark Attendance
//             </button>
//           </div>
//         </div>

//         {/* Attendance Records */}
//         <div className="table-container">
//           <div className="table-header">
//             <h3>📊 Attendance Records - {selectedClass}</h3>
//             <div className="table-actions">
//               <button className="btn btn-success" onClick={handleExport}>
//                 📊 Export to Excel
//               </button>
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Roll No</th>
//                 <th>Student Name</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Check In</th>
//                 <th>Check Out</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAttendance.map((record) => (
//                 <tr key={record.id}>
//                   <td>{record.rollNo}</td>
//                   <td>{record.studentName}</td>
//                   <td>{record.date}</td>
//                   <td>
//                     <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
//                       {record.status === 'Present' ? '✓ ' : '✗ '}{record.status}
//                     </span>
//                   </td>
//                   <td>{record.checkIn}</td>
//                   <td>{record.checkOut}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;
