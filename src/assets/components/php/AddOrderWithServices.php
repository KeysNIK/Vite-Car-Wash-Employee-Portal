<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

$servername = "localhost";
$username = "f1069235_car_wash";
$password = "Aa1111!!";
$dbname = "f1069235_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $clientEmail = $_POST['email'] ?? null;
    $numberCar = $_POST['numberCar'] ?? null;
    $carBrand = $_POST['carBrand'] ?? null;
    $carModel = $_POST['carModel'] ?? null;
    $carColor = $_POST['carColor'] ?? null;
    $acceptanceDate = $_POST['acceptanceDate'] ?? null;
    $services = json_decode($_POST['services'], true);

    if (!$clientEmail || !$numberCar || !$carBrand || !$carModel || !$carColor || !$acceptanceDate || empty($services)) {
        echo json_encode(['status' => 'error', 'message' => 'Недостаточно данных для добавления заказа']);
        exit();
    }

    $totalPrice = 0;
    $totalExecutionTime = 0;

    $sql = "SELECT ID FROM Clients WHERE Email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $clientEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    $client = $result->fetch_assoc();

    if (!$client) {
        echo json_encode(['status' => 'error', 'message' => 'Клиент не найден']);
        exit();
    }

    $clientID = $client['ID'];

    $orderSql = "INSERT INTO CarQueue (NumberCar, CarBrand, CarModel, CarColor, ClientsID, AcceptanceDate, Price, ExecutionTime, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $status = 'pending';

    $stmt = $conn->prepare($orderSql);
    $stmt->bind_param("ssssssdds", $numberCar, $carBrand, $carModel, $carColor, $clientID, $acceptanceDate, $totalPrice, $totalExecutionTime, $status);
    $stmt->execute();

    $orderID = $conn->insert_id;

    $updateServicesSql = "UPDATE CarQueue SET Services = ? WHERE ID = ?";
    $stmt = $conn->prepare($updateServicesSql);
    $stmt->bind_param("si", $orderID, $orderID);
    $stmt->execute();

    foreach ($services as $service) {
        $serviceName = $service['ServicesName'];
        $servicePrice = $service['Price'];
        $serviceTime = $service['ExecutionTime'];

        $serviceSql = "INSERT INTO CarWashServicesQueue (ID, ServicesName, Price, ExecutionTime) 
                       VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($serviceSql);
        $stmt->bind_param("issd", $orderID, $serviceName, $servicePrice, $serviceTime);
        $stmt->execute();

        $totalPrice += $servicePrice;
        $totalExecutionTime += $serviceTime;
    }

    $updateOrderSql = "UPDATE CarQueue SET Price = ?, ExecutionTime = ? WHERE ID = ?";
    $stmt = $conn->prepare($updateOrderSql);
    $stmt->bind_param("ddi", $totalPrice, $totalExecutionTime, $orderID);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Заказ успешно добавлен с услугами', 'orderID' => $orderID]);

    $stmt->close();
}

$conn->close();
?>
