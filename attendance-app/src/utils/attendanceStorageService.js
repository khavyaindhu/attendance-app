// Attendance Storage Service
// Manages attendance records, check-in/check-out, and student registrations

const STORAGE_KEYS = {
  USERS: 'attendance_app_users',
  CURRENT_USER: 'attendance_app_current_user',
  ATTENDANCE_RECORDS: 'attendance_app_records',
  DAILY_CHECKINS: 'attendance_app_daily_checkins'
};

// Initialize attendance storage
export const initializeAttendanceStorage = () => {
  const existingRecords = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
  const existingCheckins = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
  
  if (!existingRecords) {
    // Initialize with some sample data
    const initialRecords = [
      {
        id: 'ATT001',
        studentId: 'S001',
        studentName: 'John Doe',
        rollNo: '001',
        class: 'CS-A',
        date: '2024-02-01',
        status: 'Present',
        checkIn: '09:00 AM',
        checkOut: '05:00 PM'
      },
      {
        id: 'ATT002',
        studentId: 'S001',
        studentName: 'John Doe',
        rollNo: '001',
        class: 'CS-A',
        date: '2024-02-02',
        status: 'Absent',
        checkIn: '-',
        checkOut: '-'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(initialRecords));
  }
  
  if (!existingCheckins) {
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify({}));
  }
};

// Get all attendance records
export const getAllAttendanceRecords = () => {
  const records = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
  return records ? JSON.parse(records) : [];
};

// Get attendance records for a specific student
export const getStudentAttendance = (studentId) => {
  const allRecords = getAllAttendanceRecords();
  return allRecords.filter(record => record.studentId === studentId);
};

// Get attendance records for a specific class
export const getClassAttendance = (className) => {
  const allRecords = getAllAttendanceRecords();
  return allRecords.filter(record => record.class === className);
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get daily check-ins for today
export const getTodayCheckIns = () => {
  const checkIns = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
  const allCheckIns = checkIns ? JSON.parse(checkIns) : {};
  const today = getTodayDate();
  return allCheckIns[today] || {};
};

// Save daily check-ins
const saveDailyCheckIns = (date, checkIns) => {
  const allCheckIns = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
  const checkInsData = allCheckIns ? JSON.parse(allCheckIns) : {};
  checkInsData[date] = checkIns;
  localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(checkInsData));
};

// Student check-in
export const studentCheckIn = (studentId, studentName, rollNo, className) => {
  const today = getTodayDate();
  const todayCheckIns = getTodayCheckIns();
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Check if already checked in today
  if (todayCheckIns[studentId]?.checkIn) {
    return { 
      success: false, 
      message: 'Already checked in for today',
      time: todayCheckIns[studentId].checkIn
    };
  }
  
  // Record check-in
  todayCheckIns[studentId] = {
    studentName,
    rollNo,
    class: className,
    checkIn: time,
    checkOut: null
  };
  
  saveDailyCheckIns(today, todayCheckIns);
  
  return { success: true, time };
};

// Student check-out
export const studentCheckOut = (studentId) => {
  const today = getTodayDate();
  const todayCheckIns = getTodayCheckIns();
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Check if checked in
  if (!todayCheckIns[studentId]?.checkIn) {
    return { 
      success: false, 
      message: 'Must check in first' 
    };
  }
  
  // Check if already checked out
  if (todayCheckIns[studentId]?.checkOut) {
    return { 
      success: false, 
      message: 'Already checked out for today',
      time: todayCheckIns[studentId].checkOut
    };
  }
  
  // Record check-out
  todayCheckIns[studentId].checkOut = time;
  saveDailyCheckIns(today, todayCheckIns);
  
  // Also save to permanent attendance records
  const checkInData = todayCheckIns[studentId];
  saveAttendanceRecord({
    studentId,
    studentName: checkInData.studentName,
    rollNo: checkInData.rollNo,
    class: checkInData.class,
    status: 'Present',
    checkIn: checkInData.checkIn,
    checkOut: time,
    date: today
  });
  
  return { success: true, time };
};

