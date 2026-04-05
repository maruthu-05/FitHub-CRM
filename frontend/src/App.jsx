import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import ClassesPage from './pages/ClassesPage';
import TrainersPage from './pages/TrainersPage';
import MemberDetailsPage from './pages/MemberDetailsPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import TrainerDetailsPage from './pages/TrainerDetailsPage';

// Components
import Navbar from './components/Navbar';

// Styles
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      setUser({ email: userEmail, name: userName });
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userInfo.email);
    localStorage.setItem('userName', userInfo.name);
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/members"
              element={isAuthenticated ? <MembersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/members/:id"
              element={isAuthenticated ? <MemberDetailsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/classes"
              element={isAuthenticated ? <ClassesPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/classes/:id"
              element={isAuthenticated ? <ClassDetailsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/trainers"
              element={isAuthenticated ? <TrainersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/trainers/:id"
              element={isAuthenticated ? <TrainerDetailsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
