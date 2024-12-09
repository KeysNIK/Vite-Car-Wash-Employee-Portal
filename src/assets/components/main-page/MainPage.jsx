import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Block1 from '../Block1'; 
import Block2 from '../Block2';
import './MainPageCSS.css';

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const setContent = (content) => {
    setActiveContent(content);
    setIsMenuOpen(false); 
  };

  const renderActiveContent = () => {
    if (activeContent === 'Block1') {
      return <Block1 />;
    } else if (activeContent === 'Block2') {
      return <Block2 />;
    } else {
      return <div>Please select a block from the menu.</div>;
    }
  };

  return (
    <div className="main-page">
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <Sidebar isMenuOpen={isMenuOpen} setContent={setContent} />

      <div className="content">
        {renderActiveContent()}
      </div>
    </div>
  );
};

export default MainPage;
