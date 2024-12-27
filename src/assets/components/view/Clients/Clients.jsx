import React, { useEffect, useState } from "react";
import modalStyles from "../Modal.module.css";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";
import modalStylesDelete from "../ModalDelete.module.css";
import searchStyles from "../Search.module.css";

const Clients = () => {
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
    fio: "",
    email: "",
    countVisits: "",
    clientDiscount: "",
  });
    
  const [search, setSearch] = useState('');
    
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  const handleSearchChange = (e) => {
    let searchValue = e.target.value;
    setSearch(searchValue);
    fetchData(searchValue);
  };

  const fetchData = async (search = '') => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const limit = 15;
      const response = await fetch(
        `http://f1069235.xsph.ru/Clients.php?page=${page}&limit=${limit}&search=${search}`
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
        const response = await fetch(`http://f1069235.xsph.ru/Clients.php?id=${userToDelete.ID}`, {
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
   
    try {
      const response = await fetch('http://f1069235.xsph.ru/Clients.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'add',
        fio: newUser.fio,
        email: newUser.email,
        countVisits: newUser.countVisits,
        clientDiscount: newUser.clientDiscount,
      }),
      
      });
    
      const result = await response.json();
    
      if (result.status === 'success') {
        fetchData();
        setAddModalOpen(false);
        setNewUser({
          fio: '',
          email: '',
          countVisits: '',
          clientDiscount: '',
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

    console.log({
        action: 'edit',
        id: editUser.id,
        fio: editUser.fio,
        email: editUser.email,
        countVisits: editUser.countVisits,
        clientDiscount: editUser.clientDiscount,
      });
      

    try {
        const response = await fetch('http://f1069235.xsph.ru/Clients.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'edit',
                id: editUser.id,
                fio: editUser.fio,
                email: editUser.email,
                countVisits: editUser.countVisits,
                clientDiscount: editUser.clientDiscount,
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
        id: item.ID,
        fio: item.FIO,
        email: item.Email,
        countVisits: item.CountVisits,
        clientDiscount: item.ClientDiscount,
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
              <th onClick={() => requestSort('FIO')}>ФИО {getSortIndicator('FIO')}</th>
              <th onClick={() => requestSort('Email')}>Email {getSortIndicator('Email')}</th>
              <th onClick={() => requestSort('CountVisits')}>Количество посещений {getSortIndicator('CountVisits')}</th>
              <th onClick={() => requestSort('ClientDiscount')}>Скидка клиента {getSortIndicator('ClientDiscount')}</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ID}>
                <td>{item.FIO}</td>
                <td>{item.Email}</td>
                <td>{item.CountVisits}</td>
                <td>{item.ClientDiscount}</td>
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
              <h2>Добавить клиента</h2>
              <label>ФИО:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.fio}
                onChange={(e) => setNewUser({ ...newUser, fio: e.target.value })}
              />

              <label>Почта:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              <label>Количество посещений:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.countVisits}
                onChange={(e) => setNewUser({ ...newUser, countVisits: e.target.value })}
              />

              <label>Скидка клиента:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.clientDiscount}
                onChange={(e) => setNewUser({ ...newUser, clientDiscount: e.target.value })}
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
              <h2>Изменить клиента</h2>
              
              <label>ФИО:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.fio || ''}
                onChange={(e) => setEditUser({ ...editUser, fio: e.target.value })}
              />
              
              <label>Почта:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
              
              <label>Количество посещений:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.countVisits || ''}
                onChange={(e) => setEditUser({ ...editUser, countVisits: e.target.value })}
              />
              
              <label>Скидка клиента:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.clientDiscount || ''}
                onChange={(e) => setEditUser({ ...editUser, clientDiscount: e.target.value })}
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
            <h3>Вы уверены, что хотите удалить этого клиента?</h3>
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

export default Clients;