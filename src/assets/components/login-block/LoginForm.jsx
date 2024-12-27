import { useState, useEffect } from 'react';
import styles from './LoginForm.module.css';
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
        lazy: false,
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
  
    fetch('http://f1069235.xsph.ru/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          console.log('Успешный вход');
          console.log(data.accessCode);
          // Сохранение куки
          if (data.accessCode) {
            document.cookie = `accessCode=${data.accessCode}; path=/`;          
            console.log('Куки сохранены:', document.cookie);
          }
    
          // Уведомляем родительский компонент об успешной аутентификации
          onLoginSuccess();
        } else {
          setErrorMessage(data.message);
          setStep(1);
        }
      })
      .catch((error) => {
        console.error('Ошибка запроса:', error.message);
        setErrorMessage('Произошла ошибка при входе. Попробуйте позже.');
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
  };

  return (
    <>
      <button onClick={nextPage}>Перейти на главную</button>
      <div className={styles.container}>
        {step === 1 && (
          <form className={styles.formWrapper}>
            <div className={styles.logo}>
              <img className={styles.logoImage} src="" alt="Логотип" />
              <h1 className={styles.h1}>Алгоритм Чистоты</h1>
            </div>
            <div>
              <input
                id="login-input"
                name="login-input"
                type="text"
                placeholder="+375(__)___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleSubmitPhone)}
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={handleSubmitPhone}
                disabled={!isPhoneValid}
                className={styles.button}
              >
                Далее
              </button>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>
          </form>
        )}

        {step === 2 && (
          <form className={styles.formWrapper}>
            <div className={styles.logo}>
              <img className={styles.logoImage} src="" alt="Логотип" />
              <h1 className={styles.h1}>Алгоритм Чистоты</h1>
            </div>
            <div>
              <input
                id="login-input-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleSubmitPassword)}
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={handleSubmitPassword}
                disabled={!password}
                className={styles.button}
              >
                Далее
              </button>

              <button
                type="button"
                onClick={handleReturnToPhone}
                className={`${styles.button} ${styles.backButton}`}
              >
                Вернуться к номеру
              </button>

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordVisibilityButton}
              >
                {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default LoginForm;
