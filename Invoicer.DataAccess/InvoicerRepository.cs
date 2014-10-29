﻿using System.Linq;
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

		public IQueryable<Session> Sessions {
			get { return Context.Sessions; }
		}

		public IQueryable<Invoice> Invoices {
			get { return Context.Invoices; }
		}

		public IQueryable<LineItemDescription> LineItemDescriptions {
			get { return Context.LineItemDescriptions; }
		}

		public IQueryable<Client> Clients {
			get { return Context.Clients; }
		}

		public IQueryable<Person> Speakers {
			get { return Context.Persons.Where(p => p.SpeakerSessions.Any()); }
		}

		public IQueryable<Person> Persons {
			get { return Context.Persons; }
		}

		public IQueryable<Room> Rooms {
			get { return Context.Rooms; }
		}
		public IQueryable<TimeSlot> TimeSlots {
			get { return Context.TimeSlots; }
		}
		public IQueryable<Track> Tracks {
			get { return Context.Tracks; }
		}
	}
}