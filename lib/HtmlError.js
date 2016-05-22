'use strict';

class HtmlError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code || '500';
	}
}

module.exports = HtmlError;