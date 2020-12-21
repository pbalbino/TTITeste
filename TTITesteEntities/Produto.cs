using System.ComponentModel.DataAnnotations.Schema;

namespace TTITesteEntities
{
    public class Produto
    {
        private string _categoriaNome;

        public int ID { get; set; }

        public string Nome { get; set; }

        public string Descricao { get; set; }

        public decimal ValorVenda { get; set; }

        public byte[] Foto { get; set; }

        public int CategoriaID { get; set; }

        public int SubCategoriaID { get; set; }

        public virtual Categoria Categoria { get; set; }

        public virtual SubCategoria SubCategoria { get; set; }

        [NotMapped]
        public string ValorVendaAux { get; set; }

        [NotMapped]
        public string CategoriaNome { get; set; }

        [NotMapped]
        public string SubCategoriaNome { get; set; }

        [NotMapped]
        public bool AlterouFoto { get; set; }

    }
}