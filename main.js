document.addEventListener('DOMContentLoaded', function() {
    const categoryContainer = document.getElementById('categories');

    fetch('functions.php?action=getMenuCategories')
    .then(response => response.json())
    .then(result => {
        categoryContainer.innerHTML = '';

        if (!result.success) {
            categoryContainer.innerHTML = '<p>Error loading categories.</p>';
            return;
        }

        console.log(result);

        result.categories.forEach(category => {
            const element = document.createElement('div');
            element.classList.add('category-item');

            element.textContent = category.strCategory;
            categoryContainer.appendChild(element);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
        categoryContainer.innerHTML = '<p>Error loading categories.</p>';
    });
});