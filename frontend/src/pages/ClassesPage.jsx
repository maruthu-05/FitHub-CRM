import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import ClassList from '../components/ClassList';
import ClassForm from '../components/ClassForm';
import '../styles/ClassesPage.css';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classTypeFilter, setClassTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const classTypes = ['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Other'];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      if (response.data.success) {
        setClasses(response.data.data);
        setFilteredClasses(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classTypeFilter) {
      filtered = filtered.filter(cls => cls.classType === classTypeFilter);
    }

    setFilteredClasses(filtered);
  }, [searchTerm, classTypeFilter, classes]);

  const handleClassAdded = () => {
    setShowForm(false);
    fetchClasses();
    toast.success('Class added successfully');
  };

  const handleClassClick = (classId) => {
    navigate(`/classes/${classId}`);
  };

  if (loading) {
    return <div className="loading">Loading classes...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Fitness Classes</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Add New Class
        </button>
      </div>

      {showForm && <ClassForm onClassAdded={handleClassAdded} />}

      <div className="filters">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={classTypeFilter}
          onChange={(e) => setClassTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {classTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <ClassList classes={filteredClasses} onClassClick={handleClassClick} />
    </div>
  );
}

export default ClassesPage;
