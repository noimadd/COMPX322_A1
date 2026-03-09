document.addEventListener('DOMContentLoaded', async function() {
    const category_container = document.getElementById('categories');

    let menu_categories = [];

    category_container.addEventListener('click', async function(e) {
        const clicked_item = e.target.closest('.category-item');

        if (!clicked_item) return;

        let menu_category = menu_categories.find(category => category.name === clicked_item.textContent);
        menu_category.selected = menu_category.selected === '1' ? '0' : '1';

        const response = await fetch('functions.php?action=updateSelection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: menu_category.id,
                selected: menu_category.selected
            })
        });

        // toggles the 'selected' class on the clicked category item
        clicked_item.classList.toggle('selected');
    });

    // asynchronously fetches menu categories from db and displays them
    try {
        const response = await fetch('functions.php?action=getMenuCategories');
        const result = await response.json();

        category_container.innerHTML = '';

        // if success returns false -> error 
        if (!result.success) {
            category_container.innerHTML = '<p>Error loading categories.</p>';
            return;
        }

        let i = 0;

        // displays each category
        result.categories.forEach(category => {
            const element = document.createElement('div');
            element.classList.add('category-item');

            element.textContent = category.strCategory;
            category_container.appendChild(element);

            if (category.selected === '1') {
                element.classList.add('selected');
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
});