// Alma Sales Targets — Service Worker
const CACHE = 'alma-targets-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      for(const c of list){
        if(c.url.includes('alma-anz-targets') && 'focus' in c){
          return c.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Handle push messages (future FCM support)
self.addEventListener('push', e => {
  if(!e.data) return;
  try{
    const data = e.data.json();
    e.waitUntil(
      self.registration.showNotification(data.title || 'Alma Sales Targets', {
        body: data.body || '',
        icon: data.icon || '',
        data: { url: data.url || '/' }
      })
    );
  }catch(err){
    e.waitUntil(
      self.registration.showNotification('Alma Sales Targets', {
        body: e.data.text()
      })
    );
  }
});
