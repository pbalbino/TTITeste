// #region Fields

var txtProdutoFiltroNome = $("#produto-filtro-nome");
var txtProdutoFiltroDescricao = $("#produto-filtro-descricao");
var cmbProdutoFiltroCategoria = $("#produto-filtro-categoria");
var cmbProdutoFiltroSubCategoria = $("#produto-filtro-subcategoria");

var btnProdutoFiltroLimpar = $("#produto-filtro-limpar");
var btnProdutoFiltroFiltrar = $("#produto-filtro-filtrar");
var btnProdutoFiltroAdicionar = $("#produto-filtro-adicionar");

var gridProduto = $("#produto-grid");

var dialogProduto = $("#produto-dialog");
var txtProdutoDialogId = $("#produto-dialog-id");
var txtProdutoDialogAlterouFoto = $("#produto-dialog-alteroufoto");
var txtProdutoDialogNome = $("#produto-dialog-nome");
var txtProdutoDialogDescricao = $("#produto-dialog-descricao");
var txtProdutoDialogValorVenda = $("#produto-dialog-valorvenda");
var cmbProdutoDialogCategoria = $("#produto-dialog-categoria");
var cmbProdutoDialogSubCategoria = $("#produto-dialog-subcategoria");
var imgProdutoDialogFoto = $("#produto-dialog-foto");
var inputProdutoDialogFoto = $("#produto-dialog-procurar-foto");
var btnProdutoDialogCancelar = $("#produto-dialogo-cancelar");
var btnProdutoDialogSalvar = $("#produto-dialogo-salvar");

// #endregion

$(document).ready(onConfigControlsProduto());

function onConfigControlsProduto() {

    btnProdutoFiltroLimpar.on("click", onLimparFiltros);
    btnProdutoFiltroFiltrar.on("click", onProdutoFiltrar);
    btnProdutoFiltroAdicionar.on("click", onProdutoAdicionar);

    onConfigGridProduto();
    onConfigDialogProduto();

}

// #region Grid Methods

function onConfigGridProduto() {

    gridProduto.grid({
        primaryKey: "ID",
        //inlineEditing: { mode: "command", managementColumn: false },
        dataSource: {
            url: $urlProdutoGet,
            success: function (response) {
                if (response.msg) {
                    onAlertInfo(response.msg);
                }
                if (response.error) {
                    onAlertError(response.error);
                }
                gridProduto.render(response);
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
            { field: "Nome", title: "Nome", width: "30%", sortable: true },
            { field: "Descricao", title: "Descrição", width: "70%", sortable: true },
            { field: "ValorVendaAux", title: "Valor Venda", width: 150, align: "right", renderer: onGridProdutoValorVendaRenderer, sortable: true },
            { field: "CategoriaNome", title: "Categoria", width: 200, sortable: true },
            { field: "SubCategoriaNome", title: "SubCategoria", width: 200, sortable: true },
            //{
            //    field: "CategoriaNome",
            //    title: "Categoria",
            //    sortable: true,
            //    type: "dropdown",
            //    editField: "CategoriaID",
            //    editor: {
            //        dataSource: {
            //            url: $urlCategoriaGet
            //        },
            //        valueField: "ID",
            //        textField: "Nome"
            //    },
            //    width: 200,
            //    //headerCssClass: "hidden-xs",
            //    //cssClass: "hidden-xs"
            //},
            //{
            //    field: "SubCategoriaNome",
            //    title: "SubCategoria",
            //    sortable: true,
            //    type: "dropdown",
            //    editField: "SubCategoriaID",
            //    editor: {
            //        dataSource: {
            //            url: $urlSubCategoriaGet
            //        },
            //        valueField: "ID",
            //        textField: "Nome"
            //    },
            //    width: 200,
            //    //headerCssClass: "hidden-xs",
            //    //cssClass: "hidden-xs"
            //},
            { width: 150, align: "center", renderer: onGridProdutoOptionsRenderer }
        ],
        pager: { limit: 10 }
    });

}

function onGridProdutoValorVendaRenderer(value, record, $cell, $displayEl) {

    if (value) {
        $displayEl.text(value.toLocaleString("pt-BR", { style: "decimal", minimumFractionDigits: 2 }));
    } else {
        $displayEl.text("");
    }
    
}

function onGridProdutoOptionsRenderer(value, record, $cell, $displayEl, id, $grid) {

    var $editar = $('<button class="btn btn-secondary btn-xs" style="width: 27px" title="Editar"><i class="fas fa-edit"></i></button>').attr("data-id", id).attr("data-edit", id);
    var $excluir = $('<button class="btn btn-danger btn-xs gj-margin-left-10" style="width: 27px" title="Excluir"><i class="fas fa-trash"></i></button>').attr("data-id", id);    

    $editar.on("click",
        function () {
            event.preventDefault();
            txtProdutoDialogId.val(record.ID);
            txtProdutoDialogNome.val(record.Nome);
            txtProdutoDialogDescricao.val(record.Descricao);
            txtProdutoDialogValorVenda.val(record.ValorVendaAux);
            cmbProdutoDialogCategoria.value(record.CategoriaID);
            cmbProdutoDialogSubCategoria.value(record.SubCategoriaID);            
            dialogProduto.open("Editar produto:");
            onFotoDataUrlGet();
            txtProdutoDialogAlterouFoto.val("false");
        });

    $excluir.on("click",
        function () {
            event.preventDefault();
            var id = $(this).data("id");
            $.confirm({
                icon: "fas fa-trash",
                title: "Exclusão de Produto",
                content: "Deseja realmente excluir o produto selecionado?",
                buttons: {
                    Sim: {
                        action: function () {
                            onProdutoDelete(id);
                        }
                    },
                    Não: {}
                }
            });
        });    

    $displayEl.empty().append($editar).append($excluir);

}

// #endregion

// #region Filtros

function onProdutoFiltrar() {

    var data = {
        nome: txtProdutoFiltroNome.val(),
        descricao: txtProdutoFiltroDescricao.val(),
        categoriaId: cmbProdutoFiltroCategoria.find("option:selected").val(),
        subcategoriaId: cmbProdutoFiltroSubCategoria.find("option:selected").val()
    };

    gridProduto.reload(data);

}

function onLimparFiltros() {

    txtProdutoFiltroNome.val('');
    txtProdutoFiltroDescricao.val('');
    cmbProdutoFiltroCategoria.val('');
    cmbProdutoFiltroSubCategoria.val('');
    onProdutoFiltrar();

}

function onProdutoAdicionar(){

    event.preventDefault();

    var categorias = document.getElementById("produto-filtro-categoria").options;
    var subCategorias = document.getElementById("produto-filtro-subcategoria").options;
    if (categorias.length == 1 || subCategorias.length == 1) {
        onAlertInfo("Antes de cadastrar um produto é necessário cadastrar ao menos uma categoria e uma subcategoria.<br><br>" +
            "Menu Cadastros >> Categorias/Sub");
        return;
    }

    txtProdutoDialogId.val(0);
    txtProdutoDialogNome.val("");
    txtProdutoDialogDescricao.val("");
    txtProdutoDialogValorVenda.val("");
    cmbProdutoDialogCategoria.value(0);
    cmbProdutoDialogSubCategoria.value(0);
    dialogProduto.open("Adicionar produto:");
    inputProdutoDialogFoto.replaceWith(inputProdutoDialogFoto.val(null));
    imgProdutoDialogFoto.attr("src", "");
    txtProdutoDialogAlterouFoto.val("false");

}

// #endregion

// #region Dialog Methods

function onConfigDialogProduto() {

    dialogProduto.dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 600
    });

    txtProdutoDialogValorVenda.mask("000.000.000.000.000,00", { reverse: true });

    cmbProdutoDialogCategoria.dropdown({
        dataSource: {
            url: $urlCategoriaGet
        },
        valueField: "ID",
        textField: "Nome",
        uiLibrary: 'bootstrap4'
    });

    cmbProdutoDialogSubCategoria.dropdown({
        dataSource: {
            url: $urlSubCategoriaGet
        },
        valueField: "ID",
        textField: "Nome",
        uiLibrary: 'bootstrap4'
    });

    inputProdutoDialogFoto.on("change", onChangeImage);

    btnProdutoDialogCancelar.on("click", function () {
        dialogProduto.close();
    });

    btnProdutoDialogSalvar.on("click", function () {
        onProdutoSave();
    });

}

