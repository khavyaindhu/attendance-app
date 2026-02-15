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

// ── Subjects list (move to testData.js and import if preferred) ──────────────
const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'English',
  'Biology',
  'other',
];

const TeacherDashboard = ({ user, onLogout }) => {
  const [selectedClass,   setSelectedClass]   = useState('CS-A');
  const [selectedDate,    setSelectedDate]    = useState(getTodayDate());
  const [selectedTime,    setSelectedTime]    = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [selectedSubject, setSelectedSubject] = useState('');

  const [attendanceMarks,  setAttendanceMarks]  = useState({});
  const [studentsInClass,  setStudentsInClass]  = useState([]);
  const [classStats,       setClassStats]       = useState({ presentCount: 0, absentCount: 0 });
  const [todayCheckIns,    setTodayCheckIns]    = useState({});
  const [saveMessage,      setSaveMessage]      = useState('');

  // ── Load / reload whenever class or date changes ─────────────────────────
  useEffect(() => {
    initializeAttendanceSystem();
    loadClassData();
  }, [selectedClass, selectedDate]);

  const loadClassData = () => {
    const students = getStudentsByClass(selectedClass);
    setStudentsInClass(students);

    const checkIns = getTodayCheckIns();
    setTodayCheckIns(checkIns);

    const isToday    = selectedDate === getTodayDate();
    const allRecords = getAllAttendanceRecords();
    const dateRecords = allRecords.filter(
      (r) => r.date === selectedDate && r.class === selectedClass
    );

    const initialMarks = {};
    students.forEach((student) => {
      const existingRecord = dateRecords.find((r) => r.studentId === student.id);
      if (existingRecord) {
        initialMarks[student.id] = existingRecord.status;
      } else {
        // Auto-detect check-in only for today; default Absent for past/future dates
        const hasCheckedIn = isToday && checkIns[student.id]?.checkIn;
        initialMarks[student.id] = hasCheckedIn ? 'Present' : 'Absent';
      }
    });
    setAttendanceMarks(initialMarks);

    const stats = getClassStats(selectedClass);
    setClassStats(stats);
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const presentCount = Object.values(attendanceMarks).filter((s) => s === 'Present').length;
  const absentCount  = studentsInClass.length - presentCount;
  const isToday      = selectedDate === getTodayDate();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleMarkAttendance = (studentId, status) => {
    setAttendanceMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    if (!selectedSubject) {
      alert('Please select a subject before saving.');
      return;
    }

    const result = markClassAttendance(selectedClass, attendanceMarks, {
      date:    selectedDate,
      time:    selectedTime,
      subject: selectedSubject,
    });

    if (result.success) {
      setSaveMessage(
        `✓ Attendance saved for ${selectedSubject} on ${selectedDate} at ${selectedTime}`
      );
      setTimeout(() => setSaveMessage(''), 4000);
      const stats = getClassStats(selectedClass);
      setClassStats(stats);
    } else {
      alert('Error saving attendance. Please try again.');
    }
  };

  // ── Shared input style ────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    background: 'white',
    boxSizing: 'border-box',
    color: '#212121',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── Blue Header ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px',
          }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Teacher Dashboard</h2>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>

        {/* ── Today's Attendance Summary ──────────────────────────────────── */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#212121' }}>
            {isToday ? "Today's" : selectedDate} Attendance — {selectedClass}
          </h3>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              flex: '1',
              background: '#4CAF50',
              padding: '15px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>Present</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{presentCount}</div>
            </div>

            <div style={{
              flex: '1',
              background: '#F44336',
              padding: '15px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>Absent</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{absentCount}</div>
            </div>

            <div style={{
              flex: '1',
              background: '#1976D2',
              padding: '15px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.9 }}>Total</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{studentsInClass.length}</div>
            </div>
          </div>
        </div>

        {/* ── Session Details Card ────────────────────────────────────────── */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#212121' }}>
            🗓️ Session Details
          </h3>

          {/* Row 1: Date + Time */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>📅 Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>🕐 Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2: Class + Subject */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>🏫 Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={inputStyle}
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>📚 Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  ...inputStyle,
                  border: !selectedSubject ? '1px solid #FFC107' : '1px solid #ddd',
                }}
              >
                <option value="">— Select —</option>
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject warning hint */}
          {!selectedSubject && (
            <p style={{
              margin: '10px 0 0 0',
              fontSize: '12px',
              color: '#E65100',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              ⚠️ Select a subject to enable saving attendance.
            </p>
          )}
        </div>

        {/* ── Student List ────────────────────────────────────────────────── */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#212121' }}>
            👥 Student List ({studentsInClass.length} students)
          </h3>

          {/* Bulk actions */}
          {studentsInClass.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => {
                  const all = {};
                  studentsInClass.forEach((s) => (all[s.id] = 'Present'));
                  setAttendanceMarks(all);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  border: '1px solid #4CAF50',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ✓ All Present
              </button>
              <button
                onClick={() => {
                  const all = {};
                  studentsInClass.forEach((s) => (all[s.id] = 'Absent'));
                  setAttendanceMarks(all);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#FFEBEE',
                  color: '#C62828',
                  border: '1px solid #F44336',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ✗ All Absent
              </button>
            </div>
          )}

          {/* Student rows */}
          {studentsInClass.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#757575', fontSize: '14px' }}>
              No students registered in this class yet.
            </div>
          ) : (
            studentsInClass.map((student) => {
              const hasCheckedIn = isToday && todayCheckIns[student.id]?.checkIn;
              const isPresent    = attendanceMarks[student.id] === 'Present';

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
                    background: isPresent ? '#F1F8E9' : 'transparent',
                    borderRadius: '6px',
                    marginBottom: '2px',
                    transition: 'background 0.15s',
                  }}
                  onClick={() =>
                    handleMarkAttendance(student.id, isPresent ? 'Absent' : 'Present')
                  }
                >
                  {/* Left: checkbox + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={() => {}}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#4CAF50' }}
                    />
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#212121', display: 'block' }}>
                        {student.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#757575' }}>
                        Roll: {student.rollNo}
                        {hasCheckedIn && (
                          <span style={{ marginLeft: '8px', color: '#4CAF50', fontWeight: '600' }}>
                            • Checked in {todayCheckIns[student.id].checkIn}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right: status badge */}
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: isPresent ? '#E8F5E9' : '#FFEBEE',
                    color:      isPresent ? '#2E7D32' : '#C62828',
                    border:     isPresent ? '1px solid #4CAF50' : '1px solid #F44336',
                    whiteSpace: 'nowrap',
                  }}>
                    {isPresent ? '✓ Present' : '✗ Absent'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* ── Save button ─────────────────────────────────────────────────── */}
        <button
          onClick={handleSaveAttendance}
          disabled={studentsInClass.length === 0 || !selectedSubject}
          style={{
            width: '100%',
            background:
              studentsInClass.length === 0 || !selectedSubject ? '#E0E0E0' : '#FFC107',
            color:
              studentsInClass.length === 0 || !selectedSubject ? '#9E9E9E' : '#212121',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor:
              studentsInClass.length === 0 || !selectedSubject ? 'not-allowed' : 'pointer',
            boxShadow:
              studentsInClass.length === 0 || !selectedSubject
                ? 'none'
                : '0 4px 12px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          💾 Save Attendance
        </button>

        {/* Success message */}
        {saveMessage && (
          <div style={{
            marginTop: '12px',
            padding: '14px',
            background: '#E8F5E9',
            borderRadius: '8px',
            color: '#2E7D32',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #A5D6A7',
          }}>
            {saveMessage}
          </div>
        )}

        {/* ── Info card ───────────────────────────────────────────────────── */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#E3F2FD',
          borderRadius: '8px',
          borderLeft: '4px solid #1976D2',
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1565C0', fontWeight: '600' }}>
            ℹ️ How it works
          </h4>
          <div style={{ fontSize: '12px', color: '#424242', lineHeight: '1.8' }}>
            • Pick a <strong>date</strong>, <strong>time</strong>, and <strong>subject</strong> before saving<br />
            • Students shown in <strong>green</strong> checked in today (today only)<br />
            • Click any student row to toggle Present / Absent<br />
            • Use <strong>All Present / All Absent</strong> buttons for quick bulk marking<br />
            • Changing the date auto-loads any previously saved records
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;