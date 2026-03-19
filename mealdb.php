<?php
    $recipes_url = 'https://www.themealdb.com/api/json/v1/1/'; // base url for recipes based on category
    $recipe_info_url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='; // base url for recipe info based on id

    // fetches all recipes for a given category
    // @param string $category - the category to fetch recipes for
    // @return string - the json response from the API
    function getCategoryData($category) {
        global $recipes_url;

        // retrieves content from API
        $url = $recipes_url . 'filter.php?c=' . ($category);
        $json = file_get_contents($url);
        if ($json === false) {
            die('Error fetching data from API');
        }

        return $json;
    }

    // fetches all recipe info for a given recipe id
    // @param int $id - the id of the recipe to fetch info for
    // @return string - the json response from the API
    function getRecipeInfo($id) {
        global $recipe_info_url;

        // retrieves content from API
        $url = $recipe_info_url . ($id);
        $json = file_get_contents($url);
        if ($json === false) {
            die('Error fetching data from API');
        }

        return $json;
    }


    // routes requests based off of the 'action' provided
    // creates an api endpooint type system for the frontend to call
    $action = $_GET['action'] ?? '';
    switch ($action) {
        // case for fetching recipes based on category
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
        // case for fetching recipe info based on id
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