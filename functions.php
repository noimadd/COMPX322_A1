<?php
    require_once 'db.php';

    header('Content-Type: application/json');

    // retrieves all data from the menuCategories table and returns it as a JSON
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

    function updateSelection($categoryId, $selected) {
        global $con;

        $query = "UPDATE menuCategories SET selected = ? WHERE idCategory = ?";
        $stmt = mysqli_prepare($con, $query);
        mysqli_stmt_bind_param($stmt, 'si', $selected, $categoryId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }


    // routes requests based off of the 'action' provided
    // creates an api endpooint type system for the frontend to call
    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'getMenuCategories':
            echo json_encode(getMenuCategories());
            break;
        case 'updateSelection':
            $data = json_decode(file_get_contents('php://input'), true);
            $categoryId = $data['categoryId'] ?? null;
            $selected = $data['selected'] ?? null;

            if ($categoryId === null || $selected === null) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                ]);
                break;
            }

            updateSelection($categoryId, $selected);
            echo json_encode([
                'success' => true
            ]);
            break;
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
            ]);
            break;
    }
?>