import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = ({ onContentChange, defaultValue = '', height = '300px' }) => {
  const [content, setContent] = useState(defaultValue);
  const quillRef = useRef(null);

  useEffect(() => {
    onContentChange?.(content);
  }, [content, onContentChange]);

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
