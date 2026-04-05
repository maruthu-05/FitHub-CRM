import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import MemberList from '../components/MemberList';
import MemberForm from '../components/MemberForm';
import '../styles/MembersPage.css';

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/api/members');
      if (response.data.success) {
        setMembers(response.data.data);
        setFilteredMembers(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = members.filter(member =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const handleMemberAdded = () => {
    setShowForm(false);
    fetchMembers();
    toast.success('Member added successfully');
  };

  const handleMemberClick = (memberId) => {
    navigate(`/members/${memberId}`);
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Members Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Add New Member
        </button>
      </div>

      {showForm && <MemberForm onMemberAdded={handleMemberAdded} />}

      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <MemberList members={filteredMembers} onMemberClick={handleMemberClick} />
    </div>
  );
}

export default MembersPage;
