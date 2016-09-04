/*
 Comman - special tool to register function callback
 Copyright (c) 2016 Vladimir Minkin <vladimir.minkin@gmail.com>
 Your reuse is governed by the Creative Commons Attribution 3.0 License
 */
Comman = (function(){
   var comman    = {};
   var commands  = {};

   comman.handle = function(commandName, handlerFunction){
      var commandHandler = {
         handlerFunction: handlerFunction
      };
      commands[commandName] = commandHandler;
   };

   comman.execute = function(){
      var args = Array.prototype.slice.call(arguments);
      var name = args.shift();
      var cmd = commands[name];
      if (cmd) {
         let defer = Q.defer();
         cmd.handlerFunction.apply(defer, args);
         return defer.promise;
      } else {
         throw new Error("No command with name:", name);
         return null;
      }
   };
   return comman;
})();
