module.exports = function(assets) {
	assets.root = __dirname;

	/*----------------
	* javascript files
	-----------------*/
	// common
	assets.addJs('/javascripts/app.js', 'common');

	/*----------------
	* css files
	-----------------*/
	// common
	assets.addCss('/css/app.css', 'common');
}
