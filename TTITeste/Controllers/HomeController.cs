using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Web.Mvc;
using TTITesteDal.DataAccess;
using TTITesteEntities;

namespace TTITeste.Controllers
{
    public class HomeController : BaseController
    {
        #region Produto

        public ActionResult Index()
        {
            try
            {
                ViewBag.LstCategoria = new SelectList(ProdutoDal.Instance.CategoriaGet(), "ID", "Nome");
                ViewBag.LstSubCategoria = new SelectList(ProdutoDal.Instance.SubCategoriaGet(), "ID", "Nome");
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.LstCategoria = new SelectList(new List<Categoria>(), "ID", "Nome");
                ViewBag.LstSubCategoria = new SelectList(new List<SubCategoria>(), "ID", "Nome");
                ManageMessageError(ex);
                return View();
            }
        }

        public JsonResult ProdutoGet(string nome, string descricao, int? categoriaId, int? subcategoriaId,
            int? page, int? limit, string sortBy, string direction)
        {
            try
            {
                var lstProduto = ProdutoDal.Instance.ProdutoGet(new Produto
                {
                    Nome = nome,
                    Descricao = descricao,
                    CategoriaID = categoriaId ?? 0,
                    SubCategoriaID = subcategoriaId ?? 0
                });

                if ((bool)!lstProduto?.Any())
                {
                    return Json(new
                    {
                        records = new List<Produto>(),
                        total = 0,
                        msg = string.Empty,
                        error = string.Empty,
                    }, JsonRequestBehavior.AllowGet);
                }

                if (!string.IsNullOrEmpty(direction) && !string.IsNullOrEmpty(sortBy))
                {
                    lstProduto = lstProduto.OrderBy(string.Format("{0} {1}", sortBy, direction)).ToList();
                }

                IEnumerable<Produto> lstEntitiesPaginado = new List<Produto>();
                if (page.HasValue && limit.HasValue)
                {
                    int start = (page.Value - 1) * limit.Value;
                    lstEntitiesPaginado = lstProduto.Skip(start).Take(limit.Value);
                }

                lstProduto = lstEntitiesPaginado.ToList();

                return Json(new
                {
                    records = lstProduto,
                    total = lstProduto.Count,
                    msg = string.Empty,
                    error = string.Empty,
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    records = new List<Produto>(),
                    total = 0,
                    msg = string.Empty,
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult CategoriaGet()
        {
            try
            {
                var lstCategoria = new List<Categoria>
                {
                    new Categoria
                    {
                        ID = 0,
                        Nome = string.Empty
                    }
                };

                lstCategoria.AddRange(ProdutoDal.Instance.CategoriaGet().OrderBy(c => c.Nome));

                return Json(lstCategoria, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new List<Categoria>(), JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SubCategoriaGet()
        {
            try
            {
                var lstSubCategoria = new List<SubCategoria>
                {
                    new SubCategoria
                    {
                        ID = 0,
                        Nome = string.Empty
                    }
                };

                lstSubCategoria.AddRange(ProdutoDal.Instance.SubCategoriaGet().OrderBy(c => c.Nome));

                return Json(lstSubCategoria, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new List<SubCategoria>(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProdutoSave(Produto entity)
        {
            try
            {
                var produtoValidado = ValidaProduto(entity);
                if (!produtoValidado.Item1)
                {
                    return Json(new { result = false, msg = produtoValidado.Item2 }, JsonRequestBehavior.AllowGet);
                }

                if (entity.AlterouFoto)
                {
                    var fotoFile = Request.Files["_fotoFile"];
                    if (fotoFile != null && fotoFile.ContentLength > 0)
                    {
                        using (var binary = new BinaryReader(fotoFile.InputStream))
                        {
                            entity.Foto = binary.ReadBytes(fotoFile.ContentLength);
                        }                        
                    }
                }

                if (!string.IsNullOrEmpty(entity.ValorVendaAux) && decimal.TryParse(entity.ValorVendaAux, out var valorVenda))
                {
                    entity.ValorVenda = valorVenda;
                }

                if (!ProdutoDal.Instance.ProdutoSave(entity))
                {
                    return Json(new { result = false, msg = "Não foi possível salvar o registro!" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult FotoDataUrlGet(int id)
        {
            try
            {
                var produto = ProdutoDal.Instance.ProdutoSingleGet(id);
                if (produto == null || produto.Foto == null || produto.Foto.Length <= 0)
                {
                    return Json(new { url = string.Empty }, JsonRequestBehavior.AllowGet);
                }

                var imageBase64Data = Convert.ToBase64String(produto.Foto);
                var imageDataURL = $"data:image/jpg;base64,{imageBase64Data}";
                return Json(new { url = imageDataURL }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { url = string.Empty }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ProdutoDelete(int id)
        {
            try
            {
                if (!ProdutoDal.Instance.ProdutoDelete(id))
                {
                    return Json(new { result = false, msg = "Não foi possível excluir o registro!" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        #region Private Methods

        private Tuple<bool, string> ValidaProduto(Produto produto)
        {
            try
            {
                if (string.IsNullOrEmpty(produto.Nome) || string.IsNullOrWhiteSpace(produto.Nome))
                {
                    return new Tuple<bool, string>(false, "O nome não pode ser nulo.");
                }

                if (string.IsNullOrEmpty(produto.Descricao) || string.IsNullOrWhiteSpace(produto.Descricao))
                {
                    return new Tuple<bool, string>(false, "A descrição não pode ser nula.");
                }

                if (produto.CategoriaID <= 0)
                {
                    return new Tuple<bool, string>(false, "Selecione uma categoria.");
                }

                if (produto.SubCategoriaID <= 0)
                {
                    return new Tuple<bool, string>(false, "Selecione uma subcategoria.");
                }

                if (produto.Nome.Length > 30)
                {
                    return new Tuple<bool, string>(false, "O nome não pode ter mais que 30 caracteres.");
                }

                if (produto.Descricao.Length > 150)
                {
                    return new Tuple<bool, string>(false, "A descrição não pode ter mais que 150 caracteres.");
                }

                return new Tuple<bool, string>(true, string.Empty);
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string>(false, ex.Message);
            }

        }

        #endregion

        #endregion        

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Contato";

            return View();
        }
    }
}