import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Employees from '../view/Employees/Employees'; 
import Clients from '../view/Clients/Clients.jsx';
import CarWashServices from '../view/CarWashServices/CarWashServices.jsx';
import Block2 from '../Block2';
import styles from './MainPage.module.css';

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const setContent = (content) => {
    setActiveContent(content);
    setIsMenuOpen(false);
  };

  const renderActiveContent = () => {
    if (activeContent === 'Employees') {
      return <Employees />;
    } else if (activeContent === 'Clients') {
      return <Clients />
    } else if (activeContent === 'CarWashServices') {
      return <CarWashServices />
    } else if (activeContent === '-') {

    } else if (activeContent === '-') {

    } else if (activeContent === '-') {

    } else if (activeContent === '-') {

    } else if (activeContent === '-') {

    } else if (activeContent === 'Block2') {
      return <Block2 />; 
    } else {
      return <div>Пожалуйста, выберите блок из меню.</div>;
    }
  };

  return (
    <>
    {isMobile && (
        <button 
          className="menu-toggle" 
          onClick={toggleMenu} 
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 20,
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ☰
        </button>
      )}
    <div id="app">
      <div className="sidebar">
        <Sidebar isMenuOpen={isMenuOpen} setContent={setContent} />
      </div>

      <div className="content">
        {renderActiveContent()}
      </div>
    </div>
    </>
  );
};

export default MainPage;
