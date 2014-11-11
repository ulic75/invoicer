using Invoicer.Model;
using System.Data.Entity.ModelConfiguration;

namespace Invoicer.DataAccess {
	public class ClientConfiguration : EntityTypeConfiguration<Client> {
		public ClientConfiguration() {

			Property(c => c.State)
				.IsFixedLength();

			HasMany(i => i.Invoices)
				.WithRequired(i => i.Client)
				.WillCascadeOnDelete(false);

		}
	}
}
