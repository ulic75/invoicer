using Invoicer.Model;
using System.Data.Entity.ModelConfiguration;

namespace Invoicer.DataAccess {
	public class LineItemDescriptionConfiguration : EntityTypeConfiguration<LineItemDescription> {
		public LineItemDescriptionConfiguration() {

			HasMany(li => li.LineItems)
				.WithRequired(li => li.LineItemDescription)
				.HasForeignKey(li => li.DescriptionId)
				.WillCascadeOnDelete(false);

		}
	}
}
