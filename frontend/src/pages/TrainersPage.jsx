import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import TrainerList from '../components/TrainerList';
import TrainerForm from '../components/TrainerForm';
import '../styles/TrainersPage.css';

function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const specializations = ['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Nutrition'];

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/api/trainers');
      if (response.data.success) {
        setTrainers(response.data.data);
        setFilteredTrainers(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = trainers;

    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter(trainer =>
        trainer.specializations.includes(specialization)
      );
    }

    setFilteredTrainers(filtered);
  }, [searchTerm, specialization, trainers]);

  const handleTrainerAdded = () => {
    setShowForm(false);
    fetchTrainers();
    toast.success('Trainer added successfully');
  };

  const handleTrainerClick = (trainerId) => {
    navigate(`/trainers/${trainerId}`);
  };

  if (loading) {
    return <div className="loading">Loading trainers...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Trainers Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Add New Trainer
        </button>
      </div>

      {showForm && <TrainerForm onTrainerAdded={handleTrainerAdded} />}

      <div className="filters">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="filter-select"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <TrainerList trainers={filteredTrainers} onTrainerClick={handleTrainerClick} />
    </div>
  );
}

export default TrainersPage;
