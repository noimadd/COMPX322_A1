<?php
    require_once 'db.php';

    header('Content-Type: application/json');

    function getMenuCategories() {
        global $con;
        $query = "SELECT * FROM menuCategories";
        $result = mysqli_query($con, $query);

        if (!$result) {
            die('Error executing query: ' . mysqli_error($con));
        }

        $categories = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $categories[] = $row;
        }

        return [
            'success' => true,
            'categories' => $categories
        ];
    }

    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'getMenuCategories':
            echo json_encode(getMenuCategories());
            break;
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
            break;
    }
?>