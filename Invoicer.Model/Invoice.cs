using System;
using System.Collections.Generic;

namespace Invoicer.Model {
	public class Invoice {
		public Invoice() {
			Sent = 0;
		}

		public int Id { get; set; }
		public int ClientId { get; set; }
		public DateTime Date { get; set; }
		public int Sent { get; set; }

		public virtual Client Client { get; set; }

		public virtual ICollection<LineItem> LineItems { get; set; }
	}
}
