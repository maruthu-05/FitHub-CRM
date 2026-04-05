import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/TrainerForm.css';

function TrainerForm({ onTrainerAdded }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    specializations: []
  });
  const [loading, setLoading] = useState(false);

  const specializations = ['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Nutrition'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/trainers', formData);
      if (response.data.success) {
        toast.success('Trainer added successfully');
        onTrainerAdded();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          specializations: []
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add trainer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trainer-form">
      <h3>Add New Trainer</h3>
      
      <div className="form-row">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-row">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="specializations">
        <p>Specializations:</p>
        <div className="spec-checkboxes">
          {specializations.map(spec => (
            <label key={spec}>
              <input
                type="checkbox"
                checked={formData.specializations.includes(spec)}
                onChange={() => handleSpecializationChange(spec)}
              />
              {spec}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Trainer'}
      </button>
    </form>
  );
}

export default TrainerForm;
