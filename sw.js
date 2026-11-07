// Notifications PHENO&CO (messagerie de la carte). Pas de cache : le hub reste toujours à jour.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  // Pastille sur l'icône de l'appli
  try { if (d.badge > 0 && self.navigator.setAppBadge) self.navigator.setAppBadge(d.badge); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title || 'PHENO&CO', {
    body: d.body || 'Tu as un nouveau message.',
    icon: 'icon-192.png', badge: 'icon-192.png', tag: 'pnc-msg', renotify: true,
    data: { url: './#msg' }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) { list[i].navigate('./#msg'); return list[i].focus(); } }
    return self.clients.openWindow('./#msg');
  }));
});
