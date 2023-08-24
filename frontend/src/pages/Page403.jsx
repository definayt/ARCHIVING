import React from 'react';
import Layout from './Layout';
import ForbiddenAccess from '../components/ForbiddenAccess';

const Page403 = () => { 
  return (
    <Layout>
        <ForbiddenAccess></ForbiddenAccess>
    </Layout>
  );
};

export default Page403;