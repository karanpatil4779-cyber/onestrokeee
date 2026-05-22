// ONESTROKE PREMIUM UI SYSTEM
// Colors: Off-White (#F7F7F7), Gold (#D4AF37), Beige (#F5F5DC), Charcoal (#222222)

import React, { useState } from 'react';

// 1. ELITE HELPER (QUEUE PROXY) COMPONENT
export const QueueServiceBooking = () => {
  const [queueType, setQueueType] = useState('government'); // Gov, Temple, Form
  
  return (
    <div style={{ backgroundColor: '#F7F7F7', padding: '40px', borderRadius: '20px' }}>
      <h2 style={{ color: '#D4AF37', borderBottom: '2px solid #D4AF37' }}>Elite Helper — Queue Standing</h2>
      
      <div className="form-group">
        <label style={{ color: '#222222' }}>Where should we wait for you?</label>
        <select 
          style={{ backgroundColor: '#F5F5DC', border: '1px solid #D4AF37', padding: '10px' }}
          onChange={(e) => setQueueType(e.target.value)}
        >
          <option value="government">Government Office Line</option>
          <option value="temple">Religious / Temple Queue</option>
          <option value="form">Physical Form Filling Assistance</option>
          <option value="admin">Administrative / Banking Line</option>
        </select>
      </div>

      <textarea 
        placeholder="Enter specific location details (e.g., RTO Office Cabin 4)"
        style={{ width: '100%', marginTop: '20px', padding: '15px' }}
      />

      <button style={{ 
        backgroundColor: '#D4AF37', 
        color: '#F7F7F7', 
        padding: '15px 30px', 
        border: 'none', 
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px'
      }}>
        Book Premium Proxy
      </button>
    </div>
  );
};

// 2. ONBOARDING FORM (GENDER & LOCATION)
export const OnboardingForm = () => {
  return (
    <form className="concierge-form">
      <h3 style={{ color: '#D4AF37' }}>Complete Your Concierge Profile</h3>
      
      <div className="input-group">
        <label>Current Location (City/Town)</label>
        <input 
          type="text" 
          placeholder="e.g. Bandra West, Mumbai" 
          style={{ border: '1px solid #D4AF37', padding: '10px' }}
        />
      </div>

      <div className="input-group">
        <label>Gender</label>
        <input 
          type="text" 
          placeholder="Type your gender identity" 
          style={{ border: '1px solid #D4AF37', padding: '10px' }}
        />
      </div>
    </form>
  );
};
