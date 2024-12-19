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

// Создаем подключение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем подключение
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Обработка POST-запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;

    if ($action === 'add') {
        // Получаем данные для добавления клиента
        $fio = $_POST['fio'] ?? null;
        $email = $_POST['email'] ?? null;
        $countVisits = $_POST['countVisits'] ?? null;
        $clientDiscount = $_POST['clientDiscount'] ?? null;

        // Проверка, что все данные переданы
        if (!$fio || !$email || !$countVisits || !$clientDiscount) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        // SQL запрос для добавления клиента
        $sql = "INSERT INTO Clients (`FIO`, `Email`, `CountVisits`, `ClientDiscount`) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssii", $fio, $email, $countVisits, $clientDiscount);

        // Выполнение запроса
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при добавлении']);
        }
        $stmt->close();

    } elseif ($action === 'edit') {
        // Получаем данные для редактирования клиента
        $id = $_POST['id'] ?? null;
        $fio = $_POST['fio'] ?? null;
        $email = $_POST['email'] ?? null;
        $countVisits = $_POST['countVisits'] ?? null;
        $clientDiscount = $_POST['clientDiscount'] ?? null;

        // Проверка, что все данные переданы
        if (!$fio || !$email || !$countVisits || !$clientDiscount) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        // SQL запрос для редактирования клиента
        $sql = "UPDATE Clients SET FIO=?, Email=?, CountVisits=?, ClientDiscount=? WHERE ID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssiii", $fio, $email, $countVisits, $clientDiscount, $id);

        // Выполнение запроса
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при редактировании']);
        }
        $stmt->close();
    }
}

// Обработка GET-запросов
// Обработка GET-запросов
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получаем параметры для поиска и пагинации
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM Clients WHERE (ID = ? OR FIO LIKE ? OR Email LIKE ? OR CountVisits = ? OR ClientDiscount = ?) LIMIT ? OFFSET ?";

    $searchTerm = "%$search%";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("issiiii", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $search, $limit, $offset);
    $stmt->execute();

    // Получаем результаты запроса
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Получаем общее количество записей для пагинации
    $countSql = "SELECT COUNT(*) as count FROM Clients WHERE (FIO LIKE ? OR Email LIKE ? OR CountVisits LIKE ? OR ClientDiscount LIKE ?)";
    $countStmt = $conn->prepare($countSql);
    $countStmt->bind_param("sssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalCount = $countResult->fetch_assoc()['count'];

    // Формируем ответ
    $response = [
        "data" => $data,
        "page" => $page,
        "total_pages" => ceil($totalCount / $limit),
        "total_count" => $totalCount
    ];

    echo json_encode($response);
}


// Обработка DELETE-запросов
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
        exit();
    }

    // SQL запрос для удаления клиента
    $sql = "DELETE FROM Clients WHERE ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка удаления']);
    }
    $stmt->close();
}

// Закрытие соединения с базой данных
$conn->close();
?>
