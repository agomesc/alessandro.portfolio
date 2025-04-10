// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Essa config deve ser a MESMA do seu app principal
firebase.initializeApp({
  apiKey: "AIzaSyAl75-7cxK0okEbOEnpEABmzmEJr_aQv-I",
  authDomain: "alessandro-portfolio.firebaseapp.com",
  databaseURL: "https://alessandro-portfolio-default-rtdb.firebaseio.com",
  projectId: "alessandro-portfolio",
  storageBucket: "alessandro-portfolio.appspot.com",
  messagingSenderId: "1077155633264",
  appId: "1:1077155633264:web:176463c5c50b9a28427cb5",
  measurementId: "G-WG3E4CSVFR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Mensagem recebida:', payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '/firebase-logo.png' // personalize com seu ícone
  });
});
