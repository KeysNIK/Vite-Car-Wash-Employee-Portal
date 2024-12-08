// LoginForm.jsx
import { useState, useEffect } from 'react';
import './LoginFormCSS.css';
import IMask from 'imask';

function LoginForm({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const element = document.getElementById('login-input');
    if (element) {
      const maskOptions = {
        mask: '+375(00)000-00-00',
        lazy: false
      };
      const phoneMask = new IMask(element, maskOptions);

      element.addEventListener('input', () => {
        const phoneValue = element.value;
        setPhone(phoneValue);

        if (phoneValue.length === 17) {
          setIsPhoneValid(true);
        } else {
          setIsPhoneValid(false);
        }
      });
    }
  }, []);

  const handleSubmitPhone = (e) => {
    e.preventDefault();
    if (isPhoneValid) {
      setStep(2);
      setErrorMessage('');
    } else {
      alert('Пожалуйста, введите корректный номер телефона');
    }
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    // Отправляем данные на сервер для проверки
    fetch('http://a1057091.xsph.ru/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('Успешный вход');
          // Уведомляем родительский компонент об успешной аутентификации
          onLoginSuccess();
        } else {
          setErrorMessage(data.message);
          setStep(1);
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action(e);
    }
  };

  const handleReturnToPhone = () => {
    setStep(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nextPage = () => {
    onLoginSuccess();
  }

  return (
    <>
      <button onClick={nextPage}>Перейти на главную</button>
      {step === 1 && (
        <form id="login-form">
          <div id="logo">
            <img id="image" src="" alt="Логотип" />
            <h1 id="name">Алгоритм Чистоты</h1>
          </div>
          <div id="login">
            <input
              id="login-input"
              name="login-input"
              type="text"
              placeholder="+375(__)___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleSubmitPhone)}
            />
            <button type="button" onClick={handleSubmitPhone} disabled={!isPhoneValid}>
              Далее
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        </form>
      )}

      {step === 2 && (
        <form id="login-form">
          <div id="logo">
            <img id="image" src="" alt="Логотип" />
            <h1 id="name">Алгоритм Чистоты</h1>
          </div>
          <div id="login">
            <input
              id="login-input-password"
              type={showPassword ? "text" : "password"}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleSubmitPassword)}
            />
            <button
              type="button"
              onClick={handleSubmitPassword}
              disabled={!password}
            >
              Далее
            </button>

            <button
              type="button"
              onClick={handleReturnToPhone}
              style={{ marginTop: '10px', backgroundColor: '#ccc' }}
            >
              Вернуться к номеру
            </button>

            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px',
                color: '#007bff'
              }}
            >
              {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default LoginForm;
