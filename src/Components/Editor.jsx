import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState } from 'react';

const Editor = () => {
    const [content, setContent] = useState('');

    return (
        <ReactQuill value={content} onChange={setContent} />
    );
};

export default React.memo(Editor);