// Save an attendance record
export const saveAttendanceRecord = (recordData) => {
  const allRecords = getAllAttendanceRecords();
  
  // Check if record already exists for this student on this date
  const existingIndex = allRecords.findIndex(
    r => r.studentId === recordData.studentId && r.date === recordData.date
  );
  
  const newRecord = {
    id: `ATT${Date.now()}`,
    ...recordData
  };
  
  if (existingIndex >= 0) {
    // Update existing record
    allRecords[existingIndex] = { ...allRecords[existingIndex], ...newRecord };
  } else {
    // Add new record
    allRecords.push(newRecord);
  }
  
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(allRecords));
  return { success: true };
};

// Teacher marks attendance for multiple students
export const markClassAttendance = (className, attendanceMarks) => {
  const today = getTodayDate();
  const allRecords = getAllAttendanceRecords();
  
  // Get all users to fetch student details
  const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersData ? JSON.parse(usersData) : { students: [] };
  const students = users.students.filter(s => s.class === className);
  
  const newRecords = [];
  
  students.forEach(student => {
    const status = attendanceMarks[student.id] || 'Absent';
    
    // Check if record already exists
    const existingIndex = allRecords.findIndex(
      r => r.studentId === student.id && r.date === today
    );
    
    const record = {
      id: existingIndex >= 0 ? allRecords[existingIndex].id : `ATT${Date.now()}_${student.id}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      class: student.class,
      date: today,
      status: status,
      checkIn: status === 'Present' ? '09:00 AM' : '-',
      checkOut: status === 'Present' ? '05:00 PM' : '-'
    };
    
    if (existingIndex >= 0) {
      allRecords[existingIndex] = record;
    } else {
      newRecords.push(record);
    }
  });
  
  localStorage.setItem(
    STORAGE_KEYS.ATTENDANCE_RECORDS, 
    JSON.stringify([...allRecords, ...newRecords])
  );
  
  return { success: true, message: 'Attendance marked successfully' };
};

// Get attendance statistics for a student
export const getStudentStats = (studentId) => {
  const records = getStudentAttendance(studentId);
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
  
  return {
    totalDays,
    presentDays,
    absentDays,
    percentage
  };
};

// Get attendance statistics for a class
export const getClassStats = (className) => {
  const today = getTodayDate();
  const todayRecords = getAllAttendanceRecords().filter(
    r => r.class === className && r.date === today
  );
  
  const presentCount = todayRecords.filter(r => r.status === 'Present').length;
  const absentCount = todayRecords.filter(r => r.status === 'Absent').length;
  
  return {
    presentCount,
    absentCount,
    totalCount: presentCount + absentCount
  };
};

// Get student's check-in status for today
export const getStudentTodayStatus = (studentId) => {
  const todayCheckIns = getTodayCheckIns();
  return todayCheckIns[studentId] || null;
};

// Export attendance data as CSV-ready format
export const getAttendanceForExport = (className = null) => {
  const records = className 
    ? getClassAttendance(className)
    : getAllAttendanceRecords();
  
  return records;
};

// Clear old check-in data (optional - for cleanup)
export const clearOldCheckIns = (daysToKeep = 30) => {
  const checkIns = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
  const allCheckIns = checkIns ? JSON.parse(checkIns) : {};
  
  const today = new Date();
  const cutoffDate = new Date(today.setDate(today.getDate() - daysToKeep));
  
  const filteredCheckIns = {};
  Object.keys(allCheckIns).forEach(date => {
    if (new Date(date) >= cutoffDate) {
      filteredCheckIns[date] = allCheckIns[date];
    }
  });
  
  localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(filteredCheckIns));
};

// Get all registered students from users storage
export const getAllStudents = () => {
  const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersData ? JSON.parse(usersData) : { students: [] };
  return users.students || [];
};

// Get students by class
export const getStudentsByClass = (className) => {
  const allStudents = getAllStudents();
  return allStudents.filter(s => s.class === className);
};

// Initialize everything
export const initializeAttendanceSystem = () => {
  initializeAttendanceStorage();
  // Clear check-ins older than 30 days on init
  clearOldCheckIns(30);
};