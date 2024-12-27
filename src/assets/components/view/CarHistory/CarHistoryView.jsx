import React, { useEffect, useState } from "react";
import tableStyles from "../Table.module.css"; 
import paginationStyles from "../Pagination.module.css";
import searchStyles from "../Search.module.css";

const CarHistory = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
    
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
        `http://f1069235.xsph.ru/CarHistory.php?page=${page}&limit=${limit}&search=${search}`
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
              <th onClick={() => requestSort('Price')}>Цена {getSortIndicator('Price')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ID}>
                <td>{item.NumberCar}</td>
                <td>{item.CarBrand}</td>
                <td>{item.CarModel}</td>
                <td>{item.CarColor}</td>
                <td>{item.ClientsID}</td>
                <td>{item.AcceptanceDate}</td>
                <td>{item.Services}</td>
                <td>{item.Price}</td>
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
    </>
  );  
};

export default CarHistory;