import React from 'react';
import './MainPageCSS.css';

function MainPage() {
  return (
    <div className="main-container">
      <div className="welcome-message">
        <h2>Добро пожаловать на главную страницу!</h2>
        <p>Мы рады видеть вас здесь. Начните свой день с нами!</p>
        <button className="action-button">Узнать больше</button>
      </div>
    </div>
  );
}

export default MainPage;
