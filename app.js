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
			'allowOverwrite' : true
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
		// Handles modules
		'modules': {
			// If enabled, any additional modules added via loadModule will overwrite any existing ones.
			'allowOverwrite' : true,
			// If TRUE, any mods imported using app.addModule will be automatically loaded.
			'autoLoadOnImport': false,
			// If TRUE, all modules loaded with this application will be autoloaded on startup.
			'autoLoadOnStart': false
		},
		// Default module list. Use this for constant core modules.
		'moduleList' : []
	}
	
	// Define storage
	
	var modules = {};
	var functions = {};
	var events = {};
	var settings = {};
	var addedModules = [];
	
	// MODULES
	// (not order specific)
	
	
	
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
				
				var allowedToOverwrite = settings.globalFunctions.allowOverwrite;
				var functionExists = false;
				
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
				
			var functionExists = false;
			
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
	 * @return {Boolean} TRUE if all triggers were fired. FALSE if not
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
		
		var debugSettings = settings.debug;
		
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

	/**
	 * loadModule - Loads a module (executes it's code).
	 * @param {String} module_name The module's name.
	 * @param {Mixed} module_config Any module options that should be passed to the module.
	 */
	function loadModule(module_name, module_config) {
		
		var logName = [settings.debug.nameSpaceCore,'loadModule'];
		
		console.group("Module: "+module_name)
		console.time('Load Time');
		if(typeof modules[module_name] == 'function') {
			
			try {
				
				var result = modules[module_name](module_config);
				
				if(result === true) {
					log(logName,'Module loaded successfully.','info');
				} else if (result === false) {
					log(logName,'Module loaded, but discarded.','info');
				} else {
					log(logName,'Module loaded, but did not return the expected information.','warn');
				}
				
			} catch (error) {
				log(logName,['Module has encountered an uncaught exception', error],'error');
			}
			
		} else {
			log(logName,['Module failed to load:','Module not located'],'error');
		}
		console.timeEnd('Load Time');
		console.groupEnd("Module: "+module_name);
		
	}
	
	/**
	 * importModule - Adds a module to the module list. This does NOT trigger autoload on its own.
	 * @param {String} moduleName The module name.
	 * @param {Function} module The module. 
	 * @return {Boolean} TRUE if import was successful, FALSE if not.
	 */
	function importModule(moduleName, module) {
		var logName = [settings.debug.nameSpaceCore,'importModule'];
		
		if(typeof moduleName == 'string') {
		
			if(typeof module == 'function') {
				
				var moduleExists = false;
				
				if(typeof modules[moduleName] == 'function') {
					moduleExists = true;
				}				

				if(!moduleExists || settings.modules.allowOverwrite === true) {
					modules[moduleName] = module;
					return true;
				} else {
					log(logName,'Could not import module because a module exists by the name of '+moduleName+'. Check your module overwrite settings.','error');
				}
				
			} else {
				log(logName,['module expected a function.',module],'error');
			}
			
		} else {
			log(logName,['moduleName expected a string.',moduleName],'error');
		}
		
		return false;
	}

	/**
	 * addModuleToQueue - Does exactly what it says on the tin.
	 * @param {String} moduleName The module name.
	 * @param {Mixed} moduleConfig Any config settings passed to the module.
	 * @return {Boolean} TRUE if successful, FALSE if not.
	 */
	function addModuleToQueue(moduleName, moduleConfig) {
		var logName = [settings.debug.nameSpaceCore,'addModuleToQueue'];
		
		if(typeof moduleName == 'string') {
			
			var moduleExists = false;
			
			if (getModulePositionInQueue(moduleName) !== false) {
				moduleExists = true;
			}
			
			if(!moduleExists || settings.modules.allowOverwrite === true) {
				
				var index;
				
				if(moduleExists) {
					removeModuleFromQueue(moduleName);
				}
				
				// Add. Also, make sure config is null if non-existant.
				if(typeof moduleConfig == 'undefined') {
					moduleConfig = null;
				}
				
				addedModules.push({name: moduleName, config: moduleConfig});
			
				return true;
				
			} else {
				log(logName,'Could not add '+moduleName+' to queue. The module already exists and cannot be overwritten with the current settings.','error');
			}
			
		} else {
			log(logName,['moduleName expected a string.',moduleName],'error');
		}
		
		return false;
		
	}

	/**
	 * loadAllModulesFromQueue - Self explanitory. 
	 */
	function loadAllModulesFromQueue() {
		var logName = [settings.debug.nameSpaceCore,'loadAllModulesFromQueue'];
		while(addedModules.length > 0) {
			
			var module = addedModules[0];
			
			loadModule(module.name,module.config);
			
			// Passing the index is faster.
			if(removeModuleFromQueue(0) !== true) {
				log(logName,'Could not remove module '+moduleName+' from the queue. Recursion prevented.','error');
				break;
			}
			
		}
	}

	/**
	 * removeModuleFromQueue
	 * @param {Mixed} module Either an index (queue) number or the module name. 
	 * @return {Boolean} TRUE if successful, FALSE if not.
	 */
	function removeModuleFromQueue(module) {
		var logName = [settings.debug.nameSpaceCore,'removeModuleFromQueue'];
		var returnVal = false;
		
		if (typeof module == 'number') {
			if (typeof addedModules[module] != 'undefined') {
				returnVal = true;
				addedModules.splice(module,1);
			} else {
				returnVal = false;
				log(logName,'Could not find module queue position '+moduleName+' in the queue.','warn');
			}
		} else if (typeof module == 'string') {
			
			// So here we need to iterate through the queue and find the module by name.
			
			var index = getModulePositionInQueue(module);
			
			if(index !== false) {
				returnVal = true;
				addedModules.splice(index,1);
			} else {
				log(logName,'Could not find module '+moduleName+' in the queue.','warn');
			}
			
		} else {
			log(logName,['module expected an int or a string.',module],'error');
		}
		
		return returnVal;
		
	}

	/**
	 * getModulePositionInQueue - Takes a module's name and attempts to find where it is in the queue.
	 * @param {String} moduleName The module's name. 
	 * @return {Mixed} an int with the index if it can be found, FALSE if it cannot.
	 */
	function getModulePositionInQueue(moduleName) {
		
		var logName = [settings.debug.nameSpaceCore,'getModulePositionInQueue'];
		
		if (typeof moduleName == 'string') {

			for(var i=0,queue=addedModules;i<queue.length;i++) {
					
				var mod = queue[i];
	
				if(mod.name == moduleName) {
					return i;
				} else {
					continue;
				}
			}
		
		} else {
			log(logName,['moduleName expected a string.',moduleName],'error');
		}
		
		return false;
		
	}

	/**
	 * loadModuleFromQueue - Self explanatory.
	 * @param {String} moduleName the module's name. 
	 */
	function loadModuleFromQueue(moduleName) {
		// TODO: Log name, test if string.
		
		var index = getModulePositionInQueue(moduleName);
		
		if(index !== false) {
			
			// If true?
			loadModule(moduleName, addedModules[index].config);
			removeModuleFromQueue(index);
			
		}
	}

	// Public methods.
	
	/**
	 * addModule - Adds a module to the application. Optional support for auto loading.
	 * @param {String} moduleName The module's name.
	 * @param {Function} module The module.
	 * @param {Mixed} autoLoad Pass TRUE or FALSE to force autoload of module or not, pass null to fallback to settings.
	 * @param {Mixed} config Optional configuration settings to pass to the module.
	 * @param {Boolean} autoLoad Whether to autoload the module or not (optional, default = NULL (relies on setting))
	 */
	this.addModule = function(moduleName, module, autoLoad, config) {
		
		if(typeof config == 'undefined') {
			config = null;
		}
		
		var logName = [settings.debug.nameSpaceCore,'addModule'];
		
		if(typeof moduleName == 'string') {
		
			if(typeof module == 'function') {

				if(autoLoad !== true && autoLoad !== false) {
					autoLoad = null;
				}
		
				// Import it!
				result = importModule(moduleName,module);
				
				if(result === true) {
					
					log(logName,'Module '+moduleName+' imported!', 'info');
					
					// Are we autoloading?
					if(autoLoad === true || (settings.modules.autoLoadOnImport === true && autoLoad !== false)) {
						
						// Load it.
						loadModule(moduleName, config);
						
					} else {
						
						addModuleToQueue(moduleName, config);
						
					}
					
				} else {
					log(logName,'Module '+moduleName+' was not imported.', 'error');
				}
				
			} else {
				log(logName,['module expected a function.',module],'error');
			}
			
		} else {
			log(logName,['moduleName expected a string.',moduleName],'error');
		}
		
	}
	
	/**
	 * loadModules - self explanatory! 
	 */
	this.loadModules = function() {
		loadAllModulesFromQueue();
	}

	// Core startup!
	
	settings = defaultSettings;
	
	// Load those modules, baby! (or add them to the queue to load)
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
			
		addModuleToQueue(module_name, module_config);
		
	}
	
	if(settings.modules.autoLoadOnStart === true) {
		
		loadAllModulesFromQueue();
			
	}
	
}
