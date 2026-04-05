import React from 'react';
import '../styles/MemberList.css';

function MemberList({ members, onMemberClick }) {
  if (members.length === 0) {
    return <div className="empty-state">No members found</div>;
  }

  return (
    <div className="member-list">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Membership Type</th>
            <th>Join Date</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member._id} onClick={() => onMemberClick(member._id)} className="clickable-row">
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.phone || 'N/A'}</td>
              <td>
                <span className={`badge status-${member.status.toLowerCase()}`}>
                  {member.status}
                </span>
              </td>
              <td>{member.membershipType}</td>
              <td>{new Date(member.joinDate).toLocaleDateString()}</td>
              <td>{member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberList;
