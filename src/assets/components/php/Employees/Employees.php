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
$username = "a1057091_car_wash";
$password = "Aa1111!!";
$dbname = "a1057091_car_wash";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;
    if ($action === 'add') {
        $login = $_POST['login'] ?? null;
        $password = $_POST['password'] ?? null;
        $fio = $_POST['fio'] ?? null;
        $position = $_POST['position'] ?? null;
        $statusEmployee = $_POST['statusEmployee'] ?? null;
        $accessCode = $_POST['accessCode'] ?? null;

        if (!$login || !$password || !$fio || !$position || !$statusEmployee) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        $hash_password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO Employees (`Login`, `EmpPassword`, `FIO`, `Position`, `StatusEmployee`, `AccessCode`) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssi", $login, $hash_password, $fio, $position, $statusEmployee, $accessCode);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при добавлении']);
        }
        $stmt->close();
    } elseif ($action === 'edit') {
        $id = $_POST['id'] ?? null;
        $login = $_POST['login'] ?? null;
        $password = $_POST['password'] ?? null;
        $fio = $_POST['fio'] ?? null;
        $position = $_POST['position'] ?? null;
        $statusEmployee = $_POST['statusEmployee'] ?? null;
        $accessCode = $_POST['accessCode'] ?? null;

        if (!$id || !$login || !$fio || !$position || !$statusEmployee) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        $hash_password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "UPDATE Employees SET Login=?, EmpPassword=?, FIO=?, Position=?, StatusEmployee=?, AccessCode=? WHERE ID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssi", $login, $hash_password, $fio, $position, $statusEmployee, $accessCode, $id);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при редактировании']);
        }
        $stmt->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM Employees LIMIT ? OFFSET ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $limit, $offset);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $totalResult = $conn->query("SELECT COUNT(*) as count FROM Employees");
    $totalCount = $totalResult->fetch_assoc()['count'];

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

    $sql = "DELETE FROM Employees WHERE ID=?";
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
