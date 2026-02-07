# 🚀 Quick Start Guide

## Installation & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Visit: http://localhost:5173

## Test Credentials

### Student
- Username: `student1`
- Password: `student123`

### Teacher
- Username: `teacher1`
- Password: `teacher123`

### Admin
- Username: `admin`
- Password: `admin123`

## Available Students (Hardcoded)

| Username | Password | Name | Class | Roll No |
|----------|----------|------|-------|---------|
| student1 | student123 | John Doe | CS-A | 101 |
| student2 | student123 | Jane Smith | CS-A | 102 |
| student3 | student123 | Mike Johnson | CS-B | 201 |

## Features by Role

### Student Dashboard
✅ View attendance statistics
✅ Check-in / Check-out
✅ View attendance history
✅ See attendance percentage

### Teacher Dashboard
✅ Mark attendance for students
✅ View class-wise attendance
✅ Filter by class and date
✅ Export to Excel/CSV

### Admin Dashboard
✅ View all attendance records
✅ Advanced filtering (class, date, status)
✅ Class-wise statistics
✅ Export to Excel/PDF

## File Structure

```
src/
├── components/
│   ├── Login.jsx          # Login page with user type selection
│   └── Navbar.jsx         # Navigation bar
├── pages/
│   ├── StudentDashboard.jsx    # Student view
│   ├── TeacherDashboard.jsx    # Teacher view
│   └── AdminDashboard.jsx      # Admin view
├── data/
│   └── testData.js        # Hardcoded test users and attendance
├── utils/
│   └── helpers.js         # Utility functions
└── styles/
    └── App.css            # All styles
```

## Next Steps (Backend Integration)

When you're ready to add a backend:

1. **Replace hardcoded data** in `src/data/testData.js`
2. **Add API calls** in `src/utils/helpers.js`
3. **Update authentication** in Login component
4. **Add loading states** for async operations
5. **Implement real-time updates** with WebSocket (optional)

## Common Issues

**Port already in use?**
- Change port in `vite.config.js` or kill process on port 5173

**Dependencies not installing?**
- Try: `npm install --legacy-peer-deps`

**Styles not loading?**
- Make sure `import './styles/App.css'` is in App.jsx

## Tips

- Use Chrome DevTools to inspect components
- Check browser console for errors
- Test all three user types
- Try different filters and exports

Happy coding! 🎉
