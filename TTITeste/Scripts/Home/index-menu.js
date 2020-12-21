$(function () {
    var menuCad = $("#mnu-cad");
    menuCad.addClass("menu-is-opening").addClass("menu-open");

    var menuCadHead = menuCad.find("#mnu-cad-head");
    menuCadHead.addClass("active");

    var menuCadProduto = menuCad.find("#mnu-cad-produto");
    menuCadProduto.addClass("active");
});