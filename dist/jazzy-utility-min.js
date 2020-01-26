(function(a){"function"==typeof define&&define.amd?define(a):a()})(function(){'use strict';var a=Math.ceil,b=function(a,b){if(!Array.isArray(a))return!1;var c=a.findIndex(function(a){return b===a});return-1===c?-1:(a.splice(c,1),c)},c=0,d=function(b,c){var d=Math.floor,e=a(b),f=d(c);return d(Math.random()*(f+1-e))+e},e=function(b,c){if(!Array.isArray(c)||1>c.length)throw new Error("First argument must be an array with at least one element in it");if("number"!=typeof b||1<b)throw new Error("Multiplier must be a number between 0 and 1");for(var e=[],f=a(c.length*b),g=0;g<f;g++){var h=d(0,c.length-1),j=c.splice(h,1)[0];e.push(j)}return e},f=function(a){return function(b,d){a.run(b,d.next)}},g=function(a){return function(b,d){setTimeout(function(){a(b,d)},0)}},h=function(a){return function(b,d){try{a(b,d)}catch(a){d.next(b)}}},i=function(a){if("function"==typeof a)return{action:a,details:{action:a}};if(a&&"function"==typeof a.action)return{action:a.action,details:a};if(a&&a.action&&"function"==typeof a.action.run)return{action:f(a.action),details:a};if(a&&"function"==typeof a.run)return{action:f(a),details:{action:a}};throw SyntaxError("Task in incorrect syntax",a)},j=function(a){if(a.details.options){var b=a.action;return a.details.options.unblock&&(b=g(b)),a.details.options.skipError&&(b=h(b)),b}return a.action},k=function(a){var b=i(a);return b.action=j(b),b},l=function(a){var b=[],c=[];return a.forEach(function(a){var d=k(a),e=d.action,f=d._details;b.push(e),c.push(f)}),{details:c,actions:b}};module.exports={forEachCallbacks:function(a,b,c){if(!Array.isArray(a))throw new TypeError;var d=0,e=function e(){d<a.length?b(a[d],d++,e):c&&c()};e()},doAll:function(a,b,c){if(!Array.isArray(a))throw new TypeError;if(0===a.length)return void(c&&c());var d=0,e=function(){++d===a.length&&c&&c()};a.forEach(function(a,c){b(a,c,e)})},deleteArrayEl:b,Stash:function(){this._stash={},this.generateId=function(){return"id_".concat(c++)},this.put=function(a){var b=this.generateId();return this._stash[b]=a,b},this.take=function(a){var b=this._stash[a];return this._stash[a]&&delete this._stash[a],b},this.see=function(a){return this._stash[a]},this.clear=function(){this._stash={}},this.iterate=function(a){var b=this;Object.keys(this._stash).forEach(function(c){a(b._stash[c],c)})},this.isEmpty=function(){return 0===Object.keys(this._stash).length},this.replace=function(a,b){this._stash[a]=b},this.size=function(){return Object.keys(this._stash).length}},randomEl:function(a){if(!Array.isArray(a))throw new TypeError("randomEl input must be of type Array");if(0===a.length)throw new Error("randomEl cannot accept an empty array");return a[d(0,a.length-1)]},randomEls:function(a,b){if(!Array.isArray(b)||1>b.length)throw new Error("First argument must be an array with at least one element in it");return e(a,b.slice(0))},randomInt:d,Workflow:function(a){{var b=a?l(a):{details:[],actions:[]},c=b.details,d=b.actions;this._details=c,this._actions=d}this.run=function(a,b){var c=this,d=0,e={};e.next=function(a){d<c._actions.length?c._actions[d++](a,e,d):d===c._actions.length&&(d++,b&&b(a))},e.exit=function(a){d<c._actions.length&&(d=c._actions.length,e.next(a))},e.abort=function(){d=c._actions.length+1},e.next(a)},this._insertAtIndex=function(a,b){var c=k(b),d=c.details,e=c.action;this._details.splice(a,0,d),this._actions.splice(a,0,e)},this.add=function(a){var b=k(a),c=b.details,d=b.action;return this._actions.push(d),this._details.push(c),this._actions.length},this.insertBefore=function(a,b){var c=this._details.findIndex(a);return-1!==c&&this._insertAtIndex(c,b),c},this.insertAfter=function(a,b){var c=this._details.findIndex(a);return-1===c?-1:(this._insertAtIndex(c+1,b),c+1)},this.findAndDelete=function(a){var b=this._details.findIndex(a);return-1!==b&&(this._actions.splice(b,1),this._details.splice(b,1)),b}},extractRandomEls:e,arrayDelete:b,store:{}}});
