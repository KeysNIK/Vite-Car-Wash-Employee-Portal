
import React from 'react';
import './Block.css'; // Можно создать отдельный файл стилей для блоков

const Block1 = () => {
  return (
    <div className="block">
      <h2 className="block-title">Блок 1</h2>
      <p className="block-content">
        Содержимое блока 1. Здесь может быть текст, изображения или другие элементы.
      </p>
    </div>
  );
};

export default Block1;
