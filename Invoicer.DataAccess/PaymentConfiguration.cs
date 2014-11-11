using Invoicer.Model;
using System.Data.Entity.ModelConfiguration;

namespace Invoicer.DataAccess {
	public class PaymentConfiguration : EntityTypeConfiguration<Payment> {
		public PaymentConfiguration() {

			Property(p => p.Amount)
				.HasPrecision(19, 4);

			HasRequired(p => p.Invoice);

		}
	}
}
