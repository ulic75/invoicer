using System.Linq;
using System.Web.Http;
using Invoicer.Model;
using Invoicer.DataAccess;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider;
using Breeze.WebApi2;

namespace Invoicer.Web.Controllers {
	[BreezeController]
	public class BreezeController : ApiController {
		// Todo: inject via an interface rather than "new" the concrete class
		readonly InvoicerRepository _repository = new InvoicerRepository();

		[HttpGet]
		public string Metadata() {
			return _repository.Metadata;
		}

		[HttpPost]
		public SaveResult SaveChanges(JObject saveBundle) {
			return _repository.SaveChanges(saveBundle);
		}

		[HttpGet]
		public IQueryable<Client> Clients() {
			return _repository.Clients;
		}

		[HttpGet]
		public IQueryable<Invoice> Invoices() {
			return _repository.Invoices;
		}

		[HttpGet]
		public IQueryable<LineItem> LineItems() {
			return _repository.LineItems;
		}

		[HttpGet]
		public IQueryable<Payment> Payments() {
			return _repository.Payments;
		}
		
		/// <summary>
		/// Query returing a 1-element array with a lookups object whose 
		/// properties are all Rooms, Tracks, and TimeSlots.
		/// </summary>
		/// <returns>
		/// Returns one object, not an IQueryable, 
		/// whose properties are "rooms", "tracks", "timeslots".
		/// The items arrive as arrays.
		/// </returns>
		[HttpGet]
		public object Lookups() {
			var lineitemdescriptions = _repository.LineItemDescriptions;
			return new { lineitemdescriptions };
		}

		// Diagnostic
		[HttpGet]
		public string Ping() {
			return "pong";
		}
	}
}