import angular from 'angular';
import 'angular-mocks';
import '../src/vorm';

describe('vormControl', function ( ) {
	
	let $rootScope,
		$compile;
	
	beforeEach(angular.mock.module('vorm'));
	beforeEach(angular.mock.inject([ '$rootScope', '$compile', function ( ) {
		
		$rootScope = arguments[0];
		$compile = arguments[1];
		
	}]));
	
	it('should throw an error if no template or transclude is available', function ( ) {
		
		const element = angular.element(`
			<vorm-control/>
		`);
		
		expect(function ( ) {
			$compile(element)($rootScope.$new());
		}).toThrow();
		
		
	});
	
	it('should replace itself with the model template from its parent', function ( ) {
		
		const element = angular.element(`
			<div>
				<vorm-field-template name="foo" type="text"></vorm-field-template>
			</div>
		`);
		
		$compile(element)($rootScope.$new());
		
		$rootScope.$digest();
		
		expect(element.find('vorm-control-replace').length).toBe(0);
		expect(element.find('input').length).toBe(1);
		
	});
	
	it('should replace itself with the transcluded content', function ( ) {
		
		const element = angular.element(`
				<input type="text" ng-model="foo" vorm-field-wrapper/>
		`);
		const scope = $rootScope.$new();
		
		scope.foo = 'bar';
		
		$compile(element)(scope);
		
		scope.$digest();
		
		const vormFieldCtrl = element.controller('vormField');
		
		expect(element.attr('vorm-field')).toBeDefined();
		
		expect(vormFieldCtrl).toBeDefined();
		
		expect(vormFieldCtrl.getValue()).toBe('bar');
		
	});
	
	it('should support multiple instances of the same type', function ( ) {
		
		const element = angular.element(`
			<div>
				<vorm-field-template name="foo" type="text"></vorm-field-template>
				<vorm-field-template name="bar" type="text"></vorm-field-template>
			</div>
		`);
		
		const scope = $rootScope.$new();
		
		$compile(element)(scope);
		
		scope.$digest();
		
		expect(element.find('input').length).toBe(2);
		
	});
	
	describe('when compiled', function ( ) {
		
		let element,
			scope,
			delegate,
			vormFormCtrl,
			vormFieldCtrl;
		
		function compile ( options ) {
			element = angular.element(`
				<form vorm-form>
					<vorm-field-template name="foo" type="text" data="data"></vorm-field-template>
				</form>
			`);
			
			options = options || {};
			
			if(options.version) {
				angular.version.minor = options.version;
			}
			
			if(options.form === false) {
				element.removeAttr('vorm-form');
			}
			
			scope = $rootScope.$new();
			scope.data = {
				options: [ '$values', function ( /*$values*/ ) {
					return [
						{
							name: 'foo',
							label: 'Foo'
						},
						{
							name: 'bar',
							label: 'Bar'
						}
					];
				}]
			};
			
			if(options.limit) {
				options.valueType = {
					type: 'list',
					limit: options.limit
				};
			}
			
			$compile(element)(scope);
			
			scope.$digest();
			
			vormFormCtrl = element.controller('vormForm');
			vormFieldCtrl = element.children().eq(0).controller('vormField');
			
			delegate = element.find('vorm-control-list').controller('vormControlList').getDelegates()[0];
		}
		
		it('should pass the model to the delegate', function ( ) {
			
			compile();
			
			expect(delegate.getNgModel()).toBeDefined();
			
		});
		
		it('should clear the view value if delegate.clearValue is called', function ( ) {
			
			compile();
			
			delegate.clearViewValue();
			
			scope.$digest();
			
			expect(vormFieldCtrl.getValue()).toBeNull();
			
		});
		
		it('should return a new list of options only if changed for <=1.3.x', function ( ) {
			
			compile({
				version: 3
			});
			
			const inputCtrl = element.find('vorm-control').controller('vormControl');
			
			const opts = inputCtrl.getOptions();
			
			expect(inputCtrl.getOptions()).toBe(opts);
			
		});
		
		it('should always return a new list of options for >=1.4.x', function ( ) {
			
			compile({
				version: 4
			});
			
			const inputCtrl = element.find('vorm-control').controller('vormControl');
			
			const opts = inputCtrl.getOptions();
			
			expect(inputCtrl.getOptions()).not.toBe(opts);
			
			expect(inputCtrl.getOptions()).toEqual(opts);
			
		});
		
		it('should invoke a function with the values from the form', function ( ) {
			
			compile();
			
			const inputCtrl = element.find('vorm-control').controller('vormControl');
			
			const spy = jasmine.createSpy();
			
			scope.data.options[1] = spy;
			
			inputCtrl.getOptions();
			
			expect(spy).toHaveBeenCalledWith(vormFormCtrl.getValues());
			
		});
		
		it('should invoke a function with the values from the field if no form is present', function ( ) {
			
			compile({
				form: false
			});
			
			const inputCtrl = element.find('vorm-control').controller('vormControl');
			
			const spy = jasmine.createSpy();
			
			scope.data.options[1] = spy;
			
			inputCtrl.getOptions();
			
			const value = {};
			
			value[vormFieldCtrl.getName()] = vormFieldCtrl.getValue();
			
			expect(spy).toHaveBeenCalledWith(value);
			
		});
		
		it('should remove itself if destroyed', function ( ) {
			
			compile({
				limit: 2
			});
			
			const focusableCtrl = element.find('div').controller('vormFocusableList');
			
			vormFieldCtrl.setValue([ null, null ]);
			
			spyOn(focusableCtrl, 'removeId').and.callThrough();
			
			element.find('vorm-control').eq(0).scope().$destroy();
			
			expect(focusableCtrl.removeId).toHaveBeenCalled();
			
		});
		
	});
	
	
	
});
