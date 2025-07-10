// Exemplo de como deveria ser seu itemUtils.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Verifique se 'db' está sendo importado corretamente

export const getItemCreatorDetails = async (itemId) => {
    try {
        console.log("getItemCreatorDetails: Tentando buscar item com ID:", itemId);

        // 🚨🚨 AJUSTE ESTA LINHA: Substitua "SEUS_ITENS_COLLECTION" pelo nome EXATO da sua coleção de itens no Firestore 🚨🚨
        const itemDocRef = doc(db, "notifications", itemId);
        console.log("getItemCreatorDetails: Caminho completo do documento sendo buscado:", itemDocRef.path); // Isso mostrará o caminho exato que o Firestore está tentando acessar

        const itemDocSnap = await getDoc(itemDocRef);

        if (itemDocSnap.exists()) {
            const itemData = itemDocSnap.data();
            console.log("getItemCreatorDetails: Dados do item encontrados:", itemData);

            // 🚨🚨 VERIFIQUE ISTO: Qual é o nome do campo que armazena o UID do criador no seu documento de item? 🚨🚨
            // Pode ser 'creatorId', 'userId', 'ownerId', etc. Ajuste conforme necessário.
            const creatorId = itemData.creatorId || itemData.userId || itemData.ownerId || null;
            // E qual o campo que armazena o título?
            const itemTitle = itemData.title || itemData.name || 'Um item desconhecido';

            if (!creatorId) {
                console.warn(`getItemCreatorDetails: Campo 'creatorId' (ou equivalente) não encontrado ou é nulo no item ${itemId}. Dados:`, itemData);
            }

            return { creatorId, itemTitle };
        } else {
            console.warn(`Item with ID ${itemId} not found. Cannot retrieve creator details.`, { itemId });
            return { creatorId: null, itemTitle: 'Um item desconhecido' };
        }
    } catch (error) {
        console.error("Erro inesperado em getItemCreatorDetails ao buscar item:", error);
        return { creatorId: null, itemTitle: 'Erro na busca do item' };
    }
};