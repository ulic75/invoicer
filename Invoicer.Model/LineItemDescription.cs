using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Invoicer.Model {
	public class LineItemDescription {
		public LineItemDescription() {
			LineItems = new HashSet<LineItem>();
		}

		public int Id { get; set; }
		[Required]
		[StringLength(512)]
		public string Description { get; set; }

		public virtual ICollection<LineItem> LineItems { get; set; }
	}
}
