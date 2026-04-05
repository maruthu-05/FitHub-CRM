import React from 'react';
import '../styles/ClassList.css';

function ClassList({ classes, onClassClick }) {
  if (classes.length === 0) {
    return <div className="empty-state">No classes found</div>;
  }

  return (
    <div className="class-list">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Trainer</th>
            <th>Schedule</th>
            <th>Difficulty</th>
            <th>Enrollment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(fitnessClass => (
            <tr key={fitnessClass._id} onClick={() => onClassClick(fitnessClass._id)} className="clickable-row">
              <td>{fitnessClass.name}</td>
              <td>{fitnessClass.classType}</td>
              <td>
                {fitnessClass.trainer?.firstName} {fitnessClass.trainer?.lastName}
              </td>
              <td>
                {fitnessClass.schedule?.dayOfWeek} {fitnessClass.schedule?.startTime}
              </td>
              <td>{fitnessClass.difficultyLevel}</td>
              <td>
                {fitnessClass.currentEnrollment}/{fitnessClass.maxCapacity}
              </td>
              <td>
                <span className={`badge status-${fitnessClass.status.toLowerCase()}`}>
                  {fitnessClass.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassList;
