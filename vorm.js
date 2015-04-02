"use strict";var babelHelpers={};babelHelpers.slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r)){for(var t,a=[],n=r[Symbol.iterator]();!(t=n.next()).done&&(a.push(t.value),!e||a.length!==e););return a}throw new TypeError("Invalid attempt to destructure non-iterable instance")};!function(){angular.module("vorm",[])}();!function(){angular.module("vorm").factory("VormEvent",["$document","$window",function(t,n){var e=void 0;try{{new n.CustomEvent("foo")}e=function(t,e){return new n.CustomEvent(t,{detail:e,bubbles:!0})}}catch(o){e=function(n,e){var o=t[0].createEvent("CustomEvent");return o.initCustomEvent(n,!0,!0,e),o}}return e}])}();!function(){angular.module("vorm").factory("VormFieldCtrl",["VormEvent","VormValueType",function(e,n){return function(t,i){function u(e,n){var t=e.$viewChangeListeners,i=e.$modelValue;e.$viewChangeListeners=[],e.$modelValue=n,e.$$writeModelToScope(),e.listeners=t,e.$modelValue=i}function r(){i.dispatchEvent(new e("viewchange",{name:t})),_.invoke(l,"call",null,t)}function a(){i.dispatchEvent(new e("modelchange",{name:t})),_.invoke(s,"call",null,t)}var o={},c=[],l=[],s=[],d="vorm-field-",f=n.SINGLE,v=void 0;o.getName=function(){return t},o.setName=function(){t=arguments[0]},o.addModel=function(e){c.push(e),e.$viewChangeListeners.push(r),e.$formatters.push(a)},o.removeModel=function(e){_.pull(c,e),_.pull(e.$viewChangeListeners,r),_.pull(e.$formatters,a)},o.getModels=function(){return c},o.getValue=function(){var e=void 0;switch(f){case n.SINGLE:e=c[0]?c[0].$modelValue:void 0;break;case n.LIST:e=_.pluck(c,"$modelValue");break;case n.NAMED:e={},_.each(c,function(n){e[n.$name]=n.$modelValue})}return e},o.getValueType=function(){return f},o.setValueType=function(e){if(-1===[n.SINGLE,n.LIST,n.NAMED].indexOf(e))throw new Error("Unsupported VormValueType: "+n);f=e},o.setValue=function(e){switch(f){case n.SINGLE:c[0]&&u(c[0],e);break;case n.LIST:_.each(c,function(n,t){u(n,e[t])});break;case n.NAMED:var t=c.concat();_.each(e,function(e,n){var i=_.find(c,{$name:n});i&&u(i,e),_.pull(t,i)}),_.each(t,function(e){u(e,void 0)})}},o.isRequired=function(){return v},o.setRequired=function(){v=!!arguments[0]},o.isEmpty=function(){return c.every(function(e){return e.$isEmpty()})};var m=_("valid invalid dirty pristine touched untouched required empty".split(" ")).map(function(e){return d+e}).zipObject().mapValues(function(e,n){var t=n.substr(d.length);return o["is"+_.capitalize(t)]()}).each(function(){});return o.getClassObj=function(){return m.value()},o.viewChangeListeners=l,o.modelChangeListeners=s,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=_.capitalize(e),t="is"+n,i="$"+e,u="set"+n,r=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";o[t]=function(){return c[r](function(e){return e[i]})},"valid"!==e&&"invalid"!==e&&(o[u]=function(){var e=arguments;c.forEach(function(n){n["$"+u].apply(n,e)})})}),o}}])}();!function(){angular.module("vorm").factory("VormModelDelegate",[function(){return function(e){var n={},t=void 0;return n.value=void 0,n.getName=function(){return e},n.setNgModel=function(){t=arguments[0]},n.getNgModel=function(){return t},n.clearValue=function(){t.$setViewValue(void 0),t.$render()},n}}])}();!function(){angular.module("vorm").factory("VormModelListCtrl",["VormModelDelegate",function(e){return function(){var t=this,n=[];t.getDelegates=function(){return n},t.clearDelegate=function(e){1===n.length?e.clearValue():_.pull(n,e)},t.addDelegate=function(t){var l=void 0;t||(t=n.length.toString()),l=new e(t),n.push(l)}}}])}();!function(){angular.module("vorm").constant("VormValueType",{SINGLE:"single",LIST:"list",NAMED:"named"})}();!function(){angular.module("vorm").directive("ngModel",["VormFieldCtrl",function(e){return{require:["ngModel","^?vormField","^?vormForm","^?vormInput"],link:function(o,r,n,d){var l=babelHelpers.slicedToArray(d,3),i=l[0],t=l[1],u=l[2];(t||u)&&(t||(t=new e(n.ngModel,r[0]),u.addField(t),o.$on("$destroy",function(){u.removeField(t)})),t.addModel(i),o.$on("$destroy",function(){t.removeModel(i)}))}}}])}();!function(){angular.module("vorm").directive("vormChange",["$parse",function(n){return{link:function(e,a,i){function r(n,a){t(e,{$event:n,$name:n.detail?n.detail.name:a})}var t=n(i.vormChange);a.bind("viewchange",r)}}}])}();!function(){angular.module("vorm").directive("vormField",["VormFieldCtrl",function(e){return{scope:!0,require:["vormField","^?vormForm"],controller:["$scope","$element","$attrs",function(r,o,l){var n=r.$eval(l.vormField)||l.ngModel,i=this;angular.extend(i,new e(n,o[0]))}],controllerAs:"vormField",link:function(e,r,o,l){var n=babelHelpers.slicedToArray(l,2),i=n[0],t=n[1];t&&(t.addField(i),e.$on("$destroy",function(){t.removeField(i)}))}}}])}();!function(){angular.module("vorm").directive("vormFieldTemplate",["vormTemplateService","VormValueType","VormModelListCtrl","vormInvoke",function(e,t,a,l){var r=angular.element(e.getDefaultTemplate()),n=angular.element(e.getDefaultControlTemplate());angular.element(r[0].querySelectorAll("vorm-control")).append(n);var o=r[0].outerHTML;return{scope:!0,restrict:"E",require:["vormFieldTemplate","vormField","^?vormForm"],template:o,replace:!0,controller:["$scope","$attrs",function(r,n){var o=this,u=new a,i=[],m=r.$eval(n.config)||{},d=void 0,p=void 0,g=void 0;if(m=_.defaults(angular.copy(m),{name:n.name,type:n.type,label:n.label,template:r.$eval(n.template),required:r.$eval(n.required),data:r.$eval(n.data)||{}}),!m.name||!m.type)throw new Error("Missing one of required arguments: name, type ");d=e.getModelCompiler(m.type,m.modelTemplate),o.link=function(e){p=e[0],g=e[1],p.setName(m.name),m.limit>1&&p.setValueType(t.LIST),p.setRequired(m.required||!1),u.addDelegate()},o.getLabel=function(){return m.label},o.getModelCompiler=function(){return d},o.getInputData=function(){return m.data},o.getInvokedData=function(e){var t=void 0;return g?t=g.getValues():(t={},t[p.getName()]=p.getValue()),l(o.getInputData()[e],{$values:t})},o.addInput=function(e){i.push(e)},o.removeInput=function(e){_.pull(i,e)},o.getInputs=function(){return i},o.getLastInputId=function(){var e,t=_.last(i);return t&&(e=t.getInputId()),e},o.getDelegates=u.getDelegates,o.addDelegate=u.addDelegate,o.clearDelegate=u.clearDelegate}],controllerAs:"vormFieldTemplate",link:function(e,t,a,l){l[0].link(l.slice(1))}}}])}();!function(){angular.module("vorm").directive("vormFieldWrapper",["vormTemplateService",function(e){var r=angular.element(e.getDefaultTemplate());r.find("vorm-control").append("<ng-transclude></ng-transclude>");var t=r[0].outerHTML;return{restrict:"A",transclude:!0,template:t,replace:!0,controller:["$attrs",function(e){var r=this;r.getLabel=function(){return e.label}}]}}])}();!function(){angular.module("vorm").directive("vormFieldset",[function(){return{restrict:"E",template:'\n					<fieldset>\n						<vorm-field-template config="field" ng-repeat="field in vormFieldset.getFields()">\n						</vorm-field-template>\n					</fieldset>\n				',scope:{fields:"&"},replace:!0,controller:["$scope",function(e){var t=this;t.getFields=e.fields}],controllerAs:"vormFieldset"}}])}();!function(){angular.module("vorm").directive("vormForm",[function(){return{scope:!0,require:["form"],controller:["$element",function(e){function n(){l=_(u).indexBy(function(e){return e.getName()}).mapValues(function(e){return e.getValue()}).value(),Object.freeze(l)}function t(){var e=arguments;n(),_.each(o,function(n){n.apply(r,e)})}function i(){n()}var r=this,u=[],o=[],s=[],l={};return r.addField=function(e){u.push(e),e.viewChangeListeners.push(t),e.modelChangeListeners.push(i),n()},r.removeField=function(e){_.pull(u,e),_.pull(e.viewChangeListeners,t),_.pull(e.modelChangeListeners,i),n()},r.getFields=function(){return u},r.getValues=function(){return l},r.changeListeners=o,r.submitListeners=s,"valid invalid dirty pristine touched untouched".split(" ").forEach(function(e){var n=e.substr(0,1).toUpperCase()+e.substr(1),t="is"+n,i="set"+n,o=-1!==["valid","pristine","untouched"].indexOf(e)?"every":"some";r[t]=function(){return u[o](function(e){return e[t]()})},"valid"!==e&&"invalid"!==e&&(r[i]=function(){var e=arguments;u.forEach(function(n){n[i].apply(n,e)})})}),e.bind("submit",function(){_.invoke(s,"call",null,l)}),r}],controllerAs:"vormForm"}}])}();!function(){angular.module("vorm").directive("vormInput",[function(){return{require:["vormInput","^vormField","^vormFieldTemplate"],controller:["$scope",function(n){var t,e,o=this,r=Math.random().toString(36).slice(2);o.link=function(n){t=n[0],e=n[1],o.getInvokedData=e.getInvokedData,o.getData=e.getInputData,e.addInput(o)},o.isRequired=function(){return t&&t.isRequired()},o.getInputId=function(){return r},o.getOptions=angular.version.minor>=4?function(){return o.getInvokedData("options")}:function(){var n=void 0;return function(){var t=o.getInvokedData("options");return n===t||angular.equals(n,t)||(n=t),n}}(),n.$on("$destroy",function(){e.removeInput(o)})}],controllerAs:"vormInput",link:function(n,t,e,o){o[0].link(o.slice(1)),n.$eval(e.compiler)(n,function(o){t.replaceWith(o),n.$$postDigest(function(){n.$eval(e.delegate).setNgModel(o.controller("ngModel"))})})}}}])}();!function(){angular.module("vorm").factory("vormInvoke",["$injector",function(n){return function(o,r){var t;return o?t=_.isArray(o)&&"function"==typeof _.last(o)||void 0!==o.$inject?n.invoke(o,null,angular.copy(r)):"function"==typeof o?o():o:o}}])}();!function(){angular.module("vorm").directive("vormLabel",[function(){return{require:["vormLabel","^?vormFieldTemplate","^?vormFieldWrapper"],template:"<label>{{vormLabel.getLabel()}}</label>",replace:!0,controller:[function(){var e=this;e.link=function(l){e.getLabel=_(l).filter(_.identity).pluck("getLabel").value()[0]}}],controllerAs:"vormLabel",link:function(e,l,r,t){t[0].link(t.slice(1))}}}])}();!function(){angular.module("vorm").directive("vormModelList",["VormModelListCtrl",function(o){return{controller:[function(){o.apply(this,null)}],controllerAs:"vormModelList"}}])}();!function(){angular.module("vorm").directive("vormSubmit",["$parse",function(r){return{require:["vormForm"],link:function(e,i,u,n){function o(){a(e,{$values:m.getValues()})}var t=babelHelpers.slicedToArray(n,1),m=t[0],a=void 0;a=r(u.vormSubmit),i.bind("submit",o)}}}])}();!function(){angular.module("vorm").provider("vormTemplateService",[function(){function e(e){r=_.mapValues(r,function(t,o){return e(t,o)})}function t(e){var t=e(angular.element(o));t.attr("vorm-field",""),o=t[0].outerHTML}var o=void 0,l=void 0,n=void 0,r={},a={};return o='<div ng-class="vormField.getClassObj()"><vorm-label></vorm-label><vorm-control></vorm-control></div>',l='<div class="vorm-control-list"><div class="vorm-control-list-item" ng-repeat="delegate in vormFieldTemplate.getDelegates()"><vorm-input delegate="delegate" compiler="vormFieldTemplate.getModelCompiler()" data="vormFieldTemplate.getInputData()"></vorm-input><button type="button" ng-click="vormFieldTemplate.clearDelegate(delegate)" ng-show="vormField.getValueType()===\'multiple\'">x</button></div></div>',r=_(r).assign(_("date datetime datetime-local email month number password search tel text time url week checkbox".split(" ")).zipObject().mapValues(function(e,t){var o=_.includes("text search tel url email number password".split(" "),t)?"placeholder=\"{{vormInput.invoke('placeholder')}}\"":"";return'<input type="'+t+'" id="{{::vormInput.getInputId()}}" '+o+"/>"}).value()).value(),r.select='<select id="{{::vormInput.getInputId()}}" ng-options="option.value as option.label for option in vormInput.getOptions()"><option value="" data-ng-show="vormInput.getInvokedData(\'notSelectedLabel\')">{{vormInput.getInvokedData(\'notSelectedLabel\')}}</option></select>',r=_.mapValues(r,function(e){return angular.element(e)}),t(function(){return angular.element(o)}),{$get:["$compile",function(e){return a.getDefaultTemplate=function(){return o},a.getDefaultControlTemplate=function(){return l},a.getModelCompiler=function(t,o){var l=void 0;if(l=o?e(o):n[t],!l)throw new Error("Model template for "+t+" not found");return l},n=_.mapValues(r,function(t){var o=void 0;return _.some(t,function(e){var t=void 0;return e.hasAttribute("ng-model")?o=angular.element(e):(t=e.querySelector("[ng-model]"))&&(o=angular.element(t)),!!o}),o||(o=t),o.attr("ng-model","model.value"),o.attr("ng-required","vormInput.isRequired()"),e(t)}),a}],modifyModelTemplates:e,modifyTemplate:t}}])}();
//# sourceMappingURL=vorm.js.map