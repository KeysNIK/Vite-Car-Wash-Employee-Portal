<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$phone = $_POST['phone'] ?? null;
$userPassword = $_POST['password'] ?? null;

if (!$phone || !$userPassword) {
    echo json_encode(['status' => 'error', 'message' => 'Не указаны номер телефона или пароль']);
    exit();
}

$servername = "localhost";
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM Employees WHERE Login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($userPassword, $user['EmpPassword'])) {
        $accessCode = $user['AccessCode'];

        echo json_encode(['status' => 'success', 'accessCode' => $accessCode]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Неверный пароль']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Пользователь не найден']);
}



$stmt->close();
$conn->close();
?>
