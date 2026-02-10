import { useState, useEffect } from 'react';
import { 
  getStudentsByClass, 
  markClassAttendance,
  getClassStats,
  getTodayCheckIns,
  initializeAttendanceSystem,
  getTodayDate,
  getAllAttendanceRecords
} from '../utils/attendanceStorageService';
import { CLASSES } from '../data/testData';

const TeacherDashboard = ({ user, onLogout }) => {
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [classStats, setClassStats] = useState({ presentCount: 0, absentCount: 0 });
  const [todayCheckIns, setTodayCheckIns] = useState({});

  // Initialize and load data
  useEffect(() => {
    initializeAttendanceSystem();
    loadClassData();
  }, [selectedClass]);

  const loadClassData = () => {
    // Get students from the selected class (including newly registered ones)
    const students = getStudentsByClass(selectedClass);
    setStudentsInClass(students);
    
    // Get today's check-ins
    const checkIns = getTodayCheckIns();
    setTodayCheckIns(checkIns);
    
    // Get today's already saved attendance records
    const today = getTodayDate();
    const allRecords = getAllAttendanceRecords();
    const todayRecords = allRecords.filter(r => r.date === today && r.class === selectedClass);
    
    // Initialize attendance marks
    const initialMarks = {};
    students.forEach(student => {
      // First check if attendance was already marked today
      const existingRecord = todayRecords.find(r => r.studentId === student.id);
      
      if (existingRecord) {
        // Use the saved attendance status
        initialMarks[student.id] = existingRecord.status;
      } else {
        // Check if student has checked in today
        const hasCheckedIn = checkIns[student.id]?.checkIn;
        initialMarks[student.id] = hasCheckedIn ? 'Present' : 'Absent'; // Default based on check-in
      }
    });
    setAttendanceMarks(initialMarks);
    
    // Get class statistics
    const stats = getClassStats(selectedClass);
    setClassStats(stats);
  };

  // Calculate counts based on current marks
  const presentCount = Object.values(attendanceMarks).filter(status => status === 'Present').length;
  const absentCount = studentsInClass.length - presentCount;

  const handleMarkAttendance = (studentId, status) => {
    setAttendanceMarks(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    const result = markClassAttendance(selectedClass, attendanceMarks);
    
    if (result.success) {
      alert('✓ Attendance saved successfully!');
      // Don't reload - keep the current state
      // Just update the stats
      const stats = getClassStats(selectedClass);
      setClassStats(stats);
    } else {
      alert('Error saving attendance. Please try again.');
    }
  };

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
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
            Today's Attendance - {selectedClass}
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
            Student List ({studentsInClass.length} students)
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
              onChange={(e) => handleClassChange(e.target.value)}
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
            {studentsInClass.length === 0 ? (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: '#757575',
                fontSize: '14px'
              }}>
                No students registered in this class yet.
              </div>
            ) : (
              studentsInClass.map(student => {
                const hasCheckedIn = todayCheckIns[student.id]?.checkIn;
                
                return (
                  <div 
                    key={student.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: hasCheckedIn ? '#E8F5E9' : 'transparent'
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
                      <div>
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: '500',
                          color: '#212121',
                          display: 'block'
                        }}>
                          {student.name}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#757575' 
                        }}>
                          Roll: {student.rollNo}
                          {hasCheckedIn && (
                            <span style={{ 
                              marginLeft: '8px',
                              color: '#4CAF50',
                              fontWeight: '600'
                            }}>
                              • Checked in at {todayCheckIns[student.id].checkIn}
                            </span>
                          )}
                        </span>
                      </div>
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
                );
              })
            )}
          </div>
        </div>

        {/* Mark Attendance Button */}
        <button 
          onClick={handleSaveAttendance}
          disabled={studentsInClass.length === 0}
          style={{
            width: '100%',
            background: studentsInClass.length === 0 ? '#E0E0E0' : '#FFC107',
            color: studentsInClass.length === 0 ? '#9E9E9E' : '#000',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: studentsInClass.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: studentsInClass.length === 0 ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          💾 Save Attendance
        </button>

        {/* Info Card */}
        <div style={{
          marginTop: '20px',
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
            ℹ️ Info:
          </h4>
          <div style={{ fontSize: '12px', color: '#424242', lineHeight: '1.6' }}>
            • Students with green highlight have checked in today<br />
            • Click on any student to toggle attendance<br />
            • New registrations appear automatically<br />
            • Attendance is saved to local storage
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;