using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Invoicer.Model {
	public class Invoice {
		public Invoice() {
			Sent = 0;
			LineItems = new HashSet<LineItem>();
			Payments = new HashSet<Payment>();
		}

		public int Id { get; set; }
		public int ClientId { get; set; }
		[Column(TypeName = "smalldatetime")]
		public DateTime Date { get; set; }
		public int Sent { get; set; }

		public virtual Client Client { get; set; }

		public virtual ICollection<LineItem> LineItems { get; set; }
		public virtual ICollection<Payment> Payments { get; set; }
	}
}
