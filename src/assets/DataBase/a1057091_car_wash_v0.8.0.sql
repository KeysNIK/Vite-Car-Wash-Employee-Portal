-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 10.0.1.96
-- Время создания: Дек 19 2024 г., 22:32
-- Версия сервера: 8.0.37-29
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `a1057091_car_wash`
--

-- --------------------------------------------------------

--
-- Структура таблицы `CarHistory`
--

CREATE TABLE `CarHistory` (
  `ID` int NOT NULL,
  `NumberCar` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarBrand` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarModel` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarColor` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ClientsID` int NOT NULL,
  `AcceptanceDate` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Services` int NOT NULL,
  `Price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Дамп данных таблицы `CarHistory`
--

INSERT INTO `CarHistory` (`ID`, `NumberCar`, `CarBrand`, `CarModel`, `CarColor`, `ClientsID`, `AcceptanceDate`, `Services`, `Price`) VALUES
(1, 'AB1234-7', 'Toyota', 'Corolla', 'Белый', 1, '2024-12-19', 1, 50),
(2, 'CD5678-7', 'Honda', 'Civic', 'Черный', 2, '2024-12-18', 2, 30),
(3, 'EF9012-7', 'BMW', 'X5', 'Синий', 3, '2024-12-17', 3, 80),
(4, 'GH3456-7', 'Audi', 'A4', 'Красный', 4, '2024-12-16', 4, 60),
(5, 'IJ7890-7', 'Volkswagen', 'Golf', 'Серый', 5, '2024-12-15', 5, 40),
(6, 'KL1234-7', 'Ford', 'Focus', 'Зеленый', 6, '2024-12-14', 1, 50),
(7, 'MN5678-7', 'Mercedes', 'C-Class', 'Черный', 7, '2024-12-13', 2, 70),
(8, 'OP9012-7', 'Hyundai', 'Elantra', 'Белый', 8, '2024-12-12', 3, 35),
(9, 'QR3456-7', 'Kia', 'Rio', 'Синий', 9, '2024-12-11', 4, 45),
(10, 'ST7890-7', 'Lexus', 'RX', 'Красный', 10, '2024-12-10', 5, 90),
(11, 'UV1234-7', 'Skoda', 'Octavia', 'Серый', 11, '2024-12-09', 1, 50),
(13, 'YZ9012-7', 'Chevrolet', 'Malibu', 'Черный', 13, '2024-12-07', 3, 30),
(14, 'AA3456-7', 'Mazda', '6', 'Красный', 14, '2024-12-06', 4, 55),
(15, 'BB7890-7', 'Subaru', 'Forester', 'Зеленый', 15, '2024-12-05', 5, 85),
(16, 'CC1234-7', 'Tesla', 'Model 3', 'Синий', 16, '2024-12-04', 1, 100),
(17, 'DD5678-7', 'Peugeot', '308', 'Белый', 17, '2024-12-03', 2, 40),
(18, 'EE9012-7', 'Renault', 'Duster', 'Серый', 18, '2024-12-02', 3, 50),
(19, 'FF3456-7', 'Volvo', 'XC60', 'Черный', 19, '2024-12-01', 4, 95),
(20, 'GG7890-7', 'Fiat', '500', 'Красный', 20, '2024-11-30', 5, 25),
(21, 'HH1234-7', 'Jaguar', 'XF', 'Синий', 21, '2024-11-29', 1, 90),
(22, 'II5678-7', 'Opel', 'Astra', 'Белый', 22, '2024-11-28', 2, 35),
(23, 'JJ9012-7', 'Alfa Romeo', 'Giulia', 'Красный', 23, '2024-11-27', 3, 85),
(24, 'KK3456-7', 'Chery', 'Tiggo 7', 'Черный', 24, '2024-11-26', 4, 45),
(25, 'LL7890-7', 'Toyota', 'Camry', 'Серый', 25, '2024-11-25', 5, 70),
(26, 'MM1234-7', 'Honda', 'Accord', 'Зеленый', 26, '2024-11-24', 1, 55),
(27, 'NN5678-7', 'BMW', '3 Series', 'Синий', 27, '2024-11-23', 2, 60),
(28, 'OO9012-7', 'Audi', 'Q7', 'Белый', 28, '2024-11-22', 3, 120),
(29, 'PP3456-7', 'Volkswagen', 'Passat', 'Красный', 29, '2024-11-21', 4, 50),
(30, 'QQ7890-7', 'Ford', 'Explorer', 'Черный', 30, '2024-11-20', 5, 95),
(31, 'RR1234-7', 'Hyundai', 'Tucson', 'Серый', 31, '2024-11-19', 1, 45),
(32, 'SS5678-7', 'Kia', 'Sportage', 'Белый', 32, '2024-11-18', 2, 55),
(33, 'TT9012-7', 'Lexus', 'ES', 'Красный', 33, '2024-11-17', 3, 85),
(34, 'UU3456-7', 'Skoda', 'Superb', 'Черный', 34, '2024-11-16', 4, 60),
(35, 'VV7890-7', 'Nissan', 'X-Trail', 'Зеленый', 35, '2024-11-15', 5, 75),
(36, 'WW1234-7', 'Chevrolet', 'Spark', 'Синий', 36, '2024-11-14', 1, 30),
(37, 'XX5678-7', 'Mazda', 'CX-5', 'Белый', 37, '2024-11-13', 2, 65),
(38, 'YY9012-7', 'Subaru', 'Outback', 'Серый', 38, '2024-11-12', 3, 70),
(39, 'ZZ3456-7', 'Tesla', 'Model Y', 'Красный', 39, '2024-11-11', 4, 110),
(40, 'AA7890-7', 'Peugeot', '508', 'Черный', 40, '2024-11-10', 5, 50);

-- --------------------------------------------------------

--
-- Структура таблицы `CarQueue`
--

CREATE TABLE `CarQueue` (
  `NumberCar` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarBrand` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarModel` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CarColor` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ClientsID` int NOT NULL,
  `AcceptanceDate` date NOT NULL,
  `Services` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `ExecutionTime` int NOT NULL,
  `Price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `CarWashServices`
--

CREATE TABLE `CarWashServices` (
  `ID` int NOT NULL,
  `ServicesName` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Price` decimal(10,0) NOT NULL,
  `ExecutionTime` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Дамп данных таблицы `CarWashServices`
--

INSERT INTO `CarWashServices` (`ID`, `ServicesName`, `Price`, `ExecutionTime`) VALUES
(1, 'Экспресс-мойка', 30, 20),
(2, 'Полная мойка', 70, 40),
(3, 'Химчистка салона', 60, 180),
(4, 'Полировка кузова', 80, 300),
(5, 'Мойка двигателя', 70, 30),
(6, 'Нанесение воска', 150, 60),
(7, 'Обработка стекол антидождем', 50, 20),
(8, 'Уборка ковров и сидений', 60, 40),
(9, 'Озонирование салона', 100, 30),
(10, 'Полировка фар', 20, 45),
(11, 'Удаление царапин на кузове', 200, 180),
(12, 'Замена ковриков', 200, 20),
(13, 'Антибактериальная обработка', 120, 60),
(14, 'Чернение шин', 15, 15),
(15, 'Удаление битумных пятен', 50, 30),
(16, 'Полная мойка с воском', 130, 90),
(17, 'Уход за кожаным салоном', 100, 120),
(18, 'Очистка вентиляции и кондиционера', 200, 120),
(19, 'Полировка дисков', 100, 1),
(20, 'Восстановление лакокрасочного покрытия', 400, 360);

-- --------------------------------------------------------

--
-- Структура таблицы `CarWashServicesQueue`
--

CREATE TABLE `CarWashServicesQueue` (
  `ID` int NOT NULL,
  `NumberCar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `ServicesName` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Price` decimal(10,0) NOT NULL,
  `ExecutionTime` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `Clients`
--

CREATE TABLE `Clients` (
  `ID` int NOT NULL,
  `FIO` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CountVisits` int NOT NULL,
  `ClientDiscount` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Дамп данных таблицы `Clients`
--

INSERT INTO `Clients` (`ID`, `FIO`, `Email`, `CountVisits`, `ClientDiscount`) VALUES
(1, 'Иванов Иван Иванович', 'ggda003@gmail.com', 5, 10),
(2, 'Петров Петр Петрович', 'petrov2@example.com', 8, 15),
(3, 'Сидоров Сидор Сидорович', 'sidorov3@example.com', 3, 5),
(4, 'Кузнецов Алексей Алексеевич', 'kuznetsov4@example.com', 12, 20),
(5, 'Смирнов Олег Олегович', 'smirnov5@example.com', 7, 10),
(6, 'Попов Дмитрий Дмитриевич', 'popov6@example.com', 4, 5),
(7, 'Васильев Василий Васильевич', 'vasilyev7@example.com', 10, 15),
(8, 'Михайлов Михаил Михайлович', 'mihailov8@example.com', 6, 10),
(9, 'Федоров Федор Федорович', 'fedorov9@example.com', 2, 5),
(10, 'Алексеев Алексей Алексеевич', 'alekseev10@example.com', 9, 15),
(11, 'Егоров Егор Егорович', 'egorov11@example.com', 11, 20),
(12, 'Белов Борис Борисович', 'belov12@example.com', 3, 5),
(13, 'Павлов Павел Павлович', 'pavlov13@example.com', 8, 10),
(14, 'Зайцев Захар Захарович', 'zaitsev14@example.com', 7, 15),
(15, 'Семенов Семен Семенович', 'semenov15@example.com', 5, 10),
(16, 'Григорьев Григорий Григорьевич', 'grigoriev16@example.com', 6, 10),
(17, 'Романов Роман Романович', 'romanov17@example.com', 8, 15),
(18, 'Гаврилов Гавриил Гаврилович', 'gavrilov18@example.com', 4, 5),
(19, 'Андреев Андрей Андреевич', 'andreev19@example.com', 9, 20),
(20, 'Степанов Степан Степанович', 'stepanov20@example.com', 10, 15),
(21, 'Николаев Николай Николаевич', 'nikolaev21@example.com', 2, 5),
(22, 'Орлов Олег Олегович', 'orlov22@example.com', 6, 10),
(23, 'Тимофеев Тимофей Тимофеевич', 'timofeev23@example.com', 7, 15),
(24, 'Панов Павел Петрович', 'panov24@example.com', 3, 5),
(25, 'Воронов Виталий Витальевич', 'voronov25@example.com', 12, 20),
(26, 'Коновалов Константин Константинович', 'konovalov26@example.com', 5, 10),
(27, 'Максимов Максим Максимович', 'maksimov27@example.com', 11, 20),
(28, 'Жуков Захар Захарович', 'zhukov28@example.com', 6, 10),
(29, 'Тихонов Тимур Тимурович', 'tikhonov29@example.com', 4, 5),
(30, 'Баранов Борис Борисович', 'baranov30@example.com', 9, 15),
(31, 'Киселев Кирилл Кириллович', 'kiselev31@example.com', 7, 15),
(32, 'Соболев Станислав Станиславович', 'sobolev32@example.com', 3, 5),
(33, 'Мельников Михаил Михайлович', 'melnikov33@example.com', 5, 10),
(34, 'Денисов Денис Денисович', 'denisov34@example.com', 8, 15),
(35, 'Герасимов Герман Германович', 'gerasimov35@example.com', 6, 10),
(36, 'Фролов Федор Федорович', 'frolov36@example.com', 4, 5),
(37, 'Крылов Константин Константинович', 'krylov37@example.com', 9, 20),
(38, 'Карпов Карл Карлович', 'karpov38@example.com', 11, 25),
(39, 'Плотников Платон Платонович', 'plotnikov39@example.com', 3, 5),
(40, 'Чернов Чарльз Чарльзович', 'chernov40@example.com', 10, 15);

-- --------------------------------------------------------

--
-- Структура таблицы `Employees`
--

CREATE TABLE `Employees` (
  `ID` int NOT NULL,
  `Login` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `EmpPassword` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `FIO` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `Position` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `StatusEmployee` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `AccessCode` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Дамп данных таблицы `Employees`
--

INSERT INTO `Employees` (`ID`, `Login`, `EmpPassword`, `FIO`, `Position`, `StatusEmployee`, `AccessCode`) VALUES
(1, '+375(29)951-63-74', '$2y$10$/lRi0kz6uhZLtMg7kRR.eu/0WQxmo5Ma8ialQCJFiw/LACwKlEYU6', 'Долматович Никита Дмитриевич', 'Администратор', 'Работает', '1'),
(2, '+375(33)962-54-76', 'password_hash1', 'Иванов Иван Иванович', 'Мойщик', 'Работает', '0'),
(3, '+375(33)457-68-90', 'password_hash2', 'Петров Петр Петрович', 'Оператор', 'Отпуск', '0'),
(4, '+375(44)789-01-23', 'password_hash3', 'Сидоров Сидор Сидорович', 'Мойщик', 'Больничный', '0'),
(5, '+375(25)234-56-78', 'password_hash4', 'Михайлов Михаил Михайлович', 'Администратор', 'Не работает', '1'),
(6, '+375(17)345-67-89', 'password_hash5', 'Кузнецов Алексей Алексеевич', 'Менеджер', 'Работает', '0'),
(7, '+375(29)876-54-32', 'password_hash6', 'Захарова Екатерина Александровна', 'Оператор', 'Отпуск', '0'),
(8, '+375(33)567-89-01', 'password_hash7', 'Лебедев Дмитрий Олегович', 'Мойщик', 'Не работает', '0'),
(9, '+375(44)678-90-12', 'password_hash8', 'Козлова Ирина Николаевна', 'Менеджер', 'Работает', '0'),
(10, '+375(25)345-67-89', 'password_hash9', 'Васильева Мария Павловна', 'Оператор', 'Больничный', '0'),
(11, '+375(17)234-56-78', 'password_hash10', 'Морозова Анна Валерьевна', 'Администратор', 'Работает', '1'),
(12, '+375(29)234-56-78', 'password_hash11', 'Николаев Николай Иванович', 'Менеджер', 'Работает', '0'),
(13, '+375(33)123-45-67', 'password_hash12', 'Романов Артем Васильевич', 'Оператор', 'Отпуск', '0'),
(14, '+375(44)789-01-23', 'password_hash13', 'Тимофеева Дарина Павловна', 'Мойщик', 'Не работает', '0'),
(15, '+375(25)456-78-90', 'password_hash14', 'Гусев Сергей Александрович', 'Менеджер', 'Работает', '0'),
(16, '+375(17)567-89-01', 'password_hash15', 'Алексеева Татьяна Константиновна', 'Оператор', 'Больничный', '0'),
(17, '+375(29)678-90-12', 'password_hash16', 'Павлова Марина Сергеевна', 'Мойщик', 'Отпуск', '0'),
(18, '+375(33)345-67-89', 'password_hash17', 'Борисова Ольга Петровна', 'Менеджер', 'Не работает', '0'),
(19, '+375(44)123-45-67', 'password_hash18', 'Шевченко Юлия Васильевна', 'Оператор', 'Работает', '0'),
(20, '+375(25)234-56-78', 'password_hash19', 'Соколов Константин Дмитриевич', 'Мойщик', 'Не работает', '0'),
(21, '+375(17)678-90-12', 'password_hash20', 'Зайцева Лариса Геннадиевна', 'Менеджер', 'Работает', '0'),
(22, '+375(29)789-01-23', 'password_hash21', 'Климова Анастасия Васильевна', 'Оператор', 'Отпуск', '0'),
(23, '+375(33)234-56-78', 'password_hash22', 'Романов Владимир Евгеньевич', 'Мойщик', 'Больничный', '0'),
(24, '+375(44)345-67-89', 'password_hash23', 'Никитина Людмила Андреевна', 'Менеджер', 'Не работает', '0'),
(25, '+375(25)123-45-67', 'password_hash24', 'Маркова Ирина Дмитриевна', 'Оператор', 'Работает', '0'),
(26, '+375(17)234-56-78', 'password_hash25', 'Петрова Екатерина Олеговна', 'Мойщик', 'Отпуск', '0'),
(27, '+375(29)987-65-43', 'password_hash26', 'Иванова Светлана Сергеевна', 'Менеджер', 'Больничный', '0'),
(28, '+375(33)345-67-89', 'password_hash27', 'Артемова Юлия Викторовна', 'Оператор', 'Не работает', '0'),
(29, '+375(44)567-89-01', 'password_hash28', 'Кузнецова Дарина Романовна', 'Мойщик', 'Работает', '0'),
(30, '+375(25)234-56-78', 'password_hash29', 'Егорова Ольга Петровна', 'Менеджер', 'Отпуск', '0'),
(31, '+375(17)456-78-90', 'password_hash30', 'Федорова Лидия Владимировна', 'Оператор', 'Не работает', '0'),
(32, '+375(29)345-67-89', 'password_hash31', 'Гаврилова Ирина Петровна', 'Мойщик', 'Работает', '0'),
(33, '+375(33)567-89-01', 'password_hash32', 'Матвеева Юлия Павловна', 'Менеджер', 'Отпуск', '0'),
(34, '+375(44)789-01-23', 'password_hash33', 'Сергеева Алина Анатольевна', 'Оператор', 'Не работает', '0'),
(35, '+375(25)456-78-90', 'password_hash34', 'Петрова Ирина Николаевна', 'Мойщик', 'Работает', '0'),
(36, '+375(17)678-90-12', 'password_hash35', 'Зубова Анастасия Владимировна', 'Менеджер', 'Больничный', '0'),
(37, '+375(29)876-54-32', 'password_hash36', 'Смирнова Наталья Петровна', 'Оператор', 'Отпуск', '0'),
(38, '+375(33)345-67-89', 'password_hash37', 'Шмидт Татьяна Борисовна', 'Мойщик', 'Работает', '0'),
(57, '+375(29)000-00-00', '$2y$10$ioB4CqCe9uP9iF4kkh3MEe9zMzsnrE/PEkVP0EMVUtWZ4Y4kAD0pu', '123', '123', '123', '0');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `CarHistory`
--
ALTER TABLE `CarHistory`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `CarQueue`
--
ALTER TABLE `CarQueue`
  ADD PRIMARY KEY (`NumberCar`);

--
-- Индексы таблицы `CarWashServices`
--
ALTER TABLE `CarWashServices`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `CarWashServicesQueue`
--
ALTER TABLE `CarWashServicesQueue`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `CarHistory`
--
ALTER TABLE `CarHistory`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT для таблицы `CarWashServices`
--
ALTER TABLE `CarWashServices`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `Clients`
--
ALTER TABLE `Clients`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT для таблицы `Employees`
--
ALTER TABLE `Employees`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
