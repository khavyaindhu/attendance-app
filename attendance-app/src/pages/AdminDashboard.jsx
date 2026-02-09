import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ATTENDANCE_DATA, USERS, CLASSES } from '../data/testData';
import { exportToCSV } from '../utils/helpers';

const AdminDashboard = ({ user, onLogout }) => {
  const handleExport = () => {
    exportToCSV(ATTENDANCE_DATA, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    alert('PDF export would be implemented with a library like jsPDF');
    console.log('Exporting to PDF:', ATTENDANCE_DATA);
  };

  return (
    <div className="dashboard" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
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
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Admin Panel</h2>
      </div>
      
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Action Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#1976D2',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Manage Students</h3>
          </div>

          <div style={{
            background: '#1976D2',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🏫</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Manage Teachers</h3>
          </div>

          <div style={{
            background: '#1976D2',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Attendance Reports</h3>
          </div>

          <div style={{
            background: '#1976D2',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Analytics</h3>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={handleExportPDF}
            style={{
              background: '#FFC107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>📄</span>
            Export to PDF
          </button>

          <button 
            onClick={handleExport}
            style={{
              background: '#FFC107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>📊</span>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;