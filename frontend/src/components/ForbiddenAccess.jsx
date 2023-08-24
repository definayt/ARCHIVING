import React from 'react';
import { Link } from 'react-router-dom';
const ForbiddenAccess = () => {
  return (
    <div>
        <h1 className='title has-text-centered mt-3'>Error 403</h1>
        <h2 className='subtitle has-text-centered'>Anda tidak memiliki akses</h2>
        <div className='buttons is-centered'>
          <Link to={"/dashboard"} className='button bulma is-primary'>Kembali ke Dashboard</Link>
        </div>
    </div>
  );
};

export default ForbiddenAccess;