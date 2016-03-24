window.discal = window.discal || {};
discal.parse = discal.parse || {};

window.addEventListener('load', () => {
	discal.parse.refresh = () => {
		let url = localStorage.getItem('url') || '';
		if (url) {
			fetch(url).then(response => {
				response.text().then(discal.parse.parse);
			});
		} else {
			discal.parse.parse('');
		}
	};
	
	discal.parse.parse = text => {
		let startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		let endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		
		let events;
		
		if (text) {
			let jcal = ICAL.parse(text);
			let comp  = new ICAL.Component(jcal);
			events = comp.getAllSubcomponents('vevent')
											.map(event => new ICAL.Event(event))
											.filter(item => item.startDate.toJSDate() >= startOfDay && item.endDate.toJSDate() <= endOfDay);
		} else {
			events = [];
		}
		
		console.log('Found %d events between %s and %s', events.length, startOfDay, endOfDay);
		
		discal.render(events); // yay tight coupling 
	};
	
	let go = () => {
		if (localStorage.getItem('url')) discal.parse.refresh();
	};
	
	window.setInterval(go, 60 * 1000);
	go();
});