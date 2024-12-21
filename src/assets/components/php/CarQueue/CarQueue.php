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
    
            $sql = "UPDATE CarQueue SET NumberCar=?, CarBrand=?, CarModel=?, CarColor=?, ClientsID=?, AcceptanceDate=?, Services=?, Price=?, ExecutionTime=? status=? WHERE ID=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssisidisi", $numberCar, $carBrand, $carModel, $carColor, $clientsID, $acceptanceDate, $services, $price, $executionTime, $status, $id);
    
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
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'dolmatovich.nikita@mail.ru';
        $mail->Password = 'dYSB0W7rC1XN1zqAtL98';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('dolmatovich.nikita@mail.ru', 'Автомойка Car Wash');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;

        $body = "
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #2a9d8f;
                    font-size: 24px;
                }
                p {
                    color: #333333;
                    font-size: 16px;
                    line-height: 1.5;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #888888;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>{$subject}</h1>
                <p>{$body}</p>
            </div>
            <div class='footer'>
                <p>С уважением, <br>Автомойка Car Wash</p>
            </div>
        </body>
        </html>";

        $mail->Body = $body;

        $mail->CharSet = 'UTF-8';

        $mail->send();
    } catch (Exception $e) {
        error_log("Email не отправлено: {$mail->ErrorInfo}");
    }
}

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
        sendEmail($clientEmail, 'Заказ принят', 'Ваш заказ принят в обработку.');
        echo json_encode(['status' => 'success', 'email' => $clientEmail]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка принятия заказа']);
    }
    $stmt->close();
}

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

    $sql = "INSERT INTO CarHistory (NumberCar, CarBrand, CarModel, CarColor, ClientsID, AcceptanceDate, Services, Price) 
            SELECT NumberCar, CarBrand, CarModel, CarColor, ClientsID, AcceptanceDate, Services, Price 
            FROM CarQueue WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $deleteSql = "DELETE FROM CarQueue WHERE ID = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->bind_param("i", $id);
        $deleteStmt->execute();

        sendEmail($clientEmail, 'Заказ завершен', 'Ваш заказ выполнен.');
        echo json_encode(['status' => 'success', 'email' => $clientEmail]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка завершения заказа']);
    }
    $stmt->close();
}

function getClientEmail($conn, $id) {
    $sqlClientEmail = "SELECT ClientsID FROM CarQueue WHERE ID = ?";
    $stmtClientEmail = $conn->prepare($sqlClientEmail);
    $stmtClientEmail->bind_param("i", $id);
    $stmtClientEmail->execute();
    $result = $stmtClientEmail->get_result();

    if ($row = $result->fetch_assoc()) {
        $clientsID = $row['ClientsID'];

        $sqlEmail = "SELECT Email FROM Clients WHERE ID = ?";
        $stmtEmail = $conn->prepare($sqlEmail);
        $stmtEmail->bind_param("i", $clientsID);
        $stmtEmail->execute();
        $emailResult = $stmtEmail->get_result();

        if ($emailRow = $emailResult->fetch_assoc()) {
            return $emailRow['Email'];
        }
    }

    return null;
}

$conn->close();
?>
