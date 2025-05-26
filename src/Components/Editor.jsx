import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({ onContentChange, defaultValue = '' }) => {
    const [content, setContent] = useState(defaultValue);

    useEffect(() => {
        onContentChange?.(content); // Envia o conteúdo ao componente pai
    }, [content, onContentChange]);

    return (
        <ReactQuill
            value={content}
            onChange={setContent}
            style={{ height: '200px', marginBottom: '50px' }}
        />
    );
};

export default React.memo(Editor);
