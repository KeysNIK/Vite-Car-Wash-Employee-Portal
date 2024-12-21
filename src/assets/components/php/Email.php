use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Если используете Composer

function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@mail.ru';
        $mail->Password = 'your-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('your-email@mail.ru', 'Автомойка');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        error_log("Email не отправлено: {$mail->ErrorInfo}");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;

    if ($action === 'accept') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
            exit();
        }

        $sql = "UPDATE CarQueue SET status = 'accepted' WHERE ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            sendEmail('client-email@example.com', 'Заказ принят', 'Ваш заказ принят в обработку.');
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Ошибка принятия заказа']);
        }
        $stmt->close();
    } elseif ($action === 'complete') {
        $id = $_POST['id'] ?? null;

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID не указан']);
            exit();
        }

        $sql = "INSERT INTO OrderHistory SELECT * FROM CarQueue WHERE ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $deleteSql = "DELETE FROM CarQueue WHERE ID = ?";
            $deleteStmt = $conn->prepare($deleteSql);
            $deleteStmt->bind_param("i", $id);
            $deleteStmt->execute();
            sendEmail('client-email@example.com', 'Заказ завершен', 'Ваш заказ выполнен.');
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Ошибка завершения заказа']);
        }
        $stmt->close();
    }
}
