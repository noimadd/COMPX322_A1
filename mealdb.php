<?php
    $api_url = 'https://www.themealdb.com/api/json/v1/1/';

    function getCategoryData($category) {
        global $api_url;

        $url = $api_url . 'filter.php?c=' . ($category);
        $json = file_get_contents($url);
        if ($json === false) {
            die('Error fetching data from API');
        }

        return $json;
    }


    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'getCategoryData':
            $category = $_GET['category'] ?? '';
            if ($category) {
                echo getCategoryData($category);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Category parameter is required'
                ]);
            }
            break;
        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
    }
?>