import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfilNavbar = () => {
  return (
    <div style={{ width: '200px', height: '100vh', padding: '20px', borderRight: '1px solid #ccc' }}>
      <h2 style={{ marginBottom: '20px' }}>YouTube</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <NavLink to="/" style={linkStyle}>Home</NavLink>
        <NavLink to="/shorts" style={linkStyle}>Shorts</NavLink>
        <NavLink to="/subscriptions" style={linkStyle}>Subscriptions</NavLink>

        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>You</div>
        <NavLink to="/history" style={linkStyle}>History</NavLink>
        <NavLink to="/playlists" style={linkStyle}>Playlists</NavLink>
        <NavLink to="/watch-later" style={linkStyle}>Watch Later</NavLink>
        <NavLink to="/liked-videos" style={linkStyle}>Liked Videos</NavLink>
      </nav>
    </div>
  );
};

const linkStyle = ({ isActive }) => ({
  textDecoration: 'none',
  color: isActive ? 'blue' : 'black',
  fontWeight: isActive ? 'bold' : 'normal',
});


export default ProfilNavbar;
