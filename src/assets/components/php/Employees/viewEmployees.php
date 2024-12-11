<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
    
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$conn = new mysqli("localhost", "username", "password", "database");

$servername = "localhost";
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

// Проверка подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получение параметров пагинации из запроса
$page = isset($_GET['page']) ? intval($_GET['page']) : 1; // Текущая страница
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20; // Количество записей на странице
$offset = ($page - 1) * $limit; // Смещение

// Запрос с лимитом и смещением
$sql = "SELECT * FROM Employees LIMIT ? OFFSET ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $limit, $offset);
$stmt->execute();

$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Подсчитываем общее количество записей (для информации о количестве страниц)
$totalResult = $conn->query("SELECT COUNT(*) as count FROM Employees");
$totalCount = $totalResult->fetch_assoc()['count'];

// Возвращаем данные в формате JSON
$response = [
    "data" => $data,
    "page" => $page,
    "total_pages" => ceil($totalCount / $limit),
    "total_count" => $totalCount
];
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>