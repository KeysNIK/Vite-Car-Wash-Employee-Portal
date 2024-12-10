<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Обработка OPTIONS-запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Получаем данные из POST
$phone = $_POST['phone'] ?? null;
$userPassword = $_POST['password'] ?? null;

// Проверка, что данные переданы
if (!$phone || !$userPassword) {
    echo json_encode(['status' => 'error', 'message' => 'Не указаны номер телефона или пароль']);
    exit();
}

// Информация о бд для подключения
$servername = "localhost";
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

// Поделючение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL запрос для сравнения логина и пароля в бд
$sql = "SELECT * FROM Employees WHERE Login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

// Проверка полученого результата

if ($result->num_rows > 0) { // Есть ли строки отобраные по условию
    $user = $result->fetch_assoc();

    if (password_verify($userPassword, $user['EmpPassword'])) { // Проверка пароля по столбику бд с паролем
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Неверный пароль']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Пользователь не найден']);
}

// Закрытие подключения
$stmt->close();
$conn->close();
?>
