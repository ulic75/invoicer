using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Invoicer.Model {
	public class Payment {
		public int Id { get; set; }
		public int InvoiceId { get; set; }
		[Column(TypeName = "smalldatetime")]
		public DateTime Date { get; set; }
		[Column(TypeName = "money")]
		public decimal Amount { get; set; }
		[StringLength(50)]
		public string Reference { get; set; }

		public virtual Invoice Invoice { get; set; }
	}
}
