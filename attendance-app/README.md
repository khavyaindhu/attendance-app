# 📚 Attendance Management System

A modern, responsive attendance management system for colleges with separate dashboards for Students, Teachers, and Admins.

## ✨ Features

### 🔐 **Authentication**
- Login page with 3 user types (Student, Teacher, Admin)
- Registration page for new users
- Form validation (username length, password matching, etc.)
- Toggle between Login and Register

### 👨‍🎓 Student Features
- Login with credentials
- View personal attendance statistics
- Check-in/Check-out marking
- View attendance history
- Real-time attendance percentage calculation

### 👨‍🏫 Teacher Features
- Login with credentials
- Mark student attendance (Present/Absent)
- View class-wise attendance
- Filter by class and date
- Export attendance to Excel/CSV
- View detailed attendance records

### 👨‍💼 Admin Features
- Login with credentials
- View comprehensive attendance reports
- Filter by class, date, and status
- View class-wise statistics
- Export reports to Excel/PDF
- Overall attendance analytics

## 🗂️ Project Structure

```
attendance-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Main app component
    ├── components/           # Reusable components
    │   ├── Login.jsx         # Login component
    │   └── Navbar.jsx        # Navigation bar
    ├── pages/                # Page components
    │   ├── StudentDashboard.jsx
    │   ├── TeacherDashboard.jsx
    │   └── AdminDashboard.jsx
    ├── data/                 # Test data
    │   └── testData.js       # Hardcoded users and attendance
    ├── utils/                # Utility functions
    │   └── helpers.js        # Helper functions
    └── styles/               # Stylesheets
        └── App.css           # Global styles
```

## 🔐 Test Credentials

### Student Login
- **Username:** student1
- **Password:** student123

### Teacher Login
- **Username:** teacher1
- **Password:** teacher123

### Admin Login
- **Username:** admin
- **Password:** admin123

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to project directory:
```bash
cd attendance-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🎨 Features Breakdown

### 1. User Authentication
- **Login:** Three user types with separate login flows
- **Registration:** New user registration with role-specific fields
- **Validation:** Username (min 4 chars), Password (min 6 chars), password confirmation
- Hardcoded test credentials (ready for backend integration)

### 2. Attendance Marking
- **Students:** Check-in and check-out functionality
- **Teachers:** Mark attendance for entire class
- Real-time status updates

### 3. Attendance Viewing
- Daily and historical view
- Filter by class, date, status
- Statistics and analytics
- Percentage calculations

### 4. Export/Reports
- Export to Excel (CSV format)
- Export to PDF (placeholder for implementation)
- Filtered exports based on selections

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** CSS3 (Custom)
- **State Management:** React Hooks (useState)
- **Routing:** None (can add React Router for multi-page navigation)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔄 Future Enhancements

### Backend Integration
- Connect to REST API
- Real-time database updates
- User authentication with JWT
- Session management

### Additional Features
- Biometric attendance
- QR code scanning
- Email notifications
- SMS alerts
- Leave management
- Attendance reports with charts
- Multi-language support

### Technical Improvements
- Add React Router for better navigation
- Implement Redux for state management
- Add Chart.js for data visualization
- Implement real PDF generation with jsPDF
- Add form validation
- Add loading states
- Error boundary implementation

## 📊 Data Structure

### User Object
```javascript
{
  id: 'S001',
  username: 'student1',
  password: 'student123',
  name: 'John Doe',
  class: 'CS-A',
  rollNo: '101'
}
```

### Attendance Record
```javascript
{
  id: 1,
  studentId: 'S001',
  studentName: 'John Doe',
  rollNo: '101',
  class: 'CS-A',
  date: '2024-02-01',
  status: 'Present',
  checkIn: '09:00 AM',
  checkOut: '04:00 PM'
}
```

## 🤝 Contributing

This is a college project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

College Project - Attendance Management System

---

**Note:** This is a UI-only implementation with hardcoded test data. Backend integration is required for production use.
