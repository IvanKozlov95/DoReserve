'use strict';

class HtmlError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code || '500';
		this._setMessage();
	}

	_setMessage() {
		if (!this.message) {
			switch (this.code) {
				case 404:
					this.message = 'Sorry, didn\'t find anything.';
					break;
				case 403:
					this.message = 'You have no rights here.';
					break;
				default:
					this.message = 'Ooops, I\'ve got an error.';
					break;
			}
		}
	}
}

module.exports = HtmlError;