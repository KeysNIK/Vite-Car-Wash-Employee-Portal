import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Employees from '../view/Employees/Employees'; 
import Block2 from '../Block2';
import styles from './MainPage.module.css'; // Стили для MainPage

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Для определения мобильной версии

  // Хук для отслеживания изменения ширины экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Обновляем состояние, если ширина экрана изменится
    };

    window.addEventListener('resize', handleResize); // Добавляем слушатель события resize

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState); // Переключаем состояние меню
  };

  const setContent = (content) => {
    setActiveContent(content);
    setIsMenuOpen(false); // Закрытие меню после выбора контента
  };

  const renderActiveContent = () => {
    if (activeContent === 'Employees') {
      return <Employees />;
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
      {/* Sidebar - меню слева */}
      <div className="sidebar">
        <Sidebar isMenuOpen={isMenuOpen} setContent={setContent} />
      </div>

      {/* Контент - рабочая зона справа */}
      <div className="content">
        {renderActiveContent()}
      </div>
    </div>
    </>
  );
};

export default MainPage;
