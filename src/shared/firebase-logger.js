// utils/logger.js
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/**
 * Registra uma ação do usuário no Firestore.
 * @param {string} actionType - O tipo da ação (ex: 'notificacao_vista', 'url_acessada', etc.).
 * @param {object} [data={}] - Objeto com dados adicionais (elementId, details, etc.).
 */
export const logUserAction = async (actionType, data = {}) => {
  try {
    const auth = getAuth();

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        const userId = user?.uid || 'anonimo';

        await addDoc(collection(db, 'logs_usuarios'), {
          userId,
          actionType,
          timestamp: serverTimestamp(),
          ...data,
        });

        console.log(`Ação '${actionType}' logada com sucesso para o usuário: ${userId}`);
        resolve();
      });
    });
  } catch (error) {
    console.error('Erro ao logar ação do usuário:', error);
  }
};
