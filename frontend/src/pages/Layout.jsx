import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Layout = ({children}) => {
  return (
    <React.Fragment>
        <Navbar/>
        <div className="columns mt-6" style={{paddingTop: "2rem"}}>
            <div className="column is-2 is-narrow-mobile is-hidden-mobile"><Sidebar/></div>
            <div className="column has-background-light pr-4">
                <main style={{minHeight: "75vh"}}>{children}</main>
                <Footer/>
            </div>
            
        </div>
        
    </React.Fragment>
  );
};

export default Layout;