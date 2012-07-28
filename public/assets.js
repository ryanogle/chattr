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
	assets.addCss('/stylesheets/app.css', 'common');
}
