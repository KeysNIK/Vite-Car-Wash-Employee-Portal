import React, { useEffect, useState } from "react";
import "./Employees.css"; // Подключите ваш файл CSS

const Employees = () => {
  const [data, setData] = useState([]); // Данные сотрудников
  const [page, setPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц
  const [isLoading, setIsLoading] = useState(false); // Флаг загрузки

  // Функция для загрузки данных с сервера
  const fetchData = async () => {
    if (isLoading) return; // Если уже идет загрузка, не запускаем повторно

    setIsLoading(true); // Начинаем загрузку
    try {
      const limit = 15; // Количество данных на страницу
      const response = await fetch(
        `http://a1057091.xsph.ru/viewEmployees.php?page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (result.data.length > 0) {
        setData(result.data); // Загружаем новые данные
        setTotalPages(result.total_pages); // Обновляем количество страниц
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }
  };

  // Загрузка данных при изменении страницы
  useEffect(() => {
    fetchData();
  }, [page]); // Перезапуск загрузки при изменении номера страницы

  // Обработчик изменения страницы
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage); // Устанавливаем новую страницу
    }
  };

  // Обработчик ввода текста в поле ввода
  const handleInputChange = (e) => {
    const inputPage = Number(e.target.value);
    if (inputPage >= 1 && inputPage <= totalPages) {
      setPage(inputPage);
    }
  };

  return (
    
    <div id="table-info">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Статус</th>
            <th>Код доступа</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.Login}</td>
              <td>{item.FIO}</td>
              <td>{item.Position}</td>
              <td>{item.StatusEmployee}</td>
              <td>{item.AccessCode}</td>
              <td>
                <form method="POST" action="">
                  <button type="submit" name="edit" value={item.ID}>
                    Изменить
                  </button>
                  <button
                    type="submit"
                    name="delete"
                    value={item.ID}
                    className="delete"
                  >
                    Удалить
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Кнопки для перехода по страницам */}
      

      <div className="pagination-all">
      <div className="pagination-first">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Предыдущая
        </button>
        <span>Страница {page} из {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Следующая
        </button>
      </div>
      <div className="pagination">
        <input
          type="number"
          value={page}
          min={1}
          max={totalPages}
          onChange={handleInputChange} // Обработчик изменения
        />
        <button className="button-tr" onClick={() => handlePageChange(Number(page))}>Перейти</button>
      </div>
      </div>
      {/* Поле для ввода номера страницы */}
      

      {isLoading && <p>Загрузка...</p>}
    </div>
  );
};

export default Employees;
