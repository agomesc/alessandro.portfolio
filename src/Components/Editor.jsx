import React, { useState, useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Editor com botão customizado de upload de imagem
const Editor = ({ onContentChange, defaultValue = '' }) => {
    const [content, setContent] = useState(defaultValue);
    const quillRef = useRef(null);

    useEffect(() => {
        onContentChange?.(content);
    }, [content, onContentChange]);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
                ['customImage'] // botão customizado
            ],
            handlers: {
                customImage: handleImageUpload,
            },
        },
    };

    const formats = [
        'header', 'bold', 'italic', 'underline',
        'list', 'bullet', 'link', 'image',
    ];

    return (
        <>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ height: '300px', marginBottom: '50px' }}
            />
        </>
    );
};

export default React.memo(Editor);
