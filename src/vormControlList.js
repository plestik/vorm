import angular from 'angular';
import _ from 'lodash';

/**

@ngdoc directive
@name vormControlList
@module vorm

@description

This directives manages and displays the available controls.

__Requires__: `^vormFieldConfig`, `^?vormFocusableList`, `vormField`

*/

/**

@ngdoc type
@name vormControlList.controller
@module vorm

*/

angular.module('vorm')
	.directive('vormControlList', [ 'VormModelDelegate', '$document', function ( VormModelDelegate, $document ) {
		
		return {
			require: [ 'vormControlList', '^vormFieldConfig', '^?vormFocusableList', '^vormField' ],
			restrict: 'E',
			controller: [ '$scope', function ( $scope ) {
				
				let ctrl = this,
					delegates = [],
					limit = NaN,
					vormFieldConfig,
					vormFocusableList,
					vormField;
					
				function triggerAsyncViewChange ( callback ) {
					let unwatch = $scope.$watchCollection(vormField.getModels, function ( ) {
						
						vormField.triggerViewChange();
						
						callback();
						
						unwatch();
					});
				}
				
				function setFocus ( ) {
					if(vormFocusableList) {
						let id = vormFocusableList.getId(),
							el = $document[0].getElementById(id);
						
						if(el) {
							el.focus();
						}
					}
				}
				
				function createDelegate ( name ) {
					let delegate,
						value;
					
					delegate = new VormModelDelegate(name);
					
					switch(vormField.getValueType()) {
						case 'list':
						value = vormField.getValue()[delegates.length];
						break;
						
						case 'named':
						value = vormField.getValue()[name];
						break;
						
						case 'single':
						value = vormField.getValue();
						break;
					}
					
					delegate.value = value;
					delegates.push(delegate);
				}
					
				ctrl.link = function ( controllers ) {
					
					vormFieldConfig = controllers[0];
					vormFocusableList = controllers[1];
					vormField = controllers[2];
					
					$scope.$watch(vormFieldConfig.getLimit, function ( l ) {
						ctrl.setLimit(l);
					});
					
					$scope.$watchCollection(function ( ) {
						let keys,
							val = vormField.getValue();
							
						switch(vormField.getValueType()) {
							default:
							keys = _.keys(val);
							break;
							
							case 'single':
							keys = null;
							break;
						}
						
						return keys;
					}, function ( keys ) {
						
						delegates = [];
						
						if(!keys) {
							createDelegate();
						}
						
						_.each(keys, function ( key ) {
							createDelegate(key);
						});
					});
					
				};
				
				/**
				* @ngdoc method
				* @name vormControlList.controller#$getDelegates
				*
				* @description
				
				Returns the list of the model delegates that are registered with the controller.
				
				* @returns {Array.<VormModelDelegate>} A list of the registered model delegates.
				*/
				
				ctrl.getDelegates = function ( ) {
					return delegates;
				};
				
				ctrl.clearDelegate = function ( delegate ) {
					delegate.clearViewValue();
				};
				
				ctrl.getLimit = function ( ) {
					return limit;
				};
				
				ctrl.setLimit = function ( l ) {
					limit = Number(l);
				};
				
				ctrl.reachedLimit = function ( ) {
					return limit > 0 && delegates.length >= limit;
				};
				
				ctrl.isClearButtonVisible = function ( ) {
					return vormField.getValueType() === 'list';
				};
				
				ctrl.handleCreateClick = function ( ) {
					vormField.setValue(vormField.getValue().concat(null));
					triggerAsyncViewChange(setFocus);
				};
				
				ctrl.handleClearClick = function ( delegate ) {
					
					if(delegates.length === 1) {
						delegate.clearViewValue();
					} else {
						let value = vormField.getValue(),
							index = _.find(vormField.getModels(), { model: delegate.getNgModel() });
							
						value.splice(index, 1);
						vormField.setValue(value);
						
						triggerAsyncViewChange(setFocus);
					}
				};
				
			}],
			controllerAs: 'vormControlList',
			link: function ( scope, element, attrs, controllers ) {
				
				controllers.shift().link(controllers);
				
			}
		};
		
	}]);
