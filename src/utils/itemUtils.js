// src/utils/itemUtils.js (No changes needed, already good)
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getItemCreatorDetails = async (itemId) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      return {
        creatorId: itemData.userId || null,
        itemTitle: itemData.title || 'Um item',
      };
    } else {
      console.warn(`Item with ID ${itemId} not found. Cannot retrieve creator details.`);
      return { creatorId: null, itemTitle: 'Um item desconhecido' };
    }
  } catch (error) {
    console.error(`Error fetching item creator details for ${itemId}:`, error);
    return { creatorId: null, itemTitle: 'Um item desconhecido' };
  }
};