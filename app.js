function App(options) {
	
	// Default config
	var defaultSettings = {
		// Handles bind() and call() options.
		'globalFunctions': {
			// If a bound function already exists with the same name, overwrite it? If not, bind() will return false.
			'bindOverwrite' : true
		},
		// Handles everything to do with app debugging.
		'debug': {
			// Enable debugging? (outputted via console) 
			'enabled': true,
			// Prefixes all logged calls.
			'nameSpace': 'app',
			// Namespace for all helper methods and core functions.
			'nameSpaceCore': 'core',
			// Separator for app namespaces.
			'nameSpaceSeparator': '.'
		}
	}
	
	// Define storage
	
	var modules = {};
	var functions = {};
	var events = {};
	var settings = {};
	
	// Define core functions
	
	/**
	 * Bind - Binds a global function to the app, usable by other modules.
	 * @param {String} fn_name The function name, used to call it.
	 * @param {Object} fn The function itself. Options are passed via. the first parameter as an object.
	 * @return {Boolean} TRUE if the bind was a success. FALSE if not.
	 */
	function bind (fn_name, fn) {
		if(typeof fn_name == 'string') {
			if(typeof fn == 'object') {
				
			}
		} else {
			log([settings.debug.nameSpaceCore,'bind'], 'error', '');
		}
	}
	
	function call (fn_name, options) {
		
	}

	/**
	 * Outputs a message to the console (if enabled).
	 * @param {Mixed} moduleName A string containing the modules name, or an indexed array containing strings.
	 * @param {Mixed} message The message to log. This can pretty much be anything.
	 * @param {String} type The type of error. Directly relates to the console's log type. e.g. 'info'. Optional
	 * @return {Boolean} TRUE if the log was successful, FALSE if not (log disabled).
	 */
	function log(moduleName, message, type) {
		
		debugSettings = settings.debug;
		
		if(debugSettings.enabled === true) {
			
			if(typeof moduleName == 'object') {
				moduleName = moduleName.join(debugSettings.nameSpaceSeparator);
			}
			
			if(typeof type == 'undefined' || type === null || type === false) {
				type = 'log';
			}
			
			console[type](debugSettings.nameSpace+debugSettings.nameSpaceSeparator+moduleName,message);
			return true;
		}
		
		return false;
		
	}

	// Define helper methods
	
}
