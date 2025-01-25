const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById("menu-container");
    const addMenuItemForm = document.getElementById("addMenuItemForm");
    const addMenuItemMessage = document.getElementById("addMenuItemMessage");

    // Fetch and display menu items
    async function fetchMenu() {
        try {
            const response = await fetch(`${baseUrl}/api/menu`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const menuItems = await response.json();

            menuItems.forEach(item => {
                const menuItemElement = document.createElement("div");
                menuItemElement.classList.add("menu-item");

                menuItemElement.innerHTML = `
                    <img src="${item.imageUrl || 'placeholder.jpg'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p><strong>$${item.price.toFixed(2)}</strong></p>
                `;

                menuContainer.appendChild(menuItemElement);
            });
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    }

    // Handle adding a new menu item with an image
    addMenuItemForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addMenuItemForm);

        try {
            const response = await fetch(`${baseUrl}/api/menu/add`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const addedMenuItem = await response.json();
                addMenuItemMessage.textContent = `Menu item "${addedMenuItem.name}" added successfully!`;
                addMenuItemMessage.style.color = "green";
                fetchMenu(); // Refresh menu
            } else {
                throw new Error("Failed to add menu item");
            }
        } catch (error) {
            console.error("Error adding menu item:", error);
            addMenuItemMessage.textContent = error.message;
            addMenuItemMessage.style.color = "red";
        }
    });

    // Initialize
    fetchMenu();
});
