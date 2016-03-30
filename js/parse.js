window.discal = window.discal || {};
discal.parse = discal.parse || {};

window.addEventListener('load', () => {
	discal.parse.refresh = () => {
		fetch(localStorage.getItem('url') || 'demo.ics').then(response => {
			response.text().then(discal.parse.parse);
		});
	};
	
	discal.parse.parse = text => {
		let startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		let endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		const year = startOfDay.getFullYear();
		const month = startOfDay.getMonth() + 1;
		const day = startOfDay.getDate();
		
		let isToday = icaltime => icaltime.year === year && icaltime.month === month && icaltime.day === day;
		
		let events;
		
		if (text) {
			let jcal = ICAL.parse(text);
			let comp  = new ICAL.Component(jcal);
			
			events = [];
			comp.getAllSubcomponents('vevent')
				.map(event => new ICAL.Event(event))
				.forEach(event => {
					let iterator = event.iterator();
					let nextTime;
					let expansionNumber = 0;
					while (++expansionNumber < discal.config.maxExpansions && (nextTime = iterator.next())) {
						if (isToday(nextTime)) {
							events.push(event.getOccurrenceDetails(nextTime));
						}
					}
				});
			events = events.filter(occurrenceDetails => {
				return occurrenceDetails.startDate && occurrenceDetails.endDate && occurrenceDetails.item;
			}).map(occurrenceDetails => {
				return {
					startDate: occurrenceDetails.startDate.toJSDate(),
					endDate: occurrenceDetails.endDate.toJSDate(),
					attendees: occurrenceDetails.item.attendees,
					summary: occurrenceDetails.item.summary,
					organizer: occurrenceDetails.item.organizer,
					location: occurrenceDetails.item.location
				};
			});
		} else {
			events = [];
		}
		
		console.log('Found %d events for today', events.length);
		
		discal.render(events); // yay tight coupling 
	};
	
	let go = () => {
		discal.parse.refresh();
	};
	
	window.setInterval(go, 60 * 1000);
	go();
});