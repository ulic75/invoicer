using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;
using Invoicer.Model;

namespace Invoicer.DataAccess {
	/// <summary>
	/// Repository (a "Unit of Work" really) of CodeCamper models.
	/// </summary>
	public class InvoicerRepository {
		private readonly EFContextProvider<InvoicerDbContext>
			_contextProvider = new EFContextProvider<InvoicerDbContext>();

		private InvoicerDbContext Context { get { return _contextProvider.Context; } }

		public string Metadata {
			get { return _contextProvider.Metadata(); }
		}

		public SaveResult SaveChanges(JObject saveBundle) {
			return _contextProvider.SaveChanges(saveBundle);
		}

		public IQueryable<Client> Clients {
			get { return Context.Clients; }
		}

		public IQueryable<Invoice> Invoices {
			get { return Context.Invoices; }
		}

		public IQueryable<LineItem> LineItems {
			get { return Context.LineItems; }
		}

		public IQueryable<LineItemDescription> LineItemDescriptions {
			get { return Context.LineItemDescriptions; }
		}

		public IQueryable<Payment> Payments {
			get { return Context.Payments; }
		}

	}
}