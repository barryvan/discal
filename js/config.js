window.discal = window.discal || {};
discal.config = discal.config || {};

window.addEventListener('load', () => {
	let url = localStorage.getItem('url') || '';
	let scale = +(localStorage.getItem('scale') || '1.5');
	let title = localStorage.getItem('title') || '';
	
	discal.config.show = () => {
		configPanel.classList.remove('hidden');
	};
	
	discal.config.hide = () => {
		configPanel.classList.add('hidden');
	};
	
	discal.config.discard = () => {
		titleInput.value = title;
		urlInput.value = url;
		scaleInput.value = scale;
		discal.config.hide();
	};
	
	discal.config.save = () => {
		title = titleInput.value || '';
		localStorage.setItem('title', title);
		
		url = urlInput.value || '';
		localStorage.setItem('url', url);
		
		scale = scaleInput.value || 1.5;
		localStorage.setItem('scale', scale);
		
		discal.config.hide();
		discal.parse.refresh(); // yay tight coupling
	};
	
	let configToggle = element('button', {
		'className': 'config-toggle',
		'innerHTML': '&#8801;',
		'events': {
			'click': discal.config.show
		}
	});
	
	let configPanel = element('div', {
		'className': 'config-panel hidden'
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
			'click': discal.config.save
		}
	});
	let cancelButton = element('button', {
		'textContent': 'Cancel',
		'events': {
			'click': discal.config.discard
		}
	});
	element.appendAll(configPanel, titleLabel, urlLabel, scaleLabel, okButton, cancelButton);
	element.appendAll(document.body, configToggle, configPanel);
	
	if (!url) discal.config.show();
});