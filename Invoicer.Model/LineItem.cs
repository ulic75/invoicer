using System.ComponentModel.DataAnnotations.Schema;

namespace Invoicer.Model {
	public class LineItem {
		public int Id { get; set; }
		public int InvoiceId { get; set; }
		public int DescriptionId { get; set; }
		public float Quantity { get; set; }
		[Column(TypeName = "money")]
		public decimal UnitPrice { get; set; }

		public virtual Invoice Invoice { get; set; }
		public virtual LineItemDescription LineItemDescription { get; set; }
	}
}
