import {createHandlerBoundToURL} from 'workbox-precaching';
import {NavigationRoute, registerRoute} from 'workbox-routing';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

let navigationRoute;

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/'));
registerRoute(navigationRoute);

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/settings'));
registerRoute(navigationRoute);

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/extras'));
registerRoute(navigationRoute);

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/usage'));
registerRoute(navigationRoute);

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/about'));
registerRoute(navigationRoute);

navigationRoute = New NavigationRoute(createHandlerBoundToURL('/whatsnew'));
registerRoute(navigationRoute);

