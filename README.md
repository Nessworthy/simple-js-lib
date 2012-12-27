Simple Javascript Library
=============

Easy to use, lightweight (in theory) and awesome.

How to Use:
-----------

+ In app.js, create your own module by extending 'modules'. I.e. modules.myModule = function() {...}
+ + Modules should expect one parameter for module configurations outside of the application. I.e. elements the moudule should affect.
+ + Modules should return TRUE or FALSE, depending on whether the module is/was able to be useful or not.
+ + For logging, use: log([string]ModuleName, [Mixed]Message, [Optional String]Type{log,info,warn,warning})
+ You can create your own global app settings and access them by using the settings variable.

To Do:
-----------

+ Add a method to import/inject modules into the application.
+ Add a method to load a module from the global scope.
+ Add a detailed how to guide.
