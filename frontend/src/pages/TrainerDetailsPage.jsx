import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';

function TrainerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="details-container">
      <button className="btn-back" onClick={() => navigate('/trainers')}>
        ← Back to Trainers
      </button>
      <h1>Trainer Details - {id}</h1>
      <p>Trainer details page coming soon...</p>
    </div>
  );
}

export default TrainerDetailsPage;
