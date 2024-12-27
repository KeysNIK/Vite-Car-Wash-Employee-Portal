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
        $numberCar = $_POST['numberCar'] ?? null;
        $carBrand = $_POST['carBrand'] ?? null;
        $carModel = $_POST['carModel'] ?? null;
        $carColor = $_POST['carColor'] ?? null;
        $clientsID = $_POST['clientsID'] ?? null;
        $acceptanceDate = $_POST['acceptanceDate'] ?? null;
        $services = $_POST['services'] ?? null;
        $price = $_POST['price'] ?? null;
        $executionTime = $_POST['executionTime'] ?? null;
        $status = "pending";

        if (!$numberCar || !$carBrand || !$carModel || !$carColor || !$clientsID || !$acceptanceDate || !$services || !$price || !$executionTime) {
            echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
            exit();
        }

        $sql = "INSERT INTO CarQueue (`NumberCar`, `CarBrand`, `CarModel`, `CarColor`, `ClientsID`, `AcceptanceDate`, `Services`, `Price`, `ExecutionTime`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssisidis", $numberCar, $carBrand, $carModel, $carColor, $clientsID, $acceptanceDate, $services, $price, $executionTime, $status);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при добавлении']);
        }
        $stmt->close();


    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($action === 'edit') {
            $id = $_POST['id'] ?? null;
            $numberCar = $_POST['numberCar'] ?? null;
            $carBrand = $_POST['carBrand'] ?? null;
            $carModel = $_POST['carModel'] ?? null;
            $carColor = $_POST['carColor'] ?? null;
            $clientsID = $_POST['clientsID'] ?? null;
            $acceptanceDate = $_POST['acceptanceDate'] ?? null;
            $services = $_POST['services'] ?? null;
            $price = $_POST['price'] ?? null;
            $executionTime = $_POST['executionTime'] ?? null;
            $status = "pending";
    
            if (!$numberCar || !$carBrand || !$carModel || !$carColor || !$clientsID || !$acceptanceDate || !$services || !$price || !$executionTime) {
                echo json_encode(['status' => 'error', 'message' => 'Некоторые поля не указаны']);
                exit();
            }
    
            $sql = "UPDATE CarQueue SET NumberCar=?, CarBrand=?, CarModel=?, CarColor=?, ClientsID=?, AcceptanceDate=?, Services=?, Price=?, ExecutionTime=? WHERE ID=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssisidii", $numberCar, $carBrand, $carModel, $carColor, $clientsID, $acceptanceDate, $services, $price, $executionTime, $id);
    
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Произошла ошибка при редактировании']);
            }
            $stmt->close();
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM CarQueue WHERE 
            (CAST(ID AS CHAR) LIKE ? OR
            CAST(NumberCar AS CHAR) LIKE ? 
            OR CarBrand LIKE ? 
            OR CarModel LIKE ? 
            OR CarColor LIKE ? 
            OR CAST(ClientsID AS CHAR) LIKE ? 
            OR CAST(AcceptanceDate AS CHAR) LIKE ? 
            OR CAST(Services AS CHAR) LIKE ? 
            OR CAST(Price AS CHAR) LIKE ?
            OR CAST(ExecutionTime AS CHAR) LIKE ?
            OR status LIKE ?)
            LIMIT ? 
            OFFSET ?";
    $searchTerm = "%$search%";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssii",$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit, $offset);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $countSql = "SELECT COUNT(*) as count FROM CarQueue WHERE (CAST(ID AS CHAR) LIKE ? OR CAST(NumberCar AS CHAR) LIKE ? OR CarBrand LIKE ? OR CarModel LIKE ? OR CarColor LIKE ? OR CAST(ClientsID AS CHAR) LIKE ? OR CAST(AcceptanceDate AS CHAR) LIKE ? OR Services LIKE ? OR CAST(Price AS CHAR) LIKE ? OR CAST(ExecutionTime AS CHAR) LIKE ? OR status LIKE ?)";
    $countStmt = $conn->prepare($countSql);
    $countStmt->bind_param("sssssssssss",$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
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

    $sql = "DELETE FROM CarQueue WHERE ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка удаления']);
    }
    $stmt->close();
}
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);
    try {
        // Настройка SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'dolmatovich.nikita@mail.ru'; // Ваш email
        $mail->Password = 'dYSB0W7rC1XN1zqAtL98'; // Ваш пароль
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Настройка отправителя и получателя
        $mail->setFrom('dolmatovich.nikita@mail.ru', 'Автомойка Car Wash');
        $mail->addAddress($to);

        // Установка кодировки UTF-8
        $mail->CharSet = 'UTF-8';

        // Установка темы письма
        $mail->Subject = $subject;

        // Оформление HTML тела письма
        $mail->isHTML(true);
        $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif; color: #333;'>
            <table cellpadding='10' cellspacing='0' width='100%' style='max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px;'>
                <tr>
                    <td style='background-color: #4CAF50; color: #fff; text-align: center; border-radius: 8px 8px 0 0;'>
                        <h2>{$subject}</h2>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;'>
                        <p>{$body}</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>";

        // Отправка письма
        $mail->send();
    } catch (Exception $e) {
        error_log("Email не отправлено: {$mail->ErrorInfo}");
    }
}


// Обработка запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;

    if ($action === 'accept') {
        handleAccept($conn);
    } elseif ($action === 'complete') {
        handleComplete($conn);
    }
}

