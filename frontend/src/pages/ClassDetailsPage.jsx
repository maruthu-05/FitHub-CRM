import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';

function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="details-container">
      <button className="btn-back" onClick={() => navigate('/classes')}>
        ← Back to Classes
      </button>
      <h1>Class Details - {id}</h1>
      <p>Class details page coming soon...</p>
    </div>
  );
}

export default ClassDetailsPage;
