var isOpen = false;
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation")
// Initialize the menu icon to show the hamburger initially
menuToggle.addEventListener("click", () => {
    menuToggle.innerHTML = !isOpen 
        ? `<i class="fa-solid fa-xmark"></i>` 
        : `<i class="fa-solid fa-bars"></i>`;
    isOpen = !isOpen;
    navigation.style.display = !isOpen 
    ? `none` 
    : `flex`;
});
