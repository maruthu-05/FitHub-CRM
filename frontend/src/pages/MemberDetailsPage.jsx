import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';

function MemberDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="details-container">
      <button className="btn-back" onClick={() => navigate('/members')}>
        ← Back to Members
      </button>
      <h1>Member Details - {id}</h1>
      <p>Member details page coming soon...</p>
    </div>
  );
}

export default MemberDetailsPage;
