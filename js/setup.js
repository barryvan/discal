window.discal = window.discal || {};
discal.setup = discal.setup || {};

window.addEventListener('load', () => {
	let url = localStorage.getItem('url') || 'demo.ics';
	let scale = +(localStorage.getItem('scale') || '1.5');
	let title = localStorage.getItem('title') || 'Discal Demo';
	
	discal.setup.show = () => {
		setupPanel.classList.remove('hidden');
	};
	
	discal.setup.hide = () => {
		setupPanel.classList.add('hidden');
	};
	
	discal.setup.discard = () => {
		titleInput.value = title;
		urlInput.value = url;
		scaleInput.value = scale;
		discal.setup.hide();
	};
	
	discal.setup.save = () => {
		title = titleInput.value || 'Discal Demo';
		localStorage.setItem('title', title);
		
		url = urlInput.value || 'demo.ics';
		localStorage.setItem('url', url);
		
		scale = scaleInput.value || 1.5;
		localStorage.setItem('scale', scale);
		
		discal.setup.hide();
		discal.parse.refresh(); // yay tight coupling
	};
	
	let setupToggle = element('button', {
		'className': 'setup-toggle',
		'innerHTML': '&#8801;',
		'events': {
			'click': discal.setup.show
		}
	});
	
	let setupPanel = element('div', {
		'className': 'setup-panel hidden'
	});
	
	let titleLabel = element('label', {
		'innerHTML': '<span>Title</span>'
	});
	let titleInput = element('input', {
		'type': 'text',
		'value': title
	});
	titleLabel.appendChild(titleInput);
	
	let urlLabel = element('label', {
		'innerHTML': '<span>iCal URL</span>'
	});
	let urlInput = element('input', {
		'type': 'text',
		'value': url
	});
	urlLabel.appendChild(urlInput);
	
	let scaleLabel = element('label', {
		'innerHTML': '<span>Scale</span>'
	});
	let scaleInput = element('input', {
		'type': 'number',
		'min': '0.25',
		'max': '8',
		'step': '0.25',
		'value': scale
	});
	scaleLabel.appendChild(scaleInput);
	
	let okButton = element('button', {
		'textContent': 'OK',
		'events': {
			'click': discal.setup.save
		}
	});
	let cancelButton = element('button', {
		'textContent': 'Cancel',
		'events': {
			'click': discal.setup.discard
		}
	});
	element.appendAll(setupPanel, titleLabel, urlLabel, scaleLabel, okButton, cancelButton);
	element.appendAll(document.body, setupToggle, setupPanel);
	
	if (!url) discal.setup.show();
});