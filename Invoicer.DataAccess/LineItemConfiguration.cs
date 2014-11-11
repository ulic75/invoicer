using Invoicer.Model;
using System.Data.Entity.ModelConfiguration;

namespace Invoicer.DataAccess {
	public class LineItemConfiguration : EntityTypeConfiguration<LineItem> {
		public LineItemConfiguration() {

			Property(li => li.UnitPrice)
				.HasPrecision(19, 4);

		}
	}
}
