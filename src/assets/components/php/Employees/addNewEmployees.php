<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
    
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$login = $_POST['login'] ?? null;
$password = $_POST['password'] ?? null;
$fio = $_POST['fio'] ?? null;ы
$position = $_POST['position'] ?? null;
$statusEmployee = $_POST['statusEmployee'] ?? null;
$accessCode = $_POST['accessCode'] ?? null;

if (!$login || !$password || !$fio || !$position || !$statusEmployee || !$accessCode) {
    echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны или были утеряны']);
    exit();
}

$servername = "localhost";
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed:" . $conn->connect_error);
}

$hash_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO Employees (`Login`, `EmpPassword`, `FIO`, `Position`, `StatusEmployee`, `AccessCode`) VALUES (?,?,?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $login, $password, $fio, $position, $statusEmployee, $accessCode);
if ($stmt->execute()) {
    echo json_encode('status' => 'success');
} else {
    echo json_encode('status' => 'error', 'message' => 'Произошла ошибка: ' . $stmt->insert_id);
}

$stmt->close();
$conn->close();
?>  