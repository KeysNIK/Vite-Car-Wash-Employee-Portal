import React, { useState, useEffect } from 'react';
import styles from './Add.module.css';

const NewOrder = () => {
  const [showClientForm, setShowClientForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fio: '',
    email: '',
    countVisits: '',
    clientDiscount: '',
  });
  const [newOrder, setNewOrder] = useState({
    email: '',
    numberCar: '',
    carBrand: '',
    carModel: '',
    carColor: '',
    clientsID: '',
    acceptanceDate: '',
    services: [],
    totalPrice: 0,
    totalExecutionTime: 0,
  });
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://a1057091.xsph.ru/CarWash.php');
      const data = await response.json();
  
      if (data.status === 'success') {
        setServices(data.data);
      } else {
        console.error('Ошибка при получении данных: ', data);
      }
    } catch (error) {
      console.error('Ошибка при получении услуг:', error);
    }
  };
  

  const handleSelectService = (service) => {
    const isSelected = selectedServices.some((s) => s.ID === service.ID);
  
    if (isSelected) {
      setSelectedServices((prevServices) =>
        prevServices.filter((s) => s.ID !== service.ID)
      );
    } else {
      setSelectedServices((prevServices) => [...prevServices, service]);
    }
  };
  

  const calculateTotals = () => {
    let totalPrice = 0;
    let totalExecutionTime = 0;
    selectedServices.forEach((service) => {
      totalPrice += parseFloat(service.Price);
      totalExecutionTime += parseInt(service.ExecutionTime, 10);
    });
    return { totalPrice, totalExecutionTime };
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddClient = () => {
    setShowClientForm(true);
    setShowOrderForm(false);
  };

  const handleAddOrderMenu = () => {
    setShowOrderForm(true);
    setShowClientForm(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch('http://a1057091.xsph.ru/Clients.php', {
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
        setModalMessage('Клиент успешно добавлен');
        setNewUser({ fio: '', email: '', countVisits: '', clientDiscount: '' });
        setShowClientForm(false);
        setShowOrderForm(true);
      } else {
        setModalMessage(`Ошибка добавления: ${result.message}`);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Ошибка добавления пользователя:', error);
      setModalMessage('Произошла ошибка при добавлении клиента');
      setShowModal(true);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setIsAdding(true);
  
    const { totalPrice, totalExecutionTime } = calculateTotals();
  
    try {
      const response = await fetch('http://a1057091.xsph.ru/AddOrderWithServices.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'add',
          email: newOrder.email, 
          numberCar: newOrder.numberCar,
          carBrand: newOrder.carBrand,
          carModel: newOrder.carModel,
          carColor: newOrder.carColor,
          acceptanceDate: newOrder.acceptanceDate,
          services: JSON.stringify(selectedServices),
        }),
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        setModalMessage('Заказ успешно добавлен вместе с услугами');
        setNewOrder({ numberCar: '', carBrand: '', carModel: '', carColor: '', clientsID: '', acceptanceDate: '', services: [], totalPrice: 0, totalExecutionTime: 0 });
        setSelectedServices([]);
      } else {
        setModalMessage(`Ошибка добавления заказа и услуг: ${result.message}`);
      }
  
      setShowModal(true);
    } catch (error) {
      console.error('Ошибка добавления заказа:', error);
      setModalMessage('Произошла ошибка при добавлении заказа и услуг');
      setShowModal(true);
    } finally {
      setIsAdding(false);
    }
  };
  
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleAddClient}>
          Добавить клиента
        </button>
        <button className={styles.button} onClick={handleAddOrderMenu}>
          Добавить заказ
        </button>
      </div>

      {showClientForm && (
        <div className={`${styles.formContainer} ${styles.fadeIn}`}>
          <h2>Добавить клиента</h2>
          <form onSubmit={handleAddUser} className={styles.form}>
            <h3>ФИО клиента</h3>
            <input
              className={styles.input}
              type="text"
              name="fio"
              placeholder="ФИО клиента"
              value={newUser.fio}
              onChange={handleClientChange}
              required
            />
            <h3>Количество визитов</h3>
            <input
              className={styles.input}
              type="number"
              name="countVisits"
              placeholder="Количество визитов"
              value={newUser.countVisits}
              onChange={handleClientChange}
              required
            />
            <h3>Скидка клиента</h3>
            <input
              className={styles.input}
              type="number"
              name="clientDiscount"
              placeholder="Скидка клиента"
              value={newUser.clientDiscount}
              onChange={handleClientChange}
              required
            />
            <button className={styles.submitButton} type="submit" disabled={isAdding}>
              {isAdding ? 'Добавление...' : 'Добавить клиента'}
            </button>
          </form>
        </div>
      )}

      {showOrderForm && (
        <div className={`${styles.formContainer} ${styles.fadeIn}`}>
          <h2>Добавить заказ</h2>
          <form onSubmit={handleAddOrder} className={styles.form}>
            {/* Поля для данных заказа */}
            <h3>Email клиента</h3>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Введите email"
              value={newOrder.email}
              onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
              required
            />

            <h3>Номер автомобиля</h3>
            <input
              className={styles.input}
              type="text"
              name="numberCar"
              placeholder="Номер автомобиля"
              value={newOrder.numberCar}
              onChange={(e) => setNewOrder({ ...newOrder, numberCar: e.target.value })}
              required
            />
            <h3>Марка автомобиля</h3>
            <input
              className={styles.input}
              type="text"
              name="carBrand"
              placeholder="Марка автомобиля"
              value={newOrder.carBrand}
              onChange={(e) => setNewOrder({ ...newOrder, carBrand: e.target.value })}
              required
            />
            <h3>Модель автомобиля</h3>
            <input
              className={styles.input}
              type="text"
              name="carModel"
              placeholder="Модель автомобиля"
              value={newOrder.carModel}
              onChange={(e) => setNewOrder({ ...newOrder, carModel: e.target.value })}
              required
            />
            <h3>Цвет автомобиля</h3>
            <input
              className={styles.input}
              type="text"
              name="carColor"
              placeholder="Цвет автомобиля"
              value={newOrder.carColor}
              onChange={(e) => setNewOrder({ ...newOrder, carColor: e.target.value })}
              required
            />
            <h3>Дата принятия заказа</h3>
            <input
              className={styles.input}
              type="date"
              name="acceptanceDate"
              value={newOrder.acceptanceDate}
              onChange={(e) => setNewOrder({ ...newOrder, acceptanceDate: e.target.value })}
              required
            />

            <div className={styles.servicesList}>
            {Array.isArray(services) && services.length > 0 ? (
                services.map((service) => {
                const isSelected = selectedServices.some((s) => s.ID === service.ID);

                return (
                    <button
                        key={service.ID}
                        type="button"
                        className={`${styles.serviceButton} ${isSelected ? styles.selected : styles.notSelected}`}
                        onClick={() => handleSelectService(service)}
                    >
                    {isSelected
                        ? `${service.ServicesName} `
                        : `${service.ServicesName} `}
                    (Цена: {service.Price} BYN, Время: {service.ExecutionTime} мин)
                    </button>
                );
                })
            ) : (
                <p>Загружаются услуги...</p>
            )}
            </div>

            {/* Список выбранных услуг */}
            <h3>Выбранные услуги:</h3>
            <div className={styles.selectedServices}>
              {selectedServices.map((service) => (
                <div key={service.ID} className={styles.selectedService}>
                  <span>{service.ServicesName} (Цена: {service.Price} BYN, Время: {service.ExecutionTime} мин)</span>
                </div>
              ))}
            </div>

            {/* Итоги */}
            <h3>Общая стоимость: {calculateTotals().totalPrice} ₽</h3>
            <h3>Общее время: {calculateTotals().totalExecutionTime} минут</h3>

            <button className={styles.submitButton} type="submit" disabled={isAdding}>
              {isAdding ? 'Добавление...' : 'Добавить заказ'}
            </button>
          </form>
        </div>
      )}

      {/* Модальное окно для отображения результата добавления */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{modalMessage}</h3>
            <button className={styles.closeModalButton} onClick={handleCloseModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrder;
