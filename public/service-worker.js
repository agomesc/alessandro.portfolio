// No seu serviceWorker.js
export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`; // Ou o caminho correto do seu SW
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Falha no registro do Service Worker:', error);
        });
    });
  } else {
     console.log('Service Workers não são suportados neste ambiente.');
  }
}

// Para garantir que você também tenha uma função unregister robusta
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    }).catch(error => {
      console.error(error.message);
    });
  }
}