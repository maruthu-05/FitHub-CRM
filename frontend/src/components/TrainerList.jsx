import React from 'react';
import '../styles/TrainerList.css';

function TrainerList({ trainers, onTrainerClick }) {
  if (trainers.length === 0) {
    return <div className="empty-state">No trainers found</div>;
  }

  return (
    <div className="trainer-list">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specializations</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map(trainer => (
            <tr key={trainer._id} onClick={() => onTrainerClick(trainer._id)} className="clickable-row">
              <td>{trainer.firstName} {trainer.lastName}</td>
              <td>{trainer.email}</td>
              <td>{trainer.phone}</td>
              <td>{trainer.specializations?.join(', ') || 'N/A'}</td>
              <td>{trainer.experience?.years || 'N/A'} years</td>
              <td>
                <div className="rating">
                  {'⭐'.repeat(Math.round(trainer.rating?.average || 5))}
                </div>
              </td>
              <td>
                <span className={`badge status-${trainer.status.toLowerCase()}`}>
                  {trainer.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrainerList;
