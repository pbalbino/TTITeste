$(function () {
    var menuCad = $("#mnu-cad");
    menuCad.addClass("menu-is-opening").addClass("menu-open");

    var menuCadHead = menuCad.find("#mnu-cad-head");
    menuCadHead.addClass("active");

    var menuCadCategoria = menuCad.find("#mnu-cad-catsub");
    menuCadCategoria.addClass("active");
});