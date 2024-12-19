import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isMenuOpen, setContent }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('accessCode='));

    if (roleCookie) {
      const role = roleCookie.split('=')[1];
      setUserRole(role);
    }
  }, []);

  return (
    <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
      <h1>Алгоритм Чистоты</h1>
      
      <button onClick={() => setContent('Block2')}>Прием заказа</button>
      <button onClick={() => setContent('Block2')}>Очередь</button>
      <button onClick={() => setContent('CarHistoryView')}>История</button>

      {userRole === '1' && (
        <>
          <button onClick={() => setContent('CarHistory')}>История (админ)</button>
          <button onClick={() => setContent('Block2')}>Очередь (админ)</button>
          <button onClick={() => setContent('CarWashServices')}>Услуги (админ)</button>
          <button onClick={() => setContent('Clients')}>Клиенты (админ)</button>
          <button onClick={() => setContent('Employees')}>Работники (админ)</button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
