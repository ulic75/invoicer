using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Invoicer.Model {

	[Table("Client")]
	public class Client {
		public Client() {
			//Invoices = new HashSet<Invoice>();
			Active = 1;
			ERecords = 0;
		}

		public int Id { get; set; }

		public int Active { get; set; }

		[Required]
		[StringLength(255)]
		public string Name { get; set; }

		[Required]
		[StringLength(255)]
		public string Alias { get; set; }

		[Required]
		[StringLength(255)]
		public string Address1 { get; set; }

		[StringLength(255)]
		public string Address2 { get; set; }

		[Required]
		[StringLength(255)]
		public string City { get; set; }

		[Required]
		[StringLength(2)]
		public string State { get; set; }

		[Required]
		public int PostalCode { get; set; }

		[StringLength(255)]
		public string BillingEmail { get; set; }

		public int ERecords { get; set; }

		//public virtual ICollection<Invoice> Invoices { get; set; }
	}
}
