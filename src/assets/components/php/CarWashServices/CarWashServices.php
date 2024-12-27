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

$servername = "localhost";
$username = "f1069235_car_wash";
$password = "Aa1111!!";
$dbname = "f1069235_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;

    if ($action === 'add') {
        $servicesName = $_POST['servicesName'] ?? null;
        $price = $_POST['price'] ?? null;
        $executionTime = $_POST['executionTime'] ?? null;

        if (!$servicesName || !$price || !$executionTime) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        $sql = "INSERT INTO CarWashServices (`ServicesName`, `Price`, `ExecutionTime`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdi", $servicesName, $price, $executionTime);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при добавлении']);
        }
        $stmt->close();

    } elseif ($action === 'edit') {
        $id = $_POST['id'] ?? null;
        $servicesName = $_POST['servicesName'] ?? null;
        $price = $_POST['price'] ?? null;
        $executionTime = $_POST['executionTime'] ?? null;

        if (!$servicesName || !$price || !$executionTime) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        $sql = "UPDATE CarWashServices SET ServicesName=?, Price=?, ExecutionTime=? WHERE ID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdii", $servicesName, $price, $executionTime, $id);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при редактировании']);
        }
        
        $stmt->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM CarWashServices WHERE (CAST(ID AS CHAR) LIKE ? OR ServicesName LIKE ? OR CAST(Price AS CHAR) LIKE ? OR CAST(ExecutionTime AS CHAR) LIKE ?) LIMIT ? OFFSET ?";
    $searchTerm = "%$search%";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssii", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit, $offset);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $countSql = "SELECT COUNT(*) as count FROM CarWashServices WHERE (CAST(ID AS CHAR) LIKE ? OR ServicesName LIKE ? OR CAST(Price AS CHAR) LIKE ? OR CAST(ExecutionTime AS CHAR) LIKE ?)";
    $countStmt = $conn->prepare($countSql);
    $countStmt->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalCount = $countResult->fetch_assoc()['count'];

    $response = [
        "data" => $data,
        "page" => $page,
        "total_pages" => ceil($totalCount / $limit),
        "total_count" => $totalCount
    ];

    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
        exit();
    }

    $sql = "DELETE FROM CarWashServices WHERE ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка удаления']);
    }
    $stmt->close();
}

$conn->close();
?>
