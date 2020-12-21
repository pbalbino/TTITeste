using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using TTITesteEntities;

namespace TTITesteDal.DataAccess
{
    public class ProdutoDal : Singleton<ProdutoDal>
    {
        #region Produto

        public List<Produto> ProdutoGet(Produto produto)
        {
            using (var db = new ProdutoContext())
            {
                var lstProduto = db.Produtos.SqlQuery("exec usp_lst_Produto {0}, {1}, {2}, {3}, {4}",
                    produto.ID,
                    produto.Nome,
                    produto.Descricao,
                    produto.CategoriaID,
                    produto.SubCategoriaID).ToList();

                if (lstProduto.Any())
                {
                    lstProduto.ForEach(c =>
                    {
                        c.ValorVendaAux = c.ValorVenda.ToString("N2", new CultureInfo("pt-BR"));
                        c.CategoriaNome = c.Categoria?.Nome;
                        c.SubCategoriaNome = c.SubCategoria?.Nome;
                    });
                }

                return lstProduto;                
            }
        }

        public Produto ProdutoSingleGet(int id)
        {
            using (var db = new ProdutoContext())
            {
                return db.Produtos.FirstOrDefault(c => c.ID == id);
            }
        }

        public bool ProdutoSave(Produto produto)
        {
            using (var db = new ProdutoContext())
            {
                if (produto.ID > 0)
                {
                    db.Entry(produto).State = System.Data.Entity.EntityState.Modified;
                    if (!produto.AlterouFoto)
                    {
                        db.Entry(produto).Property(c => c.Foto).IsModified = false;
                    }
                    return db.SaveChanges() > 0;
                }
                else
                {
                    var produtoInserido = db.Produtos.Add(produto);
                    db.SaveChanges();
                    return produtoInserido != null && produtoInserido.ID > 0;
                }
            }
        }

        public bool ProdutoDelete(int id)
        {
            using (var db = new ProdutoContext())
            {
                var produto = db.Produtos.FirstOrDefault(c => c.ID == id);
                if (produto != null)
                {
                    db.Produtos.Remove(produto);
                    return db.SaveChanges() > 0;
                }
                return false;
            }
        }

        #endregion

        #region Categoria

        public List<Categoria> CategoriaGet()
        {
            using (var db = new ProdutoContext())
            {
                return db.Categorias.ToList();
            }
        }

        public bool CategoriaSave(Categoria categoria)
        {
            using (var db = new ProdutoContext())
            {
                if (categoria.ID > 0)
                {
                    db.Entry(categoria).State = System.Data.Entity.EntityState.Modified;                    
                    return db.SaveChanges() > 0;
                }
                else
                {
                    var categoriaInserida = db.Categorias.Add(categoria);
                    db.SaveChanges();
                    return categoriaInserida != null && categoriaInserida.ID > 0;
                }
            }
        }

        public bool CategoriaDelete(int id)
        {
            using (var db = new ProdutoContext())
            {
                var categoria = db.Categorias.FirstOrDefault(c => c.ID == id);
                if (categoria != null)
                {
                    db.Categorias.Remove(categoria);
                    return db.SaveChanges() > 0;
                }
                return false;
            }
        }

        #endregion

        #region SubCategoria

        public List<SubCategoria> SubCategoriaGet()
        {
            using (var db = new ProdutoContext())
            {
                return db.SubCategorias.ToList();
            }
        }

        public bool SubCategoriaSave(SubCategoria subCategoria)
        {
            using (var db = new ProdutoContext())
            {
                if (subCategoria.ID > 0)
                {
                    db.Entry(subCategoria).State = System.Data.Entity.EntityState.Modified;
                    return db.SaveChanges() > 0;
                }
                else
                {
                    var subCategoriaInserida = db.SubCategorias.Add(subCategoria);
                    db.SaveChanges();
                    return subCategoriaInserida != null && subCategoriaInserida.ID > 0;
                }
            }
        }

        public bool SubCategoriaDelete(int id)
        {
            using (var db = new ProdutoContext())
            {
                var subCategoria = db.SubCategorias.FirstOrDefault(c => c.ID == id);
                if (subCategoria != null)
                {
                    db.SubCategorias.Remove(subCategoria);
                    return db.SaveChanges() > 0;
                }
                return false;
            }
        }

        #endregion
    }
}
