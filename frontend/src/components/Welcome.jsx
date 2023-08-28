import React from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
const Welcome = () => {
    const {user} = useSelector((state) => state.auth);
  return (
    <div>
        <h1 className='title has-text-centered mt-3'>Dashboard</h1>
        <h2 className='subtitle has-text-centered'>Welcome Back <strong>{user && user.name}</strong></h2>
    </div>
  );
};

export default Welcome;