// #region Fields

var btnCategoriaAdicionar = $("#categoria-adicionar");
var gridCategoria = $("#categoria-grid");

var btnSubCategoriaAdicionar = $("#subcategoria-adicionar");
var gridSubCategoria = $("#subcategoria-grid");

var dialogCategoriaSubCategoria = $("#catsub-dialog");
var txtCatSubDialogTipoCadastro = $("#catsub-dialog-tipocadastro");
var txtCatSubDialogId = $("#catsub-dialog-id");
var txtCatSubDialogNome = $("#catsub-dialog-nome");
var btnCatSubDialogCancelar = $("#catsub-dialogo-cancelar");
var btnCatSubDialogSalvar = $("#catsub-dialogo-salvar");

const TipoCadastroEnum = Object.freeze({ "Categoria": 1, "SubCategoria": 2 });

// #endregion

$(document).ready(onConfigControlsCategoriaSubCategoria());

function onConfigControlsCategoriaSubCategoria() {

    onConfigGridCategoria();
    onConfigGridSubCategoria();
    onConfigDialogCatSub();

    btnCategoriaAdicionar.on("click", function () {
        onCatSubAdicionar(TipoCadastroEnum.Categoria);
    })

    btnSubCategoriaAdicionar.on("click", function () {
        onCatSubAdicionar(TipoCadastroEnum.SubCategoria);
    })

}

// #region Categoria

