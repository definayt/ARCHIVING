import React from 'react';
import { Link } from 'react-router-dom';
const ForbiddenAccess = () => {
  return (
    <div>
        <h1 className='title'>Error 403</h1>
        <h2 className='subtitle'>Anda tidak memiliki akses</h2>
        <Link to={"/dashboard"} className='button bulma is-primary'>Kembali ke Dashboard</Link>
    </div>
  );
};

export default ForbiddenAccess;