function onChangeImage() {
    if (inputProdutoDialogFoto.length > 0) {
        var files = inputProdutoDialogFoto.get(0).files;
        if (files.length > 0) {
            var file = inputProdutoDialogFoto.get(0).files[0];
            var fileSize = file.size;
            if (fileSize > 1048576) {
                onAlertInfo("A foto não pode ser maior que 1MB.")
            } else {
                onShowImage(inputProdutoDialogFoto);
                txtProdutoDialogAlterouFoto.val("true");
            }
        }
    }
}

function onShowImage(input) {
    if (input.length > 0) {
        var files = input.get(0).files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgProdutoDialogFoto.attr("src", e.target.result);
            };
            reader.readAsDataURL(input.get(0).files[0]);
        } else {
            imgProdutoDialogFoto.attr("src", "");
        }
    } else {
        imgProdutoDialogFoto.attr("src", "");
    }
}

function onProdutoSave() {

    var form = $("#produto-dialog-form");
    var urlAction = form.prop("action");
    var typeMethod = form.prop("method");
    var formData = new FormData(form[0]);
    $.ajax({
        url: urlAction,
        type: typeMethod,
        data: formData,
        processData: false,
        contentType: false,
        success: function (resultServer) {
            if (!resultServer.result) {
                onAlertError(resultServer.msg);
            } else {
                dialogProduto.close();
                gridProduto.reload();
            }
        },
        error: function (xhr) {
            onAlertError(xhr.responseText);
        }
    });
    
}

function onFotoDataUrlGet() {
    imgProdutoDialogFoto.attr("src", "");
    $.ajax({
        type: "GET",
        url: $urlFotoDataUrlGet,
        data: { "id": txtProdutoDialogId.val() },
        success: function (resultMethod) {
            if (resultMethod.url) {
                imgProdutoDialogFoto.attr("src", resultMethod.url);
            }
        },
        error: function () {
            onAlertError("Não foi possível obter a foto do produto!")
        }
    });
}

function onProdutoDelete(id) {

    event.preventDefault();

    var form = $('#produto-dialog-form');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: $urlProdutoDelete,
        type: "POST",
        data: { __RequestVerificationToken: token, id: id },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (resultServer) {
            if (resultServer.result) {
                if (resultServer.msg) {
                    onAlertInfo(resultServer.msg);
                }                
                gridProduto.reload();
            } else {
                if (resultServer.msg) {
                    onAlertError(resultServer.msg);
                }
            }
        },
        error: function () {
            onAlertError("Não foi possível excluir o produto.");
        }
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