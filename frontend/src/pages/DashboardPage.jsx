import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiAward } from 'react-icons/fi';
import api from '../services/api';
import '../styles/DashboardPage.css';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeClasses: 0,
    trainers: 0,
    expiringSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [membersRes, classesRes, trainersRes, expiringRes] = await Promise.all([
        api.get('/api/members'),
        api.get('/api/classes'),
        api.get('/api/trainers'),
        api.get('/api/members/expiring')
      ]);

      setStats({
        totalMembers: membersRes.data.count || 0,
        activeClasses: classesRes.data.count || 0,
        trainers: trainersRes.data.count || 0,
        expiringSubscriptions: expiringRes.data.count || 0
      });
    } catch (error) {
      console.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to FitHub CRM</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon members">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Total Members</h3>
            <p className="stat-value">{stats.totalMembers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon classes">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Active Classes</h3>
            <p className="stat-value">{stats.activeClasses}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trainers">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>Trainers</h3>
            <p className="stat-value">{stats.trainers}</p>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon expiring">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Expiring Soon</h3>
            <p className="stat-value">{stats.expiringSubscriptions}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <ul>
            <li>✓ Manage memberships and renewals</li>
            <li>✓ Schedule and manage fitness classes</li>
            <li>✓ Assign trainers to classes and members</li>
            <li>✓ Track member progress and attendance</li>
            <li>✓ Send notifications for expirations</li>
            <li>✓ Generate activity reports</li>
          </ul>
        </div>

        <div className="system-info">
          <h2>System Information</h2>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Platform:</strong> FitHub CRM</p>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Status:</strong> ✓ All Systems Operational</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
