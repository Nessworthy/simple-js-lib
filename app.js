/**
 * App - Default lightweight framework for small JS applications.
 * @author Sean Nessworthy 
 */
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
		},
		// Default module list. Use this for constant core modules.
		'moduleList' : ['testModule']
	}
	
	// Define storage
	
	var modules = {};
	var functions = {};
	var events = {};
	var settings = {};
	
	// MODULES
	
	modules.testModule = function() {
		watch('test',function() {alert('hello!')});
		fire('test');
		
		return true;
	}
	
	// Define core functions
	
	/**
	 * Bind - Binds a global function to the app, usable by other modules.
	 * @param {String} fn_name The function name, used to call it.
	 * @param {Object} fn The function itself. Options are passed via. the first parameter as an object.
	 * @return {Boolean} TRUE if the bind was a success. FALSE if not.
	 */
	function bind (fn_name, fn) {
		
		var logName = [settings.debug.nameSpaceCore,'bind'];
		
		if(typeof fn_name == 'string') {
			if(typeof fn == 'function') {
				
				allowedToOverwrite = settings.globalFunctions.bindOverWrite;
				functionExists = false;
				
				if(typeof functions[fn_name] == 'function') {
					functionExists = true;
				}
				
				if(!functionExists || (functionExists && allowedToOverwrite === true)) {
					functions[fn_name] = fn;
					return true;
				} else {
					log(logName, 'A function already exists called '+fn_name+', and the app does not have permission to overwrite.', 'error');
				}
				
			} else {
				log(logName, ['fn parameter passed needs to be a function.',fn], 'error');
			}
		} else {
			log(logName, ['Function name needs to be a string.',fn_name], 'error');
		}
		
		return false;
		
	}
	
	/**
	 * Call - calls a globally bound function. Accepts a function name (string) and an options parameter.
	 * @param {String} fn_name The function name.
	 * @param {Mixed} options Any options you wish to pass directly into the function.
	 * @return {Mixed} FALSE if the function failed, or the function's return value.
	 */
	function call (fn_name, options) {
		var logName = [settings.debug.nameSpaceCore,'call'];
		
		if(typeof fn_name == 'string') {
				
			functionExists = false;
			
			if(typeof functions[fn_name] == 'function') {
				functionExists = true;
			}
			
			if(functionExists) {

				return functions[fn_name](options);
				
			} else {
				log(logName, 'A global function called '+fn_name+', doesn\'t exist, or hasn\'t been bound yet.', 'warn');
			}
			
		} else {
			log(logName, ['Function name needs to be a string.',fn_name], 'error');
		}
		
		return false;
	}

	/**
	 * Fire - Fires all callback triggers for a specific event.
	 * @param {String} trigger_name The event's name.
	 * @param {Mixed} details The event information. E.g. a specific element.
	 * @return {Boolean} TRUE if all triggers were fired. FALSE if not.
	 */
	function fire(trigger_name, details) {
		var logName = [settings.debug.nameSpaceCore,'fire'];
		
		if(typeof trigger_name == 'string') {
			if(typeof events[trigger_name] != 'undefined') {
				for(i=0;i<events[trigger_name].length;i++) {
					events[trigger_name][i](details);
				}
			}
			
			return true;
			
		} else {
			log(logName, ['trigger_name needs to be a string.',trigger_name], 'error');
		}
		
		return false;
		
	}

	/**
	 * Watch - Add a callback trigger for when an event is fired.
	 * @param {String} trigger_name A string containing the event's name.
	 * @param {Function} callback A function which is called when the event is fired.
	 * @return {Boolean} TRUE if the callback is successfully added. FALSE if not.
	 */
	function watch(trigger_name, callback) {
		var logName = [settings.debug.nameSpaceCore,'watch'];
		
		if(typeof trigger_name == 'string') {
			if(typeof callback == 'function') {
				
				if(typeof events[trigger_name] == 'undefined') {
					events[trigger_name] = [];
				}
				
				events[trigger_name].push(callback);
				
				return true;
				
			} else {
				log(logName, ['callback parameter required, expected a function.',callback], 'error');
			}
		} else {
			log(logName, ['trigger_name parameter required, expected a string.',trigger_name], 'error');
		}
		
		return false;
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

	function loadModule(module_name, module_data) {
		var logName = [settings.debug.nameSpaceCore,'loadModule'];
		
		console.group("Module: "+module_name)
		console.time('Load Time');
		if(typeof modules[module_name] == 'function') {
			try {
				
				result = modules[module_name](module_config);
				
				if(result === true) {
					log(logName,'Module loaded successfully.','info');
				} else if (result === false) {
					log(logName,'Module loaded, but discarded','info');
				} else {
					log(logName,'Module loaded, but did not return the expected information.','warn');
				}
			} catch (error) {
				log(logName,['Module has encountered an uncaught exception:', error],'error');
			}
		} else {
			log(logName,['Module failed to load:','Module not located'],'error');
		}
		console.timeEnd('Load Time');
		console.groupEnd("Module: "+module_name);
		
	}

	// Define helper methods
	
	// Core startup.
	
	settings = defaultSettings;
	
	// Load those modules, baby.
	for(var i=0; i < settings.moduleList.length; i++) {
		
		module_data = settings.moduleList[i];
		
		module_config = null;
		module_name = false;
		
		if(typeof module_data != 'string') {
			module_name = module_data[0];
			module_config = module_data[1];
		} else {
			module_name = module_data;
		}
		
		loadModule(module_name, module_config);
	}
	
}
