using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Invoicer.Model;

namespace Invoicer.DataAccess {
	public class InvoicerDbContext : DbContext {
		public InvoicerDbContext()
			: base(nameOrConnectionString: "Invoicer") { }

		static InvoicerDbContext() {
			Database.SetInitializer<InvoicerDbContext>(null);
		}
		protected override void OnModelCreating(DbModelBuilder modelBuilder) {
			// Use singular table names
			modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

			// Disable proxy creation and lazy loading; not wanted in this service context.
			Configuration.ProxyCreationEnabled = false;
			Configuration.LazyLoadingEnabled = false;

			modelBuilder.Configurations.Add(new ClientConfiguration());
			modelBuilder.Configurations.Add(new InvoiceConfiguration());
			modelBuilder.Configurations.Add(new LineItemConfiguration());
			modelBuilder.Configurations.Add(new LineItemDescriptionConfiguration());
			modelBuilder.Configurations.Add(new PaymentConfiguration());
		}

		public DbSet<Client> Clients { get; set; }
		public DbSet<Invoice> Invoices { get; set; }
		public DbSet<LineItem> LineItems { get; set; }
		public DbSet<LineItemDescription> LineItemDescriptions { get; set; }
		public DbSet<Payment> Payments { get; set; }

	}
}