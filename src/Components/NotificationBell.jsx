// src/components/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // O ícone de sino
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig'; // Certifique-se de que o caminho para sua instância 'db' está correto

function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    // Monitora o estado de autenticação para saber quem é o usuário logado
    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

    // Busca e monitora as notificações não lidas para o usuário logado
    useEffect(() => {
        let unsubscribeNotifications;

        if (currentUser) {
            const notificationsRef = collection(db, 'notifications');
            // Query para pegar notificações onde recipientId é o UID do usuário logado E 'read' é falso
            const q = query(
                notificationsRef,
                where('recipientId', '==', currentUser.uid),
                where('read', '==', false)
            );

            unsubscribeNotifications = onSnapshot(q, (snapshot) => {
                setUnreadCount(snapshot.size); // snapshot.size retorna o número de documentos
            }, (error) => {
                console.error("Erro ao buscar notificações:", error);
                setUnreadCount(0); // Em caso de erro, zera a contagem
            });
        } else {
            setUnreadCount(0); // Se não houver usuário logado, não há notificações para mostrar
        }

        return () => {
            if (unsubscribeNotifications) {
                unsubscribeNotifications();
            }
        };
    }, [currentUser]); // Re-executa quando o currentUser muda

    const handleBellClick = () => {
        // TODO: Aqui você implementará a lógica para:
        // 1. Abrir um menu/modal/página com as notificações
        // 2. Opcionalmente, marcar todas as notificações como lidas ao abrir (ou ao clicar individualmente)
        console.log('Sininho clicado! Total de notificações não lidas:', unreadCount);
        // Exemplo: window.location.href = '/notifications'; ou abrir um modal
    };

    return (
        <IconButton
            color="inherit" // Cor do ícone (ajuste conforme seu tema)
            onClick={handleBellClick}
            aria-label="mostrar notificações"
        >
            <Badge badgeContent={unreadCount} color="error"> {/* 'error' para a cor vermelha do badge */}
                <NotificationsIcon />
            </Badge>
        </IconButton>
    );
}

export default NotificationBell;