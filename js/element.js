window.element = (type, options) => {
	let el = document.createElement(type);
	for (let prop in options || {}) {
		if (prop === 'events') {
			for (let event in options[prop]) {
				el.addEventListener(event, options[prop][event], false);
			}
		} else if (prop === 'style') {
			for (let style in options[prop]) {
				let value = options[prop][style];
				if (['height', 'width', 'top', 'right', 'bottom', 'left'].indexOf(style) > -1) {
					if (typeof value === 'number') {
						value = value + 'px';
					}
				}
				el.style[style] = value;
			}
		} else {
			el[prop] = options[prop];
		}
	}
	return el;
};

window.element.appendAll = (parent, ...items)  => {
	if (!(parent && parent.appendChild)) {
		console.warn('Invalid parent', parent);
		return;
	}
	
	for (let el of items) {
		if (!el.tagName) return;
		parent.appendChild(el);
	}
};