
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language, 
  value, 
  onChange, 
  className 
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lines, setLines] = useState<string[]>(['']);

  useEffect(() => {
    setLines(value.split('\n'));
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setLines(e.target.value.split('\n'));
  };

  return (
    <div className={cn("relative bg-editor-background rounded-md", className)}>
      <div className="flex">
        <div className="editor-line-numbers py-2 select-none">
          {lines.map((_, i) => (
            <div key={i} className="px-2">{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="editor-content py-2 pl-2 pr-4 w-full bg-transparent resize-none code-editor"
          spellCheck="false"
          data-language={language}
          rows={Math.max(lines.length, 10)}
        />
      </div>
      <div className="absolute bottom-2 right-3 text-xs text-editor-lineNumber">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor;
