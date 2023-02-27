(function (XHR) {
	const open = XHR.prototype.open;
	XHR.prototype.open = function (method, url, async, user, pass) {
		this._url = url;
		if (url.indexOf('gstatic.com') !== -1 || url.indexOf('docs.google.com') !== -1) {
			url = '/corsProxy?base64Url=' + btoa(url);
		}
		open.call(this, method, url, async, user, pass);
	};
})(XMLHttpRequest);

(function () {
	const script = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).pop();
	const URL = script.getAttribute('form');
	const xhr = new XMLHttpRequest();
	xhr.open('GET', URL);
	xhr.onload = function () {
		document.write(xhr.response);
	};
	xhr.send();
})();
