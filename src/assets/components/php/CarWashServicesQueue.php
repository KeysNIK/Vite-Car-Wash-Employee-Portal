<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Ошибка подключения к базе данных']));
}

$clientID = $_GET['ID'] ?? null;

if (!$clientID) {
    echo json_encode(['status' => 'error', 'message' => 'clientID не передан']);
    exit();
}

$sql = "SELECT * FROM CarWashServicesQueue WHERE ID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $clientID);

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $services]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Услуги не найдены']);
}

$stmt->close();
$conn->close();
?>
