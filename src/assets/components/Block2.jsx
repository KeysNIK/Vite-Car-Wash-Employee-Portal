import React from 'react';
import './Block.css'; // Используем общие стили для блоков

const Block2 = () => {
  return (
    <div className="block">
      <h2 className="block-title">Блок 2</h2>
      <p className="block-content">
        Содержимое блока 2. Тут может быть дополнительная информация о сайте или услугах.
      </p>
    </div>
  );
};

export default Block2;
