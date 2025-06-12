import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GalleryList = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const q = query(collection(db, 'galleries'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setGalleries(items);
            } catch (err) {
                console.error("Erro ao buscar galerias:", err);
                setError("Erro ao carregar as galerias.");
            } finally {
                setLoading(false);
            }
        };

        fetchGalleries();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {galleries.map(gallery => (
                <div key={gallery.id}>
                    <h3>{gallery.title}</h3>
                    {/* Outros campos que quiser exibir */}
                </div>
            ))}
        </div>
    );
};

export default GalleryList;
