// src/components/PushNotification.jsx
import React, { useEffect, useState } from 'react';
import { onMessage, getToken } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';

const PushNotification = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                getToken(messaging, {
                    vapidKey: process.env.REACT_APP_VAPID,
                }).then((currentToken) => {
                    if (currentToken) {
                        console.log('Token FCM:', currentToken);
                        // Aqui você pode enviar o token para seu backend, se quiser
                    } else {
                        console.warn('Não foi possível obter token.');
                    }
                }).catch((err) => {
                    console.error('Erro ao obter token:', err);
                });
            } else {
                console.warn('Permissão de notificação não concedida');
            }
        });

        // Listener para mensagens recebidas em primeiro plano
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Mensagem recebida no foreground:', payload);
            setNotification(payload.notification);
        });

        // Limpeza do listener quando componente for desmontado
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {notification && (
                <div className="p-4 bg-green-100 border border-green-400 rounded shadow">
                    <h4 className="font-bold">{notification.title}</h4>
                    <p>{notification.body}</p>
                </div>
            )}
        </div>
    );
};

export default PushNotification;
