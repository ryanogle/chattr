var corejs;
if (process.env.NODE_ENV === 'production'){
	corejs = '/javascripts/core_prod.js';
} else if (process.env.NODE_ENV === 'development'){
	corejs = '/javascripts/core_dev.js';
}


module.exports = function(assets) {
	assets.root = __dirname;

	/*----------------
	* javascript files
	-----------------*/
	// common
	assets.addJs(corejs, 'common');

	/*----------------
	* css files
	-----------------*/
	// common
	assets.addCss('/css/app.css', 'common');
}
