import React, { useEffect, useState } from "react";
import modalStyles from "../Modal.module.css";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";

const Employees = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    login: "",
    password: "",
    fio: "",
    position: "",
    statusEmployee: "",
    accessCode: "",
  });

  const fetchData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const limit = 15;
      const response = await fetch(
        `http://a1057091.xsph.ru/viewEmployees.php?page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (result.data.length > 0) {
        setData(result.data);
        setTotalPages(result.total_pages);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    const inputPage = Number(e.target.value);
    if (inputPage >= 1 && inputPage <= totalPages) {
      setPage(inputPage);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://a1057091.xsph.ru/addNewEmployees.php`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        alert("Пользователь успешно добавлен!");
        setAddModalOpen(false);
        setNewUser({
          login: "",
          password: "",
          fio: "",
          position: "",
          statusEmployee: "",
          accessCode: "",
        });
        fetchData();
      } else {
        alert(`Ошибка: ${result.message}`);
      }
    } catch (error) {
      console.error("Ошибка добавления пользователя:", error);
    }
  };

  return (
    
    <>
    <div className={tableStyles.tableContainer}>
      <table className={tableStyles.table}>
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
                  <button onClick={() => openEditModal(item)} className={tableStyles.button}>Изменить</button>
                  <button className={`${tableStyles.button}`}>Удалить</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={() => setAddModalOpen(true)} className={tableStyles.addButton}>Добавить</button>

      <div className={paginationStyles.paginationContainer}>
        <div className={paginationStyles.paginationControls}>
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
            className={paginationStyles.pageButton}
          >
            Предыдущая
          </button>
          <span>Страница {page} из {totalPages}</span>
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
            className={paginationStyles.pageButton}
          >
            Следующая
          </button>
        </div>
        <div className={paginationStyles.paginationInput}>
          <input
            type="number"
            value={page}
            min={1}
            max={totalPages}
            onChange={handleInputChange}
            className={paginationStyles.pageInput}
          />
          <button 
            className={paginationStyles.goButton}
            onClick={() => handlePageChange(Number(page))}
          >
            Перейти
          </button>
        </div>
      </div>

      {isAddModalOpen && (
        <div className={modalStyles.modalContainer}>
          <div className={modalStyles.modal}>
            <button className={modalStyles.closeModal} onClick={() => setAddModalOpen(false)}>×</button>
            <h3>Добавить пользователя</h3>
            <form className={modalStyles.form} onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Логин"
                value={newUser.login}
                onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                required
                className={modalStyles.input}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                className={modalStyles.input}
              />
              <input
                type="text"
                placeholder="ФИО"
                value={newUser.fio}
                onChange={(e) => setNewUser({ ...newUser, fio: e.target.value })}
                required
                className={modalStyles.input}
              />
              <input
                type="text"
                placeholder="Должность"
                value={newUser.position}
                onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                required
                className={modalStyles.input}
              />
              <input
                type="text"
                placeholder="Статус сотрудника"
                value={newUser.statusEmployee}
                onChange={(e) => setNewUser({ ...newUser, statusEmployee: e.target.value })}
                required
                className={modalStyles.input}
              />
              <input
                type="number"
                placeholder="Код доступа"
                value={newUser.accessCode}
                onChange={(e) => setNewUser({ ...newUser, accessCode: e.target.value })}
                required
                className={modalStyles.input}
              />
              <button type="submit" className={modalStyles.button}>Добавить</button>
            </form>
          </div>
        </div>
      )}
    </>
    
  );
};

export default Employees;
