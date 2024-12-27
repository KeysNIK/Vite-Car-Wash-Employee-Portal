import React, { useEffect, useState } from "react";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";
import ms from "../ms.module.css";
import searchStyles from "../Search.module.css";

const CarQueue = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [isAccepting, setIsAccepting] = useState(false); // Для принятия заказа
  const [isCompleting, setIsCompleting] = useState(false); // Для завершения заказа

    
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
                    backgroundColor: 'rgb(152, 195, 252)',
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