import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  height = '200px',
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'image', 'code-block'
  ];

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          background-color: #1f2937;
          color: #f9fafb;
          border: 1px solid #374151;
        }
        
        .rich-text-editor .ql-toolbar {
          border: 1px solid #374151;
          background-color: #111827;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #9ca3af;
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #9ca3af;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #f9fafb;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #f9fafb;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
        
        .rich-text-editor .ql-container {
          border: 1px solid #374151;
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;