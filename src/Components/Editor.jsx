import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({ onContentChange, defaultValue = '', height = '300px' }) => {
  const [content, setContent] = useState(defaultValue);
  const quillRef = useRef(null);

  useEffect(() => {
    onContentChange?.(content);
  }, [content, onContentChange]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.value = ''; // Garante que o mesmo arquivo possa ser reprocessado
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 1024 * 1024) {
          alert('Imagem muito grande! Limite: 1MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const editor = quillRef.current?.getEditor?.();
          if (!editor) return;

          const range = editor.getSelection();
          const position = range ? range.index : editor.getLength();
          editor.insertEmbed(position, 'image', reader.result);
          editor.setSelection(position + 1);
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }), [handleImageUpload]);

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link', 'image',
  ];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={content}
      onChange={setContent}
      modules={modules}
      formats={formats}
      style={{ height, marginBottom: '50px' }}
    />
  );
};

export default React.memo(Editor);
