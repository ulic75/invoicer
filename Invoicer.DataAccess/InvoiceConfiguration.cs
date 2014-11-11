using Invoicer.Model;
using System.Data.Entity.ModelConfiguration;

namespace Invoicer.DataAccess {
	public class InvoiceConfiguration : EntityTypeConfiguration<Invoice> {
		public InvoiceConfiguration() {

			HasMany(i => i.Payments)
				.WithRequired(i => i.Invoice)
				.WillCascadeOnDelete(false);

			HasMany(i => i.LineItems)
				.WithRequired(i => i.Invoice)
				.WillCascadeOnDelete(false);

		}
	}
}
