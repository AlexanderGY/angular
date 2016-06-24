'use strict';/**
 * @module
 * @description
 * The `di` module provides dependency injection container services.
 */
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var metadata_1 = require('./di/metadata');
exports.InjectMetadata = metadata_1.InjectMetadata;
exports.OptionalMetadata = metadata_1.OptionalMetadata;
exports.InjectableMetadata = metadata_1.InjectableMetadata;
exports.SelfMetadata = metadata_1.SelfMetadata;
exports.HostMetadata = metadata_1.HostMetadata;
exports.SkipSelfMetadata = metadata_1.SkipSelfMetadata;
exports.DependencyMetadata = metadata_1.DependencyMetadata;
// we have to reexport * because Dart and TS export two different sets of types
__export(require('./di/decorators'));
var forward_ref_1 = require('./di/forward_ref');
exports.forwardRef = forward_ref_1.forwardRef;
exports.resolveForwardRef = forward_ref_1.resolveForwardRef;
var injector_1 = require('./di/injector');
exports.Injector = injector_1.Injector;
exports.InjectorFactory = injector_1.InjectorFactory;
var reflective_injector_1 = require('./di/reflective_injector');
exports.ReflectiveInjector = reflective_injector_1.ReflectiveInjector;
var provider_1 = require('./di/provider');
exports.Binding = provider_1.Binding;
exports.ProviderBuilder = provider_1.ProviderBuilder;
exports.bind = provider_1.bind;
exports.Provider = provider_1.Provider;
exports.provide = provider_1.provide;
var reflective_provider_1 = require('./di/reflective_provider');
exports.ResolvedReflectiveFactory = reflective_provider_1.ResolvedReflectiveFactory;
exports.ReflectiveDependency = reflective_provider_1.ReflectiveDependency;
var reflective_key_1 = require('./di/reflective_key');
exports.ReflectiveKey = reflective_key_1.ReflectiveKey;
var reflective_exceptions_1 = require('./di/reflective_exceptions');
exports.NoProviderError = reflective_exceptions_1.NoProviderError;
exports.AbstractProviderError = reflective_exceptions_1.AbstractProviderError;
exports.CyclicDependencyError = reflective_exceptions_1.CyclicDependencyError;
exports.InstantiationError = reflective_exceptions_1.InstantiationError;
exports.InvalidProviderError = reflective_exceptions_1.InvalidProviderError;
exports.NoAnnotationError = reflective_exceptions_1.NoAnnotationError;
exports.OutOfBoundsError = reflective_exceptions_1.OutOfBoundsError;
var opaque_token_1 = require('./di/opaque_token');
exports.OpaqueToken = opaque_token_1.OpaqueToken;
var map_injector_1 = require('./di/map_injector');
exports.MapInjector = map_injector_1.MapInjector;
exports.MapInjectorFactory = map_injector_1.MapInjectorFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLUFPYWNtWThULnRtcC9hbmd1bGFyMi9zcmMvY29yZS9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHOzs7OztBQUVILHlCQVFPLGVBQWUsQ0FBQztBQVByQixtREFBYztBQUNkLHVEQUFnQjtBQUNoQiwyREFBa0I7QUFDbEIsK0NBQVk7QUFDWiwrQ0FBWTtBQUNaLHVEQUFnQjtBQUNoQiwyREFDcUI7QUFFdkIsK0VBQStFO0FBQy9FLGlCQUFjLGlCQUFpQixDQUFDLEVBQUE7QUFFaEMsNEJBQTBELGtCQUFrQixDQUFDO0FBQXJFLDhDQUFVO0FBQUUsNERBQXlEO0FBRTdFLHlCQUF3QyxlQUFlLENBQUM7QUFBaEQsdUNBQVE7QUFBRSxxREFBc0M7QUFDeEQsb0NBQWlDLDBCQUEwQixDQUFDO0FBQXBELHNFQUFvRDtBQUM1RCx5QkFPTyxlQUFlLENBQUM7QUFOckIscUNBQU87QUFDUCxxREFBZTtBQUNmLCtCQUFJO0FBRUosdUNBQVE7QUFDUixxQ0FDcUI7QUFDdkIsb0NBTU8sMEJBQTBCLENBQUM7QUFKaEMsb0ZBQXlCO0FBQ3pCLDBFQUdnQztBQUNsQywrQkFBNEIscUJBQXFCLENBQUM7QUFBMUMsdURBQTBDO0FBQ2xELHNDQVFPLDRCQUE0QixDQUFDO0FBUGxDLGtFQUFlO0FBQ2YsOEVBQXFCO0FBQ3JCLDhFQUFxQjtBQUNyQix3RUFBa0I7QUFDbEIsNEVBQW9CO0FBQ3BCLHNFQUFpQjtBQUNqQixvRUFDa0M7QUFDcEMsNkJBQTBCLG1CQUFtQixDQUFDO0FBQXRDLGlEQUFzQztBQUM5Qyw2QkFBOEMsbUJBQW1CLENBQUM7QUFBMUQsaURBQVc7QUFBRSwrREFBNkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBkaWAgbW9kdWxlIHByb3ZpZGVzIGRlcGVuZGVuY3kgaW5qZWN0aW9uIGNvbnRhaW5lciBzZXJ2aWNlcy5cbiAqL1xuXG5leHBvcnQge1xuICBJbmplY3RNZXRhZGF0YSxcbiAgT3B0aW9uYWxNZXRhZGF0YSxcbiAgSW5qZWN0YWJsZU1ldGFkYXRhLFxuICBTZWxmTWV0YWRhdGEsXG4gIEhvc3RNZXRhZGF0YSxcbiAgU2tpcFNlbGZNZXRhZGF0YSxcbiAgRGVwZW5kZW5jeU1ldGFkYXRhXG59IGZyb20gJy4vZGkvbWV0YWRhdGEnO1xuXG4vLyB3ZSBoYXZlIHRvIHJlZXhwb3J0ICogYmVjYXVzZSBEYXJ0IGFuZCBUUyBleHBvcnQgdHdvIGRpZmZlcmVudCBzZXRzIG9mIHR5cGVzXG5leHBvcnQgKiBmcm9tICcuL2RpL2RlY29yYXRvcnMnO1xuXG5leHBvcnQge2ZvcndhcmRSZWYsIHJlc29sdmVGb3J3YXJkUmVmLCBGb3J3YXJkUmVmRm59IGZyb20gJy4vZGkvZm9yd2FyZF9yZWYnO1xuXG5leHBvcnQge0luamVjdG9yLCBJbmplY3RvckZhY3Rvcnl9IGZyb20gJy4vZGkvaW5qZWN0b3InO1xuZXhwb3J0IHtSZWZsZWN0aXZlSW5qZWN0b3J9IGZyb20gJy4vZGkvcmVmbGVjdGl2ZV9pbmplY3Rvcic7XG5leHBvcnQge1xuICBCaW5kaW5nLFxuICBQcm92aWRlckJ1aWxkZXIsXG4gIGJpbmQsXG5cbiAgUHJvdmlkZXIsXG4gIHByb3ZpZGVcbn0gZnJvbSAnLi9kaS9wcm92aWRlcic7XG5leHBvcnQge1xuICBSZXNvbHZlZFJlZmxlY3RpdmVCaW5kaW5nLFxuICBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5LFxuICBSZWZsZWN0aXZlRGVwZW5kZW5jeSxcblxuICBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlclxufSBmcm9tICcuL2RpL3JlZmxlY3RpdmVfcHJvdmlkZXInO1xuZXhwb3J0IHtSZWZsZWN0aXZlS2V5fSBmcm9tICcuL2RpL3JlZmxlY3RpdmVfa2V5JztcbmV4cG9ydCB7XG4gIE5vUHJvdmlkZXJFcnJvcixcbiAgQWJzdHJhY3RQcm92aWRlckVycm9yLFxuICBDeWNsaWNEZXBlbmRlbmN5RXJyb3IsXG4gIEluc3RhbnRpYXRpb25FcnJvcixcbiAgSW52YWxpZFByb3ZpZGVyRXJyb3IsXG4gIE5vQW5ub3RhdGlvbkVycm9yLFxuICBPdXRPZkJvdW5kc0Vycm9yXG59IGZyb20gJy4vZGkvcmVmbGVjdGl2ZV9leGNlcHRpb25zJztcbmV4cG9ydCB7T3BhcXVlVG9rZW59IGZyb20gJy4vZGkvb3BhcXVlX3Rva2VuJztcbmV4cG9ydCB7TWFwSW5qZWN0b3IsIE1hcEluamVjdG9yRmFjdG9yeX0gZnJvbSAnLi9kaS9tYXBfaW5qZWN0b3InO1xuIl19