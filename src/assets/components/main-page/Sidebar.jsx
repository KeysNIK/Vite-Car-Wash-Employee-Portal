import React from 'react';
import styles from './Sidebar.module.css'; // Подключаем стили для бокового меню

const Sidebar = ({ isMenuOpen, setContent }) => {
  return (
    <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
      <h1>Алгоритм Чистоты</h1>
      <button onClick={() => setContent('Block2')}>Прием заказа</button>
      <button onClick={() => setContent('Block2')}>Очередь</button>
      <button onClick={() => setContent('Block2')}>История</button>
      <button onClick={() => setContent('Block2')}>История (админ)</button>
      <button onClick={() => setContent('Block2')}>Очередь (админ)</button>
      <button onClick={() => setContent('Block2')}>Услуги (админ)</button>
      <button onClick={() => setContent('Block2')}>Клиенты (админ)</button>
      <button onClick={() => setContent('Employees')}>Работники (админ)</button>
    </div>
  );
};

export default Sidebar;
