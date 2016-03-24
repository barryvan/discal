window.discal = window.discal || {};

window.addEventListener('load', () => {
	const minimumLength = 45 * 60; // Draw each entry as at least 45 minutes long
	
	const container = element('main');
	
	const title = element('h1');
	const wrapper = element('div', {
		'className': 'wrapper'
	});
	const root = element('ol', {
		id: 'root'
	});
	const timesBar = element('ol', {
		'className': 'timesBar'
	});
	element.appendAll(wrapper, timesBar, root);
	
	element.appendAll(container, title, wrapper);
	document.body.appendChild(container);
	
	const drawTimes = scale => {
		// Half hour tickets
		let els = [];
		
		for (let i = 0; i < 48; i++) {
			els.push(element('li', {
				'textContent': i % 2 ? ':30' : (i / 2),
				'className': i % 2 ? 'half' : 'hour',
				'style': {
					'height': 30 * 60 * scale
				}
			}));
		}
		timesBar.innerHTML = '';
		element.appendAll(timesBar, ...els);
	};
	
	let timeToSeconds = time => time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
	
	const findOverlaps = (event, column, haystack, assignments) => {
		let start = timeToSeconds(event.startDate.toJSDate());
		let end = timeToSeconds(event.endDate.toJSDate());
		end = Math.max(end, start + minimumLength);
		
		return haystack.filter(other => {
			if (event === other || (column !== undefined && column !== assignments.get(other))) {
				return false;
			}
			
			let otherStart = timeToSeconds(other.startDate.toJSDate());
			let otherEnd = timeToSeconds(other.endDate.toJSDate());
			otherEnd = Math.max(otherEnd, otherStart + minimumLength);
			
			return !(end <= otherStart || start >= otherEnd);
		});
	};
	
	const resolveOverlaps = (events, elements) => {
		let colAss = new Map(); // Position within set of columns for each event
		let colCnt = new Map(); // Number of columns in set for each event
		
		events.forEach((event, index) => {
			colAss.set(event, 0);
			colCnt.set(event, 1);
			
			let columns = 1;
			for (let j = 0; j < columns; j++) {
				if (findOverlaps(event, j, events, colAss).length) {
					colAss.set(event, colAss.get(event) + 1);
					columns += 1;
				}
			}
		});
		
		events.forEach((event, index) => {
			colCnt.set(Math.max(1, colAss + 1));
			
			const overlaps = findOverlaps(event, undefined, events, colAss);
			overlaps.forEach((overlapped, overlappingIndex) => {
				colCnt.set(event, Math.max(colCnt.get(event), colAss.get(overlapped) + 1));
				colCnt.set(overlapped, Math.max(colCnt.get(event), colCnt.get(overlapped)));
			});
			
			const el = elements[index];
			el.style.width = ((1 / colCnt.get(event)) * 100) + '%';
			el.style.left = ((colAss.get(event) / colCnt.get(event)) * 100) + '%';
		});
	};
	
	discal.render = events => {
		let scale = +(localStorage.getItem('scale') || 1.5); // Number of CSS pixels per minute
		scale = scale / 60;
		
		title.textContent = localStorage.getItem('title') || '';
		
		root.innerHTML = '';
		root.style.height = (24 * 60 * 60 * scale) + 'px';
		timesBar.style.height = root.style.height;
		
		const beginEdge = 'top'; // Let us change orientation easily later if we want
		const duration = 'height';
		
		// use event.summary for the title
		// use event.attendees.getValues() to return an array of mailto: addresses of attendees
		// use event.location to get the free-form text of the location
		// use event.organizer to get the mailto: address of the organiser
		// use event.attendees[n].jCal[1].partstat to get the status of the attendee -- "ACCEPTED" or "DECLINED" or "NEEDS-ACTION"
		// use event.startDate.toJSDate() and event.endDate.toJSDate()
		
		events = events.sort((a, b) => {
			return (a.startDate.toJSDate() - b.startDate.toJSDate()) || (a.endDate.toJSDate() - b.endDate.toJSDate());
		});
		
		const decorate = (event, el) => {
			let stripMailto = (text) => text ? (text.startsWith('mailto:') ? text.substring(7) : text) : '';
			
			let start = event.startDate.toJSDate();
			let end = event.endDate.toJSDate();
			
			let attending = event.attendees.filter(attendee => attendee.jCal[1].partStat !== 'DECLINED');
			
			let printTime = time => time.getHours() + ':' + (time.getMinutes() ? '' : '0') + time.getMinutes();
			
			let title = element('h2', {
				'textContent': event.summary || 'Unnamed event'
			});
			let organiser = element('div', {
				'className': 'organiser',
				'textContent': stripMailto(event.organizer)
			});
			let location = element('div', {
				'className': 'location',
				'textContent': event.location
			});
			let times = element('div', {
				'className': 'times',
				'innerHTML': printTime(start) + ' &ndash; ' + printTime(end)
			});
			let attendeesSummary = element('div', {
				'className': 'attendeesSummary',
				'textContent': attending.length + ' attendee' + (attending.length !== 1 ? 's' : '')
			});
			let attendees = element('div', {
				'className': 'attendees',
				'textContent': attending.map(attendee => stripMailto(attendee.jCal[3])).filter(item => !!item).join(', ')
			});
			
			drawTimes(scale);
			element.appendAll(el, title, organiser, times, location, attendeesSummary, attendees);
		};
		
		const rendered = events.map(event => {
			let start = timeToSeconds(event.startDate.toJSDate());
			let end = timeToSeconds(event.endDate.toJSDate());
			end = Math.max(end, start + minimumLength);
			
			var opts = { style: {} };
			opts.style[beginEdge] = start * scale;
			opts.style[duration] = (end - start) * scale;
			
			const el = element('li', opts);
			
			decorate(event, el);
			
			return el;
		});
		
		resolveOverlaps(events, rendered);
		
		const now = timeToSeconds(new Date());
		const nowIndicator = element('div', {
			'className': 'now'
		});
		nowIndicator.style[beginEdge] = (now * scale) + 'px';
		
		
		element.appendAll(root, nowIndicator, ...rendered);
		wrapper.scrollTop = now * scale - wrapper.offsetHeight / 2;
	};
});