exports.PORT = 6969;
// check for dev flag and set port to 42069
if (!process.argv.includes('dev')) {
	exports.PORT = 42069;
}