function onConfigGridCategoria() {

    gridCategoria.grid({
        primaryKey: "ID",
        inlineEditing: { mode: "command", managementColumn: false },
        dataSource: {
            url: $urlCategoriaGet,
            success: function (response) {
                if (response.msg) {
                    onAlertInfo(response.msg);
                }
                if (response.error) {
                    onAlertError(response.error);
                }
                gridCategoria.render(response);
            },
            error: function (response) {
                if (response.error) {
                    onAlertError(response.error);
                }
            }
        },
        uiLibrary: "bootstrap4",
        locale: "pt-br",
        bodyRowHeight: "fixed",
        headerRowHeight: "fixed",
        columns: [
            { field: "Nome", title: "Nome", width: "100%", editor: true, sortable: true },
            { width: 90, align: "center", renderer: onGridCategoriaOptionsRenderer }
        ],
        pager: { limit: 10 }
    });

    gridCategoria.on('rowDataChanged', function (e, id, record) {
        var form = $("#__AjaxAntiForgeryCatSub");
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax({
            url: $urlCatSubSave,
            type: "POST",
            data: {
                __RequestVerificationToken: token,
                tipoCadastro: TipoCadastroEnum.Categoria,
                id: record.ID,
                nome: record.Nome
            },
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            success: function (resultServer) {
                if (!resultServer.result) {
                    onAlertError(resultServer.msg);
                } else {
                    gridCategoria.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                onAlertError(xhr.responseText);
            }
        });
    });

}

function onGridCategoriaOptionsRenderer(value, record, $cell, $displayEl, id, $grid) {

    var $editar = $('<button class="btn btn-success btn-xs" style="width: 27px" title="Editar"><i class="fas fa-pencil-alt"></i></button>').attr("data-id", id);
    var $excluir = $('<button class="btn btn-danger btn-xs gj-margin-left-10" style="width: 27px" title="Excluir"><i class="fas fa-trash"></i></button>').attr("data-id", id);
    var $atualizar = $('<button class="btn btn-primary btn-xs" style="width: 27px" title="Salvar"><i class="fas fa-check"></i></button>').attr("data-id", id).hide();
    var $cancelar = $('<button class="btn btn-danger btn-xs gj-margin-left-10" style="width: 27px" title="Cancelar"><i class="fas fa-ban"></i></button>').attr("data-id", id).hide();

    $editar.on("click", function () {
        $grid.edit($(this).data("id"));
        $editar.hide();
        $excluir.hide();
        $atualizar.show();
        $cancelar.show();
    });

    $excluir.on("click",
        function () {
            event.preventDefault();
            var id = $(this).data("id");
            $.confirm({
                icon: "fas fa-trash",
                title: "Exclusão de Categoria",
                content: "Deseja realmente excluir a categoria selecionada?",
                buttons: {
                    Sim: {
                        action: function () {
                            onCatSubDelete(TipoCadastroEnum.Categoria, id);
                        }
                    },
                    Não: {}
                }
            });
        });

    $atualizar.on('click', function () {
        $grid.update($(this).data("id"));
        $editar.show();
        $excluir.show();
        $atualizar.hide();
        $cancelar.hide();
    });

    $cancelar.on('click', function () {
        $grid.cancel($(this).data("id"));
        $editar.show();
        $excluir.show();
        $atualizar.hide();
        $cancelar.hide();
    });

    $displayEl.empty().append($editar).append($excluir).append($atualizar).append($cancelar);

}

// #endregion

// #region SubCategoria

function onConfigGridSubCategoria() {

    gridSubCategoria.grid({
        primaryKey: "ID",
        inlineEditing: { mode: "command", managementColumn: false },
        dataSource: {
            url: $urlSubCategoriaGet,
            success: function (response) {
                if (response.msg) {
                    onAlertInfo(response.msg);
                }
                if (response.error) {
                    onAlertError(response.error);
                }
                gridSubCategoria.render(response);
            },
            error: function (response) {
                if (response.error) {
                    onAlertError(response.error);
                }
            }
        },
        uiLibrary: "bootstrap4",
        locale: "pt-br",
        bodyRowHeight: "fixed",
        headerRowHeight: "fixed",
        columns: [
            { field: "Nome", title: "Nome", width: "100%", editor: true, sortable: true },
            { width: 90, align: "center", renderer: onGridSubCategoriaOptionsRenderer }
        ],
        pager: { limit: 10 }
    });

    gridSubCategoria.on('rowDataChanged', function (e, id, record) {
        var form = $("#__AjaxAntiForgeryCatSub");
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax({
            url: $urlCatSubSave,
            type: "POST",
            data: {
                __RequestVerificationToken: token,
                tipoCadastro: TipoCadastroEnum.SubCategoria,
                id: record.ID,
                nome: record.Nome
            },
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            success: function (resultServer) {
                if (!resultServer.result) {
                    onAlertError(resultServer.msg);
                } else {
                    gridSubCategoria.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                onAlertError(xhr.responseText);
            }
        });
    });

}

function onGridSubCategoriaOptionsRenderer(value, record, $cell, $displayEl, id, $grid) {

    var $editar = $('<button class="btn btn-success btn-xs" style="width: 27px" title="Editar"><i class="fas fa-pencil-alt"></i></button>').attr("data-id", id);
    var $excluir = $('<button class="btn btn-danger btn-xs gj-margin-left-10" style="width: 27px" title="Excluir"><i class="fas fa-trash"></i></button>').attr("data-id", id);
    var $atualizar = $('<button class="btn btn-primary btn-xs" style="width: 27px" title="Salvar"><i class="fas fa-check"></i></button>').attr("data-id", id).hide();
    var $cancelar = $('<button class="btn btn-danger btn-xs gj-margin-left-10" style="width: 27px" title="Cancelar"><i class="fas fa-ban"></i></button>').attr("data-id", id).hide();

    $editar.on("click", function () {
        $grid.edit($(this).data("id"));
        $editar.hide();
        $excluir.hide();
        $atualizar.show();
        $cancelar.show();
    });

    $excluir.on("click",
        function () {
            event.preventDefault();
            var id = $(this).data("id");
            $.confirm({
                icon: "fas fa-trash",
                title: "Exclusão de SubCategoria",
                content: "Deseja realmente excluir a SubCategoria selecionada?",
                buttons: {
                    Sim: {
                        action: function () {
                            onCatSubDelete(TipoCadastroEnum.SubCategoria, id);
                        }
                    },
                    Não: {}
                }
            });
        });

    $atualizar.on('click', function () {
        $grid.update($(this).data("id"));
        $editar.show();
        $excluir.show();
        $atualizar.hide();
        $cancelar.hide();
    });

    $cancelar.on('click', function () {
        $grid.cancel($(this).data("id"));
        $editar.show();
        $excluir.show();
        $atualizar.hide();
        $cancelar.hide();
    });

    $displayEl.empty().append($editar).append($excluir).append($atualizar).append($cancelar);

}

// #endregion

// #region Comum

function onCatSubAdicionar(tipCadastroEnum) {

    txtCatSubDialogTipoCadastro.val(tipCadastroEnum);
    txtCatSubDialogId.val(0);
    txtCatSubDialogNome.val("");
    dialogCategoriaSubCategoria.open("Adicionar " + (tipCadastroEnum == TipoCadastroEnum.Categoria ? "Categoria" : "SubCategoria"));

}

function onCatSubSalvar() {

    var form = $("#__AjaxAntiForgeryCatSub");
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: $urlCatSubSave,
        type: "POST",
        data: {
            __RequestVerificationToken: token,
            tipoCadastro: txtCatSubDialogTipoCadastro.val(),
            id: txtCatSubDialogId.val(),
            nome: txtCatSubDialogNome.val()
        },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (resultServer) {
            if (!resultServer.result) {
                onAlertError(resultServer.msg);
            } else {
                dialogCategoriaSubCategoria.close();
                if (txtCatSubDialogTipoCadastro.val() == TipoCadastroEnum.Categoria) {
                    gridCategoria.reload();
                } else {
                    gridSubCategoria.reload();
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            onAlertError(xhr.responseText);
        }
    });

}

function onCatSubDelete(tipoCadastro, id) {

    var form = $("#__AjaxAntiForgeryCatSub");
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: $urlCatSubDelete,
        type: "POST",
        data: {
            __RequestVerificationToken: token,
            tipoCadastro: tipoCadastro,
            id: id
        },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (resultServer) {
            if (resultServer.result) {
                if (resultServer.msg) {
                    onAlertInfo(resultServer.msg);
                }
                if (tipoCadastro == TipoCadastroEnum.Categoria) {
                    gridCategoria.reload();
                } else {
                    gridSubCategoria.reload();
                }
            } else {
                if (resultServer.msg) {
                    onAlertError(resultServer.msg);
                }
            }
        },
        error: function () {
            onAlertError("Não foi possível excluir o registro.");
        }
    });

}

// #endregion

// #region Dialog

function onConfigDialogCatSub() {

    dialogCategoriaSubCategoria.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 400
    });

    btnCatSubDialogCancelar.on("click", function () {
        dialogCategoriaSubCategoria.close();
    });

    btnCatSubDialogSalvar.on("click", function () {
        onCatSubSalvar();
    });

}

// #endregion

// #region Alertas

function onAlertError(content) {
    $.alert({
        icon: "fa fa-times-circle text-red",
        title: "Erro!",
        content: content,
        buttons: {
            Ok: {
                btnClass: "btn btn-primary btn-xs",
                action: function () {
                    return;
                }
            }
        }
    });
}

function onAlertInfo(content) {
    $.alert({
        icon: "fa fa-info-circle text-blue",
        title: "Informação!",
        content: content,
        buttons: {
            Ok: {
                btnClass: "btn btn-primary btn-xs",
                action: function () {
                    return;
                }
            }
        }
    });
}

// #endregion