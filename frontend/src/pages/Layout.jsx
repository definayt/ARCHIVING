import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Layout = ({children}) => {
  return (
    <React.Fragment>
        <Navbar/>
        <div className="columns mt-6" style={{ minHeight: "100vh" }}>
            <div className="column is-2"><Sidebar/></div>
            <div className="column has-background-light pr-4">
                <main>{children}</main>
                <Footer/>
            </div>
            
        </div>
        
    </React.Fragment>
  );
};

export default Layout;