const category_container = document.getElementById('categories'); // bar of categories along the top
const recipe_select = document.getElementById('recipe-select'); // dropdown menu for selecting a category
const dropDown = document.getElementById('recipe-select'); // dropdown menu for selecting a category

let menu_categories = []; // json array of all category information
let recipe_item = ""; // all recipe items displayed based on category


// initialises event handlers and loads categories
async function init() {
    setupCategoryClickHandler(); // handles category selection and updates db
    await loadCategories(); // loads categories from db
    recipe_select.addEventListener('change', () => handleCategoryChange()); // handles category selection and loads recipes
}

// flips selected state upon clicking a category
function setupCategoryClickHandler() {
    category_container.addEventListener('click', async (e) => {
        const clicked_item = e.target.closest('.category-item'); // sets clicked item = to click category from top bar

        if (!clicked_item) return;

        // finds click category in array and flips selected
        let menu_category = menu_categories.find(category => category.name === clicked_item.textContent);
        menu_category.selected = menu_category.selected === '1' ? '0' : '1';

        // sends updated selection to server
        await fetch('queries.php?action=updateSelection', {
            method: 'POST',
            body: JSON.stringify({
                categoryId: menu_category.id,
                selected: menu_category.selected
            })
        });

        // toggles the 'selected' class on the clicked category item
        clicked_item.classList.toggle('selected');

        dropDown.innerHTML = '<option value="" disabled selected>Select a Category</option>';
        loadCategories();
    });
}

// asynchronously fetches menu categories from db and displays them
// all categories are displayed in category bar top screen
// selected categories are added to the dropdown menu 
async function loadCategories() {
    try {
        const response = await fetch('queries.php?action=getMenuCategories'); // fetches categories from db
        const result = await response.json(); // parses response as json

        category_container.innerHTML = '';

        // if success returns false -> error 
        if (!result.success) {
            category_container.innerHTML = '<p>Error loading categories.</p>';
            return;
        }

        let i = 0;

        // displays each category in the dropdown 
        result.categories.forEach(category => {
            const element = document.createElement('div'); // div for each category in the top bar
            element.classList.add('category-item');

            element.textContent = category.strCategory;
            category_container.appendChild(element);

            if (category.selected === '1') {
                element.classList.add('selected');

                dropDown.innerHTML += `<option value="${category.strCategory}">${category.strCategory}</option>`;
            }

            menu_categories[i] = {
                id: category.idCategory,
                name: category.strCategory,
                selected: category.selected
            };
            i++;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        category_container.innerHTML = '<p>Error loading categories.</p>';
    }
}

// handles category selection and loads recipes for a selected category
function handleCategoryChange() {
    const selected_category = recipe_select.value;

    if (!selected_category) return;

    loadRecipes(selected_category);
}

// asynchronously fetches recipes for a given category and displays them
// these are displayed as clickable cards on the left hand side
async function loadRecipes(category) {
    const response  = await fetch(`mealdb.php?action=getCategoryData&category=${(category)}`);
    const result = await response.json();
    const recipe_list = document.getElementById('recipe-list');
    recipe_list.innerHTML = '';

    if (!result.success) {
        recipe_list.innerHTML = '<p>Error loading recipes.</p>';
        return;
    }

    result.data.meals.forEach(element => {
        recipe_list.innerHTML += `
            <div class="recipe-item" data-recipe-id="${element.idMeal}">
                <div class="image-container">
                    <img src="${element.strMealThumb}/small" alt="${element.strMeal}">
                </div>
                    <p>${element.strMeal}</p>
                <br/>
            </div>
        `;

    });


    recipe_item = document.querySelectorAll('.recipe-item');

    // when a recipe is clicked fetch recipe info and display related information
    // this includes ingredients and instructions which are displayed on the right hand side
    recipe_item.forEach(item => {
        item.addEventListener('click', async (e) => {
            const clicked_item = e.target.closest('.recipe-item');

            if (!clicked_item) return;

            // adjusts styling to show selected recipe
            recipe_item.forEach(recipe => recipe.classList.remove('active'));
            clicked_item.classList.add('active');

            const recipe_id = clicked_item.getAttribute('data-recipe-id');

            const response = await fetch('mealdb.php?action=getRecipeInfo&id=' + recipe_id);
            const result = await response.json();

            // if success === false -> error
            if (!result.success) {
                const ingredients_list = document.getElementById('ingredients-list');
                ingredients_list.innerHTML = '<p>Error loading recipe info.</p>';
                return;
            }

            const ingredients_list = document.getElementById('ingredients-list');
            ingredients_list.innerHTML = '';

            // iterates through returned ingredients/measures and displays them 
            for (let i = 1; i <= 20; i++) {
                const ingredient = result.data.meals[0][`strIngredient${i}`];
                const measure = result.data.meals[0][`strMeasure${i}`];
                if (ingredient === "" || ingredient === null) {
                    break;
                }
                ingredients_list.innerHTML += `<li class="ingredient">${measure} ${ingredient}</li>`;
            }

            // displays the instructions
            const instructions = document.getElementById('instructions-text');
            instructions.textContent = result.data.meals[0].strInstructions;
        });
    });
}


// initialises app once page had loaded
document.addEventListener('DOMContentLoaded', init);