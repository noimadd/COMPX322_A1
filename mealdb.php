<?php
    $recipes_url = 'https://www.themealdb.com/api/json/v1/1/';
    $recipe_info_url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

    function getCategoryData($category) {
        global $recipes_url;

        $url = $recipes_url . 'filter.php?c=' . ($category);
        $json = file_get_contents($url);
        if ($json === false) {
            die('Error fetching data from API');
        }

        return $json;
    }

    function getRecipeInfo($id) {
        global $recipe_info_url;

        $url = $recipe_info_url . ($id);
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
        case 'getRecipeInfo':
            $id = $_GET['id'] ?? '';
            if ($id) {
                echo getRecipeInfo($id);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'ID parameter is required'
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