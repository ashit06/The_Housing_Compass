import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles/UserDashboardPage.css';

const UserDashboardPage = () => {
  const { currentUser } = useAuth();
  return (
    <div className="user-dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome, {currentUser.email}!</p>
        </header>
        
        <main className="dashboard-content">
          <div className="dashboard-message">
            <p>You are successfully logged in. You can now save your favorite properties and access personalized insights.</p>
          </div>
          
          <div className="dashboard-cta">
            <Link to="/properties" className="btn-primary">
              Start Exploring Properties
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;