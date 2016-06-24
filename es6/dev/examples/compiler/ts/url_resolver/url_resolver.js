import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { UrlResolver } from 'angular2/compiler';
var MyApp;
// #docregion url_resolver
class MyUrlResolver extends UrlResolver {
    resolve(baseUrl, url) {
        // Serve CSS files from a special CDN.
        if (url.substr(-4) === '.css') {
            return super.resolve('http://cdn.myapp.com/css/', url);
        }
        return super.resolve(baseUrl, url);
    }
}
bootstrap(MyApp, [provide(UrlResolver, { useClass: MyUrlResolver })]);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1kQkpHUEY3NC50bXAvYW5ndWxhcjIvZXhhbXBsZXMvY29tcGlsZXIvdHMvdXJsX3Jlc29sdmVyL3VybF9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGVBQWU7T0FDOUIsRUFBQyxTQUFTLEVBQUMsTUFBTSwyQkFBMkI7T0FDNUMsRUFBQyxXQUFXLEVBQUMsTUFBTSxtQkFBbUI7QUFFN0MsSUFBSSxLQUFVLENBQUM7QUFFZiwwQkFBMEI7QUFDMUIsNEJBQTRCLFdBQVc7SUFDckMsT0FBTyxDQUFDLE9BQWUsRUFBRSxHQUFXO1FBQ2xDLHNDQUFzQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBQyxRQUFRLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtwcm92aWRlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Ym9vdHN0cmFwfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcbmltcG9ydCB7VXJsUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvbXBpbGVyJztcblxudmFyIE15QXBwOiBhbnk7XG5cbi8vICNkb2NyZWdpb24gdXJsX3Jlc29sdmVyXG5jbGFzcyBNeVVybFJlc29sdmVyIGV4dGVuZHMgVXJsUmVzb2x2ZXIge1xuICByZXNvbHZlKGJhc2VVcmw6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIFNlcnZlIENTUyBmaWxlcyBmcm9tIGEgc3BlY2lhbCBDRE4uXG4gICAgaWYgKHVybC5zdWJzdHIoLTQpID09PSAnLmNzcycpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXNvbHZlKCdodHRwOi8vY2RuLm15YXBwLmNvbS9jc3MvJywgdXJsKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnJlc29sdmUoYmFzZVVybCwgdXJsKTtcbiAgfVxufVxuXG5ib290c3RyYXAoTXlBcHAsIFtwcm92aWRlKFVybFJlc29sdmVyLCB7dXNlQ2xhc3M6IE15VXJsUmVzb2x2ZXJ9KV0pO1xuLy8gI2VuZGRvY3JlZ2lvblxuIl19