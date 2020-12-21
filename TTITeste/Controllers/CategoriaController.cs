using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web.Mvc;
using TTITesteDal.DataAccess;
using TTITesteEntities;

namespace TTITeste.Controllers
{
    public class CategoriaController : BaseController
    {
        #region Categoria e SubCategoria

        public ActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                ManageMessageError(ex);
                return View();
            }
        }

        public JsonResult CategoriaGet(int? page, int? limit, string sortBy, string direction)
        {
            try
            {
                var lstCategoria = ProdutoDal.Instance.CategoriaGet();

                if ((bool)!lstCategoria?.Any())
                {
                    return Json(new
                    {
                        records = new List<Categoria>(),
                        total = 0,
                        msg = string.Empty,
                        error = string.Empty,
                    }, JsonRequestBehavior.AllowGet);
                }

                if (!string.IsNullOrEmpty(direction) && !string.IsNullOrEmpty(sortBy))
                {
                    lstCategoria = lstCategoria.OrderBy(string.Format("{0} {1}", sortBy, direction)).ToList();
                }

                IEnumerable<Categoria> lstEntitiesPaginado = new List<Categoria>();
                if (page.HasValue && limit.HasValue)
                {
                    int start = (page.Value - 1) * limit.Value;
                    lstEntitiesPaginado = lstCategoria.Skip(start).Take(limit.Value);
                }

                lstCategoria = lstEntitiesPaginado.ToList();

                return Json(new
                {
                    records = lstCategoria,
                    total = lstCategoria.Count,
                    msg = string.Empty,
                    error = string.Empty,
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    records = new List<Categoria>(),
                    total = 0,
                    msg = string.Empty,
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SubCategoriaGet(int? page, int? limit, string sortBy, string direction)
        {
            try
            {
                var lstSubCategoria = ProdutoDal.Instance.SubCategoriaGet();

                if ((bool)!lstSubCategoria?.Any())
                {
                    return Json(new
                    {
                        records = new List<SubCategoria>(),
                        total = 0,
                        msg = string.Empty,
                        error = string.Empty,
                    }, JsonRequestBehavior.AllowGet);
                }

                if (!string.IsNullOrEmpty(direction) && !string.IsNullOrEmpty(sortBy))
                {
                    lstSubCategoria = lstSubCategoria.OrderBy(string.Format("{0} {1}", sortBy, direction)).ToList();
                }

                IEnumerable<SubCategoria> lstEntitiesPaginado = new List<SubCategoria>();
                if (page.HasValue && limit.HasValue)
                {
                    int start = (page.Value - 1) * limit.Value;
                    lstEntitiesPaginado = lstSubCategoria.Skip(start).Take(limit.Value);
                }

                lstSubCategoria = lstEntitiesPaginado.ToList();

                return Json(new
                {
                    records = lstSubCategoria,
                    total = lstSubCategoria.Count,
                    msg = string.Empty,
                    error = string.Empty,
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    records = new List<SubCategoria>(),
                    total = 0,
                    msg = string.Empty,
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CatSubSave(int tipoCadastro, int id, string nome)
        {
            try
            {
                if (string.IsNullOrEmpty(nome) || string.IsNullOrWhiteSpace(nome))
                {
                    return Json(new { result = false, msg = "O nome não pode ser nulo." }, JsonRequestBehavior.AllowGet);
                }

                switch (tipoCadastro)
                {
                    case 1:
                        var categoria = new Categoria
                        {
                            ID = id,
                            Nome = nome
                        };
                        
                        if (!ProdutoDal.Instance.CategoriaSave(categoria))
                        {
                            return Json(new { result = false, msg = "Não foi possível salvar a categoria!" }, JsonRequestBehavior.AllowGet);
                        }

                        return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
                    case 2:
                        var subCategoria = new SubCategoria
                        {
                            ID = id,
                            Nome = nome
                        };

                        if (!ProdutoDal.Instance.SubCategoriaSave(subCategoria))
                        {
                            return Json(new { result = false, msg = "Não foi possível salvar a SubCategoria!" }, JsonRequestBehavior.AllowGet);
                        }

                        return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
                    default:
                        return Json(new { result = false, msg = "O tipo de cadastro não foi definido." }, JsonRequestBehavior.AllowGet);                        
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CatSubDelete(int tipoCadastro, int id)
        {
            try
            {
                switch (tipoCadastro)
                {
                    case 1:
                        if (ProdutoDal.Instance.ProdutoGet(new Produto { CategoriaID = id }).Any())
                        {
                            return Json(new { 
                                result = false, 
                                msg = "Não é possível excluir essa categoria! O registro já foi utilizado em outras áreas do sistema" 
                            }, JsonRequestBehavior.AllowGet);
                        }

                        if (!ProdutoDal.Instance.CategoriaDelete(id))
                        {
                            return Json(new { result = false, msg = "Não foi possível excluir a categoria!" }, JsonRequestBehavior.AllowGet);
                        }

                        return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
                    case 2:
                        if (ProdutoDal.Instance.ProdutoGet(new Produto { SubCategoriaID = id }).Any())
                        {
                            return Json(new
                            {
                                result = false,
                                msg = "Não é possível excluir essa SubCategoria! O registro já foi utilizado em outras áreas do sistema"
                            }, JsonRequestBehavior.AllowGet);
                        }

                        if (!ProdutoDal.Instance.SubCategoriaDelete(id))
                        {
                            return Json(new { result = false, msg = "Não foi possível excluir a SubCategoria!" }, JsonRequestBehavior.AllowGet);
                        }

                        return Json(new { result = true, msg = string.Empty }, JsonRequestBehavior.AllowGet);
                    default:
                        return Json(new { result = false, msg = "O tipo de cadastro não foi definido." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { result = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion
    }
}