function handleAccept($conn) {
    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
        exit();
    }

    $clientEmail = getClientEmail($conn, $id);
    if (!$clientEmail) {
        echo json_encode(['status' => 'error', 'message' => 'Email клиента не найден']);
        exit();
    }

    $sql = "UPDATE CarQueue SET status = 'accepted' WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        sendEmail($clientEmail, 'Заказ принят', 'Ваш заказ принят в обработку. Мы скоро начнем работу над ним!');
        echo json_encode(['status' => 'success', 'email' => $clientEmail]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка принятия заказа']);
    }
    $stmt->close();
}

// Функция обработки завершения заказа
function handleComplete($conn) {
    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
        exit();
    }

    $clientEmail = getClientEmail($conn, $id);
    if (!$clientEmail) {
        echo json_encode(['status' => 'error', 'message' => 'Email клиента не найден']);
        exit();
    }

    // Получение деталей заказа для чека
    $orderDetails = getOrderDetails($conn, $id);
    if (!$orderDetails) {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось получить данные заказа']);
        exit();
    }

    // Получаем связанные услуги из CarWashServicesQueue
    $services = getServicesForOrder($conn, $id);
    if (!$services) {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось получить услуги для заказа']);
        exit();
    }

    // Сохраняем заказ в историю
    $sql = "INSERT INTO CarHistory (NumberCar, CarBrand, CarModel, CarColor, ClientsID, AcceptanceDate, Services, Price) 
            SELECT NumberCar, CarBrand, CarModel, CarColor, ClientsID, AcceptanceDate, Services, Price 
            FROM CarQueue WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Удаляем заказ из очереди
        $deleteSql = "DELETE FROM CarQueue WHERE ID = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->bind_param("i", $id);
        $deleteStmt->execute();

        // Отправляем email с уведомлением
        sendEmail($clientEmail, 'Заказ завершен', 'Ваш заказ выполнен. Спасибо, что воспользовались нашими услугами.');

        // Отправляем чек на оплату
        sendInvoiceEmail($clientEmail, $orderDetails, $services);

        echo json_encode(['status' => 'success', 'email' => $clientEmail]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка завершения заказа']);
    }
    $stmt->close();
}

// Функция для получения услуг, связанных с заказом
function getServicesForOrder($conn, $orderId) {
    $sql = "SELECT * FROM CarWashServicesQueue WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();

    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }

    return $services;
}


// Получение деталей заказа по ID
function getOrderDetails($conn, $id) {
    $sql = "SELECT NumberCar, CarBrand, CarModel, CarColor, Services, Price, AcceptanceDate, ExecutionTime 
            FROM CarQueue WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row;
    }
    
    // Debugging output
    error_log('No order details found for ID: ' . $id);
    return null;
}



function getClientEmail($conn, $id) {
    // Получаем ClientsID из CarQueue
    $sqlClientEmail = "SELECT ClientsID FROM CarQueue WHERE ID = ?";
    $stmtClientEmail = $conn->prepare($sqlClientEmail);
    $stmtClientEmail->bind_param("i", $id);
    $stmtClientEmail->execute();
    $result = $stmtClientEmail->get_result();

    if ($row = $result->fetch_assoc()) {
        $clientsID = $row['ClientsID'];

        // Логирование ClientsID

        // Получаем email клиента из таблицы Clients
        $sqlEmail = "SELECT Email FROM Clients WHERE ID = ?";
        $stmtEmail = $conn->prepare($sqlEmail);
        $stmtEmail->bind_param("i", $clientsID);
        $stmtEmail->execute();
        $emailResult = $stmtEmail->get_result();

        if ($emailRow = $emailResult->fetch_assoc()) {
            // Логируем найденный email
            return $emailRow['Email'];
        } else {
            // Если email не найден
        }
    } else {

    }

    return null;
}



function sendInvoiceEmail($to, $orderDetails, $services) {
    if (empty($orderDetails)) {
        error_log('Order details are empty!');
        return;
    }

    $subject = 'Ваш чек на оплату заказа';
    $body = "
    <html>
    <body style='font-family: Arial, sans-serif; color: #333;'>
        <table cellpadding='10' cellspacing='0' width='100%' style='max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px;'>
            <tr>
                <td style='background-color: #FF9800; color: #fff; text-align: center; border-radius: 8px 8px 0 0;'>
                    <h2>Чек на оплату</h2>
                </td>
            </tr>
            <tr>
                <td style='padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;'>
                    <h3>Детали вашего заказа</h3>
                    <p><strong>Номер машины:</strong> " . ($orderDetails['NumberCar'] ?? 'N/A') . "</p>
                    <p><strong>Марка:</strong> " . ($orderDetails['CarBrand'] ?? 'N/A') . "</p>
                    <p><strong>Модель:</strong> " . ($orderDetails['CarModel'] ?? 'N/A') . "</p>
                    <p><strong>Цвет:</strong> " . ($orderDetails['CarColor'] ?? 'N/A') . "</p>
                    <p><strong>Услуги:</strong></p>
                    <ul>";

    foreach ($services as $service) {
        $body .= "<li><strong>Услуга:</strong> " . ($service['ServicesName'] ?? 'N/A') . " - " . ($service['Price'] ?? 'N/A') . " руб.</li>";
    }

    $body .= "</ul>
                    <p><strong>Дата принятия:</strong> " . ($orderDetails['AcceptanceDate'] ?? 'N/A') . "</p>
                    <p><strong>Время выполнения:</strong> " . ($orderDetails['ExecutionTime'] ?? 'N/A') . "</p>
                    <p><strong>Цена:</strong> " . ($orderDetails['Price'] ?? 'N/A') . " руб.</p>
                    <p><strong>Статус:</strong> Завершен</p>
                    <br>
                    <p>Спасибо за использование наших услуг!</p>
                </td>
            </tr>
        </table>
    </body>
    </html>";

    sendEmail($to, $subject, $body);
}




$conn->close();
?>
