import React, { useEffect, useState } from "react";
import modalStyles from "../Modal.module.css";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";
import modalStylesDelete from "../ModalDelete.module.css";
import searchStyles from "../Search.module.css";
import ms from "../ms.module.css";

const CarQueue = () => {
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

  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
    
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    numberCar: "",
    carBrand: "",
    carModel: "",
    carColor: "",
    clientsID: "",
    acceptanceDate: "",
    services: "",
    price: "",
    executionTime: "",
  });
    
  const [search, setSearch] = useState('');
    
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [servicesData, setServicesData] = useState([]);


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
            `http://f1069235.xsph.ru/CarQueue.php?page=${page}&limit=${limit}&search=${search}`
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
        const response = await fetch(`http://f1069235.xsph.ru/CarQueue.php?id=${userToDelete.ID}`, {
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
      const response = await fetch('http://f1069235.xsph.ru/CarQueue.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'add',
        numberCar: newUser.numberCar,
        carBrand: newUser.carBrand,
        carModel: newUser.carModel,
        carColor: newUser.carColor,
        clientsID: newUser.clientsID,
        acceptanceDate: newUser.acceptanceDate,
        services: newUser.services,
        executionTime: newUser.executionTime,
        price: newUser.price,
      }),
      
      });
    
      const result = await response.json();
    
      if (result.status === 'success') {
        fetchData();
        setAddModalOpen(false);
        setNewUser({
          numberCar: '',
          carBrand: '',
          carModel: '',
          carColor: '',
          clientsID: '',
          acceptanceDate: '',
          services: '',
          executionTime: '',
          price: '',
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
    

    try {
      const response = await fetch('http://f1069235.xsph.ru/CarQueue.php', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            action: 'edit',
            id: editUser.id,
            numberCar: editUser.numberCar,
            carBrand: editUser.carBrand,
            carModel: editUser.carModel,
            carColor: editUser.carColor,
            clientsID: editUser.clientsID,
            acceptanceDate: editUser.acceptanceDate,
            services: editUser.services,
            executionTime: editUser.executionTime,
            price: editUser.price,
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
        numberCar: item.NumberCar,
        carBrand: item.CarBrand,
        carModel: item.CarModel,
        carColor: item.CarColor,
        clientsID: item.ClientsID,
        acceptanceDate: item.AcceptanceDate,
        services: item.Services,
        executionTime: item.ExecutionTime,
        price: item.Price,
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

// Usage in `handleAcceptOrder`
const handleAcceptOrder = async (id) => {
  setIsAccepting(true); // Устанавливаем флаг выполнения
  try {
      const response = await fetch('http://f1069235.xsph.ru/CarQueue.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ action: 'accept', id }),
      });
      const result = await response.json();
      if (result.status === 'success') {
          fetchData();
      } else {
          alert(`Ошибка: ${result.message}`);
      }
  } catch (error) {
      console.error('Ошибка принятия заказа:', error);
  } finally {
      setIsAccepting(false); // Сбрасываем флаг после выполнения
  }
};

const handleCompleteOrder = async (id) => {
  setIsCompleting(true); // Устанавливаем флаг выполнения
  try {
      const response = await fetch('http://f1069235.xsph.ru/CarQueue.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ action: 'complete', id }),
      });
      const result = await response.json();
      if (result.status === 'success') {
          setPage(1);
          fetchData();
      } else {
          alert(`Ошибка: ${result.message}`);
      }
  } catch (error) {
      console.error('Ошибка завершения заказа:', error);
  } finally {
      setIsCompleting(false); // Сбрасываем флаг после выполнения
  }
};



const fetchServicesForClient = async (clientID) => {
  try {
    const response = await fetch(`http://f1069235.xsph.ru/CarWashServicesQueue.php?ID=${clientID}`);
    const result = await response.json();
    
    if (result.data) {
      setServicesData(result.data);
      setServicesModalOpen(true); 
    } else {
      alert("Услуги не найдены.");
    }
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
  }
};

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
              <th onClick={() => requestSort('NumberCar')}>Номер автомобиля {getSortIndicator('NumberCar')}</th>
              <th onClick={() => requestSort('CarBrand')}>Марка автомобиля {getSortIndicator('CarBrand')}</th>
              <th onClick={() => requestSort('CarModel')}>Модель автомобиля {getSortIndicator('Price')}</th>
              <th onClick={() => requestSort('CarColor')}>Цвет автомобиля {getSortIndicator('CarColor')}</th>
              <th onClick={() => requestSort('ClientsID')}>ID клиента {getSortIndicator('ClientsID')}</th>
              <th onClick={() => requestSort('AcceptanceDate')}>Дата приема {getSortIndicator('AcceptanceDate')}</th>
              <th onClick={() => requestSort('Services')}>Услуги {getSortIndicator('Services')}</th>
              <th onClick={() => requestSort('ExeptionTime')}>Время выполнения {getSortIndicator('ExeptionTime')}</th>
              <th onClick={() => requestSort('Price')}>Цена {getSortIndicator('Price')}</th>
              <th>Действия</th>
              <th>Прием</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ID} className={item.status === 'accepted' ? tableStyles.accepted : ''}>
                <td>{item.NumberCar}</td>
                <td>{item.CarBrand}</td>
                <td>{item.CarModel}</td>
                <td>{item.CarColor}</td>
                <td>{item.ClientsID}</td>
                <td>{item.AcceptanceDate}</td>
                <td
                  style={{
                    backgroundColor: '#7fbdff',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                  onClick={() => fetchServicesForClient(item.Services)}
                >
                  Услуги этого заказа
                </td>

                <td>{item.ExecutionTime}</td>
                <td>{item.Price}</td>
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
                <td>
                  {item.status === 'pending' ? (
                    <button
                      style={{ backgroundColor: '#4CAF50', color: 'white' }}
                      onClick={() => handleAcceptOrder(item.ID)}
                      disabled={isAccepting}
                    >
                      {isAccepting ? 'Принятие...' : 'Принять заказ'}
                    </button>
                  ) : item.status === 'accepted' ? (
                    <button
                      style={{ backgroundColor: '#FF9800', color: 'white' }}
                      onClick={() => handleCompleteOrder(item.ID)}
                      disabled={isCompleting}
                    >
                      {isCompleting ? 'Завершение...' : 'Завершить'}
                    </button>
                  ) : (
                    'Завершено'
                  )}
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
              <h2>Добавить клиента в очередь</h2>
              <label>Номер автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.numberCar}
                onChange={(e) => setNewUser({ ...newUser, numberCar: e.target.value })}
              />

              <label>Марка автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.carBrand}
                onChange={(e) => setNewUser({ ...newUser, carBrand: e.target.value })}
              />

              <label>Модель автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.carModel}
                onChange={(e) => setNewUser({ ...newUser, carModel: e.target.value })}
              />
              
              <label>Цвет автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.carColor}
                onChange={(e) => setNewUser({ ...newUser, carColor: e.target.value })}
              />
              
              <label>ID Клиента:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.clientsID}
                onChange={(e) => setNewUser({ ...newUser, clientsID: e.target.value })}
              />

              <label>Дата приема:</label>
              <input
                type="date"
                className={modalStyles.input}
                value={newUser.acceptanceDate}
                onChange={(e) => setNewUser({ ...newUser, acceptanceDate: e.target.value })}
              />
              
              <label>Услуги:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.services}
                onChange={(e) => setNewUser({ ...newUser, services: e.target.value })}
              />

              <label>Время выполнения МИН:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.executionTime}
                onChange={(e) => setNewUser({ ...newUser, executionTime: e.target.value })}
              />

              <label>Цена:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={newUser.price}
                onChange={(e) => setNewUser({ ...newUser, price: e.target.value })}
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
              <h2>Изменить клиента в очереди</h2>
              
              <label>Номер автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.numberCar || ''}
                onChange={(e) => setEditUser({ ...editUser, numberCar: e.target.value })}
              />

              <label>Марка автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.carBrand || ''}
                onChange={(e) => setEditUser({ ...editUser, carBrand: e.target.value })}
              />

              <label>Модель автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.carModel || ''}
                onChange={(e) => setEditUser({ ...editUser, carModel: e.target.value })}
              />
              
              <label>Цвет автомобиля:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.carColor || ''}
                onChange={(e) => setEditUser({ ...editUser, carColor: e.target.value })}
              />
              
              <label>ID Клиента:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.clientsID || ''}
                onChange={(e) => setEditUser({ ...editUser, clientsID: e.target.value })}
              />

              <label>Дата приема:</label>
              <input
                type="date"
                className={modalStyles.input}
                value={editUser?.acceptanceDate || ''}
                onChange={(e) => setEditUser({ ...editUser, acceptanceDate: e.target.value })}
              />
              
              <label>Услуги:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.services || ''}
                onChange={(e) => setEditUser({ ...editUser, services: e.target.value })}
              />
              
              <label>Время выполнения МИН:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.executionTime || ''}
                onChange={(e) => setEditUser({ ...editUser, executionTime: e.target.value })}
              />

              <label>Цена:</label>
              <input
                type="text"
                className={modalStyles.input}
                value={editUser?.price || ''}
                onChange={(e) => setEditUser({ ...editUser, price: e.target.value })}
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
            <h3>Вы уверены, что хотите удалить этого человека в очереди?</h3>
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

      {servicesModalOpen && (
        <div className={ms.modalContainer}>
          <div className={ms.modal}>
            <button className={ms.closeModal} onClick={() => setServicesModalOpen(false)}>&times;</button>
            <h2>Услуги для клиента {servicesData[0]?.ClientsID}</h2>
            <div className={ms.servicesList}>
              {servicesData.map((service) => (
                <div key={service.ID} className={ms.serviceItem}>
                  <p>{service.ServicesName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );  
};

export default CarQueue;