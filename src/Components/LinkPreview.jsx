import React, { useState, useEffect } from 'react';

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                setPreviewData(data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    if (loading) {
        return <div>Carregando pré-visualização...</div>;
    }

    if (!previewData) {
        return <div>Pré-visualização não disponível.</div>;
    }

    return (
        <div>
            <div>
                <strong>Título:</strong> {previewData.title}
            </div>
            <div>
                <strong>Descrição:</strong> {previewData.description}
            </div>
            <img src={previewData.image.url} alt="Imagem de pré-visualização" />
        </div>
    );
};

export default LinkPreview;
