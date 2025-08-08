import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({ onContentChange, defaultValue = '', height = '300px' }) => {
  const [content, setContent] = useState(defaultValue);
  const quillRef = useRef(null);

  // Atualiza o conteúdo se defaultValue mudar
  useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  // Notifica mudanças no conteúdo
  useEffect(() => {
    onContentChange?.(content);
  }, [content, onContentChange]);

  // Acesso direto ao editor (se necessário)
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    // Você pode usar `editor` para manipular o Quill diretamente
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link',
  ];

  return (
    <div style={{ height, marginBottom: '50px' }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default React.memo(Editor);