import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/ClassForm.css';

function ClassForm({ onClassAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    classType: 'Yoga',
    trainer: '',
    maxCapacity: 30,
    difficultyLevel: 'Beginner',
    schedule: {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00'
    }
  });
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/api/trainers');
      if (response.data.success) {
        setTrainers(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch trainers');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/classes', formData);
      if (response.data.success) {
        toast.success('Class added successfully');
        onClassAdded();
        setFormData({
          name: '',
          classType: 'Yoga',
          trainer: '',
          maxCapacity: 30,
          difficultyLevel: 'Beginner',
          schedule: {
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:00'
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="class-form">
      <h3>Add New Class</h3>
      
      <div className="form-row">
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <select name="classType" value={formData.classType} onChange={handleInputChange}>
          <option value="Yoga">Yoga</option>
          <option value="Pilates">Pilates</option>
          <option value="CrossFit">CrossFit</option>
          <option value="HIIT">HIIT</option>
          <option value="Spinning">Spinning</option>
          <option value="Zumba">Zumba</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibility">Flexibility</option>
        </select>
      </div>

      <div className="form-row">
        <select name="trainer" value={formData.trainer} onChange={handleInputChange} required>
          <option value="">Select Trainer</option>
          {trainers.map(trainer => (
            <option key={trainer._id} value={trainer._id}>
              {trainer.firstName} {trainer.lastName}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="maxCapacity"
          placeholder="Max Capacity"
          value={formData.maxCapacity}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>

      <div className="form-row">
        <select name="dayOfWeek" value={formData.schedule.dayOfWeek} onChange={handleScheduleChange}>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <input
          type="time"
          name="startTime"
          value={formData.schedule.startTime}
          onChange={handleScheduleChange}
        />
        <input
          type="time"
          name="endTime"
          value={formData.schedule.endTime}
          onChange={handleScheduleChange}
        />
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Class'}
      </button>
    </form>
  );
}

export default ClassForm;
