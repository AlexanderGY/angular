import { CONST_EXPR } from 'angular2/src/facade/lang';
import { Provider } from 'angular2/src/core/di';
import { Console } from 'angular2/src/core/console';
import { Reflector, reflector } from './reflection/reflection';
import { ReflectorReader } from './reflection/reflector_reader';
import { TestabilityRegistry } from 'angular2/src/core/testability/testability';
import { PLATFORM_CORE_PROVIDERS } from './application_ref';
function reflectorFactory() {
    return reflector;
}
/**
 * A default set of providers which should be included in any Angular platform.
 */
export const PLATFORM_COMMON_PROVIDERS = CONST_EXPR([
    PLATFORM_CORE_PROVIDERS,
    new Provider(Reflector, { useFactory: reflectorFactory, deps: [] }),
    new Provider(ReflectorReader, { useExisting: Reflector }),
    TestabilityRegistry,
    Console
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fY29tbW9uX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtZEJKR1BGNzQudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL3BsYXRmb3JtX2NvbW1vbl9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBOEMsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO09BQ3pGLEVBQVUsUUFBUSxFQUF3QixNQUFNLHNCQUFzQjtPQUN0RSxFQUFDLE9BQU8sRUFBQyxNQUFNLDJCQUEyQjtPQUMxQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSx5QkFBeUI7T0FDckQsRUFBQyxlQUFlLEVBQUMsTUFBTSwrQkFBK0I7T0FDdEQsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDJDQUEyQztPQUN0RSxFQUFDLHVCQUF1QixFQUFDLE1BQU0sbUJBQW1CO0FBRXpEO0lBQ0UsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxPQUFPLE1BQU0seUJBQXlCLEdBQW1DLFVBQVUsQ0FBQztJQUNsRix1QkFBdUI7SUFDdkIsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNqRSxJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBQyxXQUFXLEVBQUUsU0FBUyxFQUFDLENBQUM7SUFDdkQsbUJBQW1CO0lBQ25CLE9BQU87Q0FDUixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGUsIGlzQmxhbmssIGlzUHJlc2VudCwgYXNzZXJ0aW9uc0VuYWJsZWQsIENPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3Byb3ZpZGUsIFByb3ZpZGVyLCBJbmplY3RvciwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7Q29uc29sZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY29uc29sZSc7XG5pbXBvcnQge1JlZmxlY3RvciwgcmVmbGVjdG9yfSBmcm9tICcuL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge1JlZmxlY3RvclJlYWRlcn0gZnJvbSAnLi9yZWZsZWN0aW9uL3JlZmxlY3Rvcl9yZWFkZXInO1xuaW1wb3J0IHtUZXN0YWJpbGl0eVJlZ2lzdHJ5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge1BMQVRGT1JNX0NPUkVfUFJPVklERVJTfSBmcm9tICcuL2FwcGxpY2F0aW9uX3JlZic7XG5cbmZ1bmN0aW9uIHJlZmxlY3RvckZhY3RvcnkoKTogUmVmbGVjdG9yIHtcbiAgcmV0dXJuIHJlZmxlY3Rvcjtcbn1cblxuLyoqXG4gKiBBIGRlZmF1bHQgc2V0IG9mIHByb3ZpZGVycyB3aGljaCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gYW55IEFuZ3VsYXIgcGxhdGZvcm0uXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFURk9STV9DT01NT05fUFJPVklERVJTOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBDT05TVF9FWFBSKFtcbiAgUExBVEZPUk1fQ09SRV9QUk9WSURFUlMsXG4gIG5ldyBQcm92aWRlcihSZWZsZWN0b3IsIHt1c2VGYWN0b3J5OiByZWZsZWN0b3JGYWN0b3J5LCBkZXBzOiBbXX0pLFxuICBuZXcgUHJvdmlkZXIoUmVmbGVjdG9yUmVhZGVyLCB7dXNlRXhpc3Rpbmc6IFJlZmxlY3Rvcn0pLFxuICBUZXN0YWJpbGl0eVJlZ2lzdHJ5LFxuICBDb25zb2xlXG5dKTtcbiJdfQ==