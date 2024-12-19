import React, { useEffect, useState } from "react";
import modalStyles from "../Modal.module.css";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";
import modalStylesDelete from "../ModalDelete.module.css";
import searchStyles from "../Search.module.css";

const Employees = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    login: "",
    password: "",
    fio: "",
    position: "",
    statusEmployee: "",
    accessCode: "",
  });

  const [search, setSearch] = useState('');

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc', // или 'desc'
  });

  const handleSearchChange = (e) => {
    let searchValue = e.target.value;
    searchValue = searchValue.replace(/\+/g, '');
    setSearch(searchValue);
    fetchData(searchValue);
  };

  const fetchData = async (search = '') => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const limit = 15;
      const response = await fetch(
        `http://a1057091.xsph.ru/Employees.php?page=${page}&limit=${limit}&search=${search}`
      );
      const result = await response.json();

      if (result.data.length > 0) {
        setData(result.data);
        setTotalPages(result.total_pages);
        setNoResults(false);
      } else {
        setData([]);
        setTotalPages(1);
        setNoResults(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        const response = await fetch(`http://a1057091.xsph.ru/Employees.php?id=${userToDelete.ID}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (result.status === 'success') {
          fetchData();
          setDeleteModalOpen(false);
        } else {
          alert(`Ошибка удаления: ${result.message}`);
        }
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    if (newUser.accessCode === '') {
      newUser.accessCode = '0'; 
    }

    try {
      const response = await fetch('http://a1057091.xsph.ru/Employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'add',
          login: newUser.login,
          password: newUser.password,
          fio: newUser.fio,
          position: newUser.position,
          statusEmployee: newUser.statusEmployee,
          accessCode: newUser.accessCode,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        fetchData();
        setAddModalOpen(false);
        setNewUser({
          login: '',
          password: '',
          fio: '',
          position: '',
          statusEmployee: '',
          accessCode: '',
        });
      } else {
        alert(`Ошибка добавления: ${result.message}`);
      }
    } catch (error) {
      console.error('Ошибка добавления пользователя:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    if (editUser.accessCode === '') {
      editUser.accessCode = '0';
    }

    try {
      const response = await fetch('http://a1057091.xsph.ru/Employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'edit',
          id: editUser.ID,
          login: editUser.login,
          password: editUser.password,
          fio: editUser.fio,
          position: editUser.position,
          statusEmployee: editUser.statusEmployee,
          accessCode: editUser.accessCode,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        fetchData();
        setEditModalOpen(false);
      } else {
        setIsEditing(false);
        alert(`Ошибка: ${result.message}`);
      }
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditClick = (item) => {
    setEditUser({
      ID: item.ID,
      login: item.Login,
      password: item.Password,
      fio: item.FIO,
      position: item.Position,
      statusEmployee: item.StatusEmployee,
      accessCode: item.AccessCode,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setUserToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
    sortData(key, direction);
  };

  const sortData = (key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <>
      <div className={tableStyles.tableContainer}>
        <div className={searchStyles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={handleSearchChange}
            className={searchStyles.searchInput}
          />
          <button onClick={fetchData} className={searchStyles.searchButton}>
            Найти
          </button>
        </div>

        {noResults && (
          <div className={searchStyles.noResults}>По вашему запросу ничего не найдено.</div>
        )}

        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort('Login')}>Логин {getSortIndicator('Login')}</th>
              <th onClick={() => requestSort('FIO')}>ФИО {getSortIndicator('FIO')}</th>
              <th onClick={() => requestSort('Position')}>Должность {getSortIndicator('Position')}</th>
              <th onClick={() => requestSort('StatusEmployee')}>Статус {getSortIndicator('StatusEmployee')}</th>
              <th onClick={() => requestSort('AccessCode')}>Код доступа {getSortIndicator('AccessCode')}</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ID}>
                <td>{item.Login}</td>
                <td>{item.FIO}</td>
                <td>{item.Position}</td>
                <td>{item.StatusEmployee}</td>
                <td>{item.AccessCode}</td>
                <td>
                  <button
                    onClick={() => handleEditClick(item)}
                    className={tableStyles.edit}
                    disabled={isEditing}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className={tableStyles.delete}
                    disabled={isDeleting}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => setAddModalOpen(true)} className={tableStyles.addButton}>
          Добавить
        </button>

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
            <div className={paginationStyles.paginationInput}>
              <input
                type="number"
                value={page}
                min={1}
                max={totalPages}
                onChange={(e) => setPage(Number(e.target.value))}
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
        </div>
      </div>

    {isAddModalOpen && (
  <div className={modalStyles.modalContainer}>
    <div className={modalStyles.modal}>
      <button className={modalStyles.closeModal} onClick={() => setAddModalOpen(false)}>&times;</button>
      <form onSubmit={handleAddUser} className={modalStyles.form}>
        <h2>Добавить пользователя</h2>
        <label>Логин:</label>
        <input
          type="text"
          placeholder="+375(__)___-__-__"
          className={modalStyles.input}
          value={newUser.login}
          onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
        />
        <label>Пароль:</label>
        <input
          type="password"
          className={modalStyles.input}
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <label>ФИО:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={newUser.fio}
          onChange={(e) => setNewUser({ ...newUser, fio: e.target.value })}
        />
        <label>Должность:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={newUser.position}
          onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
        />
        <label>Статус:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={newUser.statusEmployee}
          onChange={(e) => setNewUser({ ...newUser, statusEmployee: e.target.value })}
        />
        <label>Код доступа:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={newUser.accessCode}
          onChange={(e) => setNewUser({ ...newUser, accessCode: e.target.value })}
        />
        <button type="submit" className={modalStyles.button} disabled={isAdding}>{isAdding ? 'Добавление...' : 'Добавить'}</button>

      </form>
    </div>
  </div>
)}

{isEditModalOpen && (
  <div className={modalStyles.modalContainer}>
    <div className={modalStyles.modal}>
      <button className={modalStyles.closeModal} onClick={() => setEditModalOpen(false)}>&times;</button>
      <form onSubmit={handleEditUser} className={modalStyles.form}>
        <h2>Изменить пользователя</h2>
        
        <label>Логин:</label>
        <input
          type="text"
          placeholder="+375(__)___-__-__"
          className={modalStyles.input}
          value={editUser?.login || ''}
          onChange={(e) => setEditUser({ ...editUser, login: e.target.value })}
        />
        
        <label>Пароль:</label>
        <input
          type="password"
          className={modalStyles.input}
          value={editUser?.password || ''}
          onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
        />
        
        <label>ФИО:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={editUser?.fio || ''}
          onChange={(e) => setEditUser({ ...editUser, fio: e.target.value })}
        />
        
        <label>Должность:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={editUser?.position || ''}
          onChange={(e) => setEditUser({ ...editUser, position: e.target.value })}
        />
        
        <label>Статус:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={editUser?.statusEmployee || ''}
          onChange={(e) => setEditUser({ ...editUser, statusEmployee: e.target.value })}
        />
        
        <label>Код доступа:</label>
        <input
          type="text"
          className={modalStyles.input}
          value={editUser?.accessCode || ''}
          onChange={(e) => setEditUser({ ...editUser, accessCode: e.target.value })}
        />
        <button type="submit" className={modalStyles.button} disabled={isEditing}>{isEditing ? 'Изменение...' : 'Изменить'}</button>
      </form>
    </div>
  </div>
)}


      {isDeleteModalOpen && (
        <div className={modalStylesDelete.modalContainer}>
          <div className={modalStylesDelete.modal}>
            <button 
              className={modalStylesDelete.closeModal} 
              onClick={handleDeleteCancel}
            >
              &times;
            </button>
            <div className={modalStylesDelete.modalContent}>
              <h3>Вы уверены, что хотите удалить этого пользователя?</h3>
              <div className={modalStylesDelete.modalActions}>
                <button onClick={handleDeleteCancel} className={modalStylesDelete.cancelButton}>
                  Отмена
                </button>
                <button onClick={handleDeleteConfirm} className={modalStylesDelete.deleteButton} disabled={isDeleting}>{isDeleting ? 'Удаление...' : 'Удалить'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Employees;
