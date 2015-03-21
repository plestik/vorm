"use strict";!function(e,t){"function"==typeof define&&define.amd?define(["exports"],t):t("object"==typeof exports?exports:e.babelHelpers={})}(this,function(e){var t=e;t.slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e)){for(var r,n=[],o=e[Symbol.iterator]();!(r=o.next()).done&&(n.push(r.value),!t||n.length!==t););return n}throw new TypeError("Invalid attempt to destructure non-iterable instance")}});!function(){angular.module("vorm",[])}();!function(){angular.module("vorm").factory("ModelDelegate",[function(){return function(n){var e={};return e.value=void 0,e.getName=function(){return n},e}}])}();!function(){angular.module("vorm").factory("VormEvent",["$document","$window",function(t,n){var e;try{{new n.CustomEvent("foo")}e=function(t,e){return new n.CustomEvent(t,{detail:e})}}catch(o){e=function(n,e){var o=t[0].createEvent("CustomEvent");return o.initCustomEvent(n,!0,!0,e),o}}return e}])}();!function(){angular.module("vorm").factory("VormFieldCtrl",["VormEvent","VormValueType",function(e,n){return function(t,a){function u(e,n){var t=e.$viewChangeListeners,a=e.$modelValue;e.$viewChangeListeners=[],e.$modelValue=n,e.$$writeModelToScope(),e.listeners=t,e.$modelValue=a}function i(){a.dispatchEvent(new e("viewchange",{name:t})),_.invoke(c,"call",null,t)}function r(){a.dispatchEvent(new e("modelchange",{name:t})),_.invoke(s,"call",null,t)}var o={},l=[],c=[],s=[],d=n.SINGLE;return o.getName=function(){return t},o.setName=function(){t=arguments[0]},o.addModel=function(e){l.push(e),e.$viewChangeListeners.push(i),e.$formatters.push(r)},o.removeModel=function(e){_.pull(l,e),_.pull(e.$viewChangeListeners,i),_.pull(e.$formatters,r)},o.getModels=function(){return l},o.getValue=function(){var e;switch(d){case n.SINGLE:e=l[0]?l[0].$modelValue:void 0;break;case n.LIST:e=_.pluck(l,"$modelValue");break;case n.NAMED:e={},_.each(l,function(n){e[n.$name]=n.$modelValue})}return e},o.getValueType=function(){return d},o.setValueType=function(e){if(-1===[n.SINGLE,n.LIST,n.NAMED].indexOf(e))throw new Error("Unsupported VormValueType: "+n);d=e},o.setValue=function(e){switch(d){case n.SINGLE:l[0]&&u(l[0],e);break;case n.LIST:_.each(l,function(n,t){u(n,e[t])});break;case n.NAMED:var t=l.concat();_.each(e,function(e,n){var a=_.find(l,{$name:n});a&&u(a,e),_.pull(t,a)}),_.each(t,function(e){u(e,void 0)})}},o.viewChangeListeners=c,o.modelChangeListeners=s,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=e.substr(0,1).toUpperCase()+e.substr(1),t="is"+n,a="$"+e,u="set"+n,i=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";o[t]=function(){return l[i](function(e){return e[a]})},"valid"!==i&&"invalid"!==i&&(o[u]=function(){var e=arguments;l.forEach(function(n){n["$"+u].apply(n,e)})})}),o}}])}();!function(){angular.module("vorm").constant("VormValueType",{SINGLE:"single",LIST:"list",NAMED:"named"})}();var babelHelpers=require("./helpers.js");!function(){angular.module("vorm").directive("ngModel",["VormFieldCtrl",function(e){return{require:["ngModel","^?vormField","^?vormForm"],link:function(r,o,l,n){var d=babelHelpers.slicedToArray(n,3),i=d[0],t=d[1],u=d[2];(t||u)&&(t||(t=new e(l.ngModel,o[0]),u.addField(t),r.$on("$destroy",function(){u.removeField(t)})),t.addModel(i),r.$on("$destroy",function(){t.removeModel(i)}))}}}])}();!function(){angular.module("vorm").directive("vormChange",["$parse",function(n){return{link:function(e,i,r){function a(n,i){o(e,{$event:n,$name:i})}var o;o=n(r.vormChange),i.bind("viewchange",a)}}}])}();var babelHelpers=require("./helpers.js");!function(){angular.module("vorm").directive("vormField",["VormFieldCtrl",function(e){return{scope:!0,require:["vormField","^?vormForm"],controller:["$scope","$element","$attrs",function(r,l,o){var n=r.$eval(o.vormField)||o.ngModel;angular.extend(this,new e(n,l[0]))}],controllerAs:"vormField",link:function(e,r,l,o){var n=babelHelpers.slicedToArray(o,2),i=n[0],t=n[1];t&&(t.addField(i),e.$on("$destroy",function(){t.removeField(i)}))}}}])}();!function(){angular.module("vorm").directive("vormFieldTemplate",["vormTemplateService","VormValueType",function(e,t){return{restrict:"E",require:["vormFieldTemplate","vormField","vormModelList"],template:e.getDefaultTemplate(),replace:!0,controller:["$scope","$attrs",function(l,r){var a,n,o,i=this,m=l.$eval(r.config)||{};if(m=_.defaults(angular.copy(m),{name:r.name,type:r.type,label:r.label,template:l.$eval(r.label)}),!m.name||!m.type)throw new Error("Missing one of required arguments: name, type ");a=e.getModelCompiler(m.type,m.modelTemplate),i.link=function(e){n=e[0],o=e[1],n.setName(m.name),m.limit>1&&n.setValueType(t.LIST),o.addDelegate()},i.getLabel=function(){return m.label},i.getModelCompiler=function(){return a},i.getInputData=function(){return m.data}}],controllerAs:"vormFieldTemplate",link:function(e,t,l,r){r[0].link(r.slice(1))}}}])}();!function(){angular.module("vorm").directive("vormForm",[function(){return{scope:!0,require:["form"],controller:["$element",function(e){function n(){l=_(u).indexBy(function(e){return e.getName()}).mapValues(function(e){return e.getValue()}).value(),Object.freeze(l)}function t(){var e=arguments;n(),_.each(o,function(n){n.apply(r,e)})}function i(){n()}var r=this,u=[],o=[],s=[],l={};return r.addField=function(e){u.push(e),e.viewChangeListeners.push(t),e.modelChangeListeners.push(i),n()},r.removeField=function(e){_.pull(u,e),_.pull(e.viewChangeListeners,t),_.pull(e.modelChangeListeners,i),n()},r.getFields=function(){return u},r.getValues=function(){return l},r.changeListeners=o,r.submitListeners=s,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=e.substr(0,1).toUpperCase()+e.substr(1),t="is"+n,i="set"+n,o=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";r[t]=function(){return u[o](function(e){return e[t]()})},"valid"!==e&&"invalid"!==e&&(r[i]=function(){var e=arguments;u.forEach(function(n){n[i].apply(n,e)})})}),e.bind("submit",function(){_.invoke(s,"call",null,l)}),r}],controllerAs:"vormForm"}}])}();var babelHelpers=require("./helpers.js");!function(){angular.module("vorm").directive("vormInput",[function(){return{require:["^?vormFieldTemplate"],scope:{modelDelegate:"&",config:"&",type:"&"},controllerAs:"vormInput",link:function(e,r,o,l,n){var t=babelHelpers.slicedToArray(l,1),i=t[0];if(i)r.replaceWith(i.getModelCompiler()(e));else{if(!n)throw new Error("vormInput needs either a transclude function or vormFieldGenerator.");n(function(e){r.replaceWith(e)})}}}}])}();!function(){angular.module("vorm").directive("vormModelList",["ModelDelegate",function(e){return{controller:[function(){var t=this,n=[];t.getDelegates=function(){return n},t.clearDelegate=function(e){1===n.length?e.value=void 0:_.pull(n,e)},t.addDelegate=function(t){var l;t||(t=n.length.toString()),l=new e(t),n.push(l)}}],controllerAs:"vormModelList"}}])}();var babelHelpers=require("./helpers.js");!function(){angular.module("vorm").directive("vormSubmit",["$parse",function(e){return{require:["vormForm"],link:function(r,i,u,n){function l(){o(r,{$values:t.getValues()})}var o,a=babelHelpers.slicedToArray(n,1),t=a[0];o=e(u.vormSubmit),i.bind("submit",l)}}}])}();!function(){angular.module("vorm").provider("vormTemplateService",[function(){var e,t={},l={},n={};return e='\n				<div class="vorm-field"\n					ng-class="vormField.getClassObj()"\n					vorm-field\n					vorm-model-list\n				>\n					<div class="vorm-field-label">\n						{{vormFieldTemplate.getLabel()}}\n					</div>\n					\n					<ul class="vorm-input-list">\n						<li class="vorm-input" ng-repeat="model in vormModelList.getDelegates()">\n							<vorm-input data-type="vormFieldTemplate.getInputType()" data-config="vormFieldTemplate.getInputData()" model-delegate="model"></vorm-input>\n							<button class="vorm-input-clear" type="button" ng-click="vormModelList.clearDelegate(model)">\n							</button>\n						</li>\n					</ul>\n					\n					<div class="vorm-field-status">\n						\n					</div>\n				</div>\n			',l.text='<input type="text" placeholder="{{vormFieldTemplate.getPlaceholder()}}"/>',{$get:function(o){return t.getDefaultTemplate=function(){return e},t.getModelCompiler=function(e,t){var l;if(l=t?o(t):n[e],!l)throw new Error("Model template for "+e+" not found");return l},n=_.mapValues(l,function(e){var t=angular.element(e);return t.attr("ng-model","model.value"),o(t)}),t},$inject:["$compile"]}}])}();
