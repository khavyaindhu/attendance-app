// ─────────────────────────────────────────────────────────────────────────────
// Attendance Storage Service
// Handles all localStorage operations for attendance data
// ─────────────────────────────────────────────────────────────────────────────

const ATTENDANCE_KEY = 'attendance_records';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's date as "YYYY-MM-DD" */
export const getTodayDate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/** Returns current time as "HH:MM" */
export const getCurrentTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Generates a simple unique ID */
const generateId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Core Storage ──────────────────────────────────────────────────────────────

/** Returns every attendance record from localStorage */
export const getAllAttendanceRecords = () => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Overwrites all attendance records in localStorage */
const saveAllAttendanceRecords = (records) => {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
};

/** One-time initialisation — safe to call multiple times */
export const initializeAttendanceSystem = () => {
  if (!localStorage.getItem(ATTENDANCE_KEY)) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify([]));
  }
};

// ── Teacher: Mark Attendance ──────────────────────────────────────────────────

/**
 * Save attendance for a whole class.
 *
 * @param {string} className       - e.g. "CS-A"
 * @param {Object} attendanceMarks - { [studentId]: "Present" | "Absent" }
 * @param {Object} session         - { date, time, subject }
 */
export const markClassAttendance = (className, attendanceMarks, session = {}) => {
  try {
    const {
      date    = getTodayDate(),
      time    = getCurrentTime(),
      subject = '',
    } = session;

    const allRecords = getAllAttendanceRecords();

    Object.entries(attendanceMarks).forEach(([studentId, status]) => {
      // Check if a record already exists for this student / date / class / subject
      const existingIndex = allRecords.findIndex(
        (r) =>
          r.studentId === studentId &&
          r.date      === date      &&
          r.class     === className &&
          r.subject   === subject
      );

      const record = {
        id:        existingIndex >= 0 ? allRecords[existingIndex].id : generateId(),
        studentId,
        class:     className,
        date,
        time,
        subject,
        status,
        markedAt:  new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Update existing record
        allRecords[existingIndex] = record;
      } else {
        // Insert new record
        allRecords.push(record);
      }
    });

    saveAllAttendanceRecords(allRecords);
    return { success: true };
  } catch (error) {
    console.error('markClassAttendance error:', error);
    return { success: false, message: error.message };
  }
};

// ── Student: Read Attendance ──────────────────────────────────────────────────

/**
 * Returns all attendance records for one student, newest first.
 */
export const getStudentAttendance = (studentId) => {
  const all = getAllAttendanceRecords();
  return all
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

/**
 * Returns today's attendance record for a student (or null).
 * Shape: { status, subject, time, date } | null
 */
export const getStudentTodayStatus = (studentId) => {
  const today = getTodayDate();
  const all   = getAllAttendanceRecords();

  // If multiple subjects were marked today, return the most recent one
  const todayRecords = all
    .filter((r) => r.studentId === studentId && r.date === today)
    .sort((a, b) => (a.markedAt > b.markedAt ? -1 : 1));

  if (todayRecords.length === 0) return null;

  // If any record is "Present", surface that one so the student sees Present
  const presentRecord = todayRecords.find((r) => r.status === 'Present');
  return presentRecord || todayRecords[0];
};

/**
 * Returns stats for a student.
 */
export const getStudentStats = (studentId) => {
  const records = getStudentAttendance(studentId);

  // Count unique days (not per-subject)
  const dayMap = {};
  records.forEach((r) => {
    if (!dayMap[r.date] || r.status === 'Present') {
      dayMap[r.date] = r.status;
    }
  });

  const days        = Object.values(dayMap);
  const totalDays   = days.length;
  const presentDays = days.filter((s) => s === 'Present').length;
  const absentDays  = totalDays - presentDays;
  const percentage  = totalDays > 0
    ? ((presentDays / totalDays) * 100).toFixed(1)
    : '0.0';

  return { totalDays, presentDays, absentDays, percentage };
};

// ── Teacher: Stats & Helpers ──────────────────────────────────────────────────

/**
 * Returns today's check-in map — kept for backward compat with TeacherDashboard.
 * Since students no longer self-check-in, this returns an empty object.
 * Replace with real check-in logic if you re-add that feature.
 */
export const getTodayCheckIns = () => {
  return {};
};

/**
 * Returns present/absent counts for a class across all recorded days.
 */
export const getClassStats = (className) => {
  const all          = getAllAttendanceRecords();
  const classRecords = all.filter((r) => r.class === className);
  const presentCount = classRecords.filter((r) => r.status === 'Present').length;
  const absentCount  = classRecords.filter((r) => r.status === 'Absent').length;
  return { presentCount, absentCount };
};

/**
 * Returns all students from localStorage users.
 * Used by AdminDashboard to list all registered students.
 */
export const getAllStudents = () => {
  try {
    const raw = localStorage.getItem('attendance_app_users');
    if (!raw) return [];
    const users = JSON.parse(raw);
    return users.students || [];
  } catch {
    return [];
  }
};

/**
 * Returns attendance records formatted for CSV export.
 * Includes subject and time instead of the old checkIn/checkOut fields.
 */
export const getAttendanceForExport = () => {
  const allRecords = getAllAttendanceRecords();

  // Enrich records with student name and roll number from user storage
  const students = getAllStudents();
  const studentMap = {};
  students.forEach((s) => {
    studentMap[s.id] = { name: s.name, rollNo: s.rollNo };
  });

  return allRecords.map((record) => ({
    date:        record.date        || '',
    studentName: studentMap[record.studentId]?.name   || record.studentId,
    rollNo:      studentMap[record.studentId]?.rollNo || '—',
    class:       record.class       || '',
    subject:     record.subject     || '—',
    time:        record.time        || '—',
    status:      record.status      || '',
  }));
};

/**
 * Stub kept for backward compat — real source is localStorageService.
 */
export const getStudentsByClass = (className) => {
  try {
    const raw = localStorage.getItem('attendance_app_users');
    if (!raw) return [];
    const users = JSON.parse(raw);
    return (users.students || []).filter((s) => s.class === className);
  } catch {
    return [];
  }
};