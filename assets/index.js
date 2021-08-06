if (navigator.serviceWorker) {
	navigator.serviceWorker.register('/push.js', {
		scope: '/'
	}).then(() => {
		console.log('Service worker running');
	}).catch(err => {
		console.log(err);
	});
} else {
	//
}