// Hardcoded test users
export const USERS = {
  students: [
    { id: 'S001', username: 'student1', password: 'student123', name: 'John Doe', class: 'CS-A', rollNo: '101' },
    { id: 'S002', username: 'student2', password: 'student123', name: 'Jane Smith', class: 'CS-A', rollNo: '102' },
    { id: 'S003', username: 'student3', password: 'student123', name: 'Mike Johnson', class: 'CS-B', rollNo: '201' },
  ],
  teachers: [
    { id: 'T001', username: 'teacher1', password: 'teacher123', name: 'Prof. Robert Brown', department: 'Computer Science' },
    { id: 'T002', username: 'teacher2', password: 'teacher123', name: 'Dr. Sarah Wilson', department: 'Mathematics' },
  ],
  admin: [
    { id: 'A001', username: 'admin', password: 'admin123', name: 'Admin User', role: 'Super Admin' },
  ]
};

// Hardcoded attendance data
export const ATTENDANCE_DATA = [
  { id: 1, studentId: 'S001', studentName: 'John Doe', rollNo: '101', class: 'CS-A', date: '2024-02-01', status: 'Present', checkIn: '09:00 AM', checkOut: '04:00 PM' },
  { id: 2, studentId: 'S002', studentName: 'Jane Smith', rollNo: '102', class: 'CS-A', date: '2024-02-01', status: 'Present', checkIn: '09:15 AM', checkOut: '04:10 PM' },
  { id: 3, studentId: 'S003', studentName: 'Mike Johnson', rollNo: '201', class: 'CS-B', date: '2024-02-01', status: 'Absent', checkIn: '-', checkOut: '-' },
  { id: 4, studentId: 'S001', studentName: 'John Doe', rollNo: '101', class: 'CS-A', date: '2024-02-02', status: 'Present', checkIn: '08:55 AM', checkOut: '04:05 PM' },
  { id: 5, studentId: 'S002', studentName: 'Jane Smith', rollNo: '102', class: 'CS-A', date: '2024-02-02', status: 'Absent', checkIn: '-', checkOut: '-' },
  { id: 6, studentId: 'S003', studentName: 'Mike Johnson', rollNo: '201', class: 'CS-B', date: '2024-02-02', status: 'Present', checkIn: '09:10 AM', checkOut: '03:55 PM' },
];

// Classes/Subjects
export const CLASSES = ['CS-A', 'CS-B', 'IT-A', 'IT-B'];
