let sideMenuItemButtons = document.querySelectorAll(".sidebar__menuButton");

sideMenuItemButtons.forEach(function (sideMenuItem) {
    sideMenuItem.addEventListener("click", function() {
        let item = this.closest(".sidebar__menuItem"),
            subMenu = item.querySelectorAll(".sidebar__menuSub")[0],
            allSubMenu = document.querySelectorAll(".sidebar__menuSub");

        if (item.classList.contains("sidebar__menuItem--active")) {
            item.classList.remove("sidebar__menuItem--active");
            $(subMenu).slideUp();
        } else {
            $(".sidebar__menuItem").removeClass("sidebar__menuItem--active");
            item.classList.add("sidebar__menuItem--active");
            $(".sidebar__menuSub").slideUp();
            $(subMenu).slideDown();
        }
    })
})
