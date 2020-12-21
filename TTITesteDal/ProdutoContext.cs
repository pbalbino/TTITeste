using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.SqlServer;
using TTITesteEntities;

namespace TTITesteDal
{
    [DbConfigurationType(typeof(DbContextConfiguration))]
    public class ProdutoContext : DbContext
    {
        #region Constructors

        public ProdutoContext()
            : base("ProdutoContext")
        {

        }

        #endregion

        #region DbSets

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<SubCategoria> SubCategorias { get; set; }

        public DbSet<Produto> Produtos { get; set; }

        #endregion

        #region Override Methods

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingEntitySetNameConvention>();
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            base.OnModelCreating(modelBuilder);
        }

        #endregion
    }

    internal class DbContextConfiguration : DbConfiguration
    {
        #region Constructors
        
        public DbContextConfiguration()
        {
            SetProviderServices(SqlProviderServices.ProviderInvariantName, SqlProviderServices.Instance);
        }

        #endregion
    }
}