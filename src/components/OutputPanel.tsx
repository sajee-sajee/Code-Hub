
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  className?: string;
  onInput?: (input: string) => void;
  waitingForInput?: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
  output, 
  className, 
  onInput, 
  waitingForInput = false
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const outputEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (onInput && userInput.trim()) {
      onInput(userInput);
      setUserInput('');
    }
  };
  
  // Scroll to bottom when output changes
  React.useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  return (
    <div className={cn("bg-editor-background rounded-md p-4 flex flex-col", className)}>
      <div className="flex-grow overflow-auto mb-4">
        <pre className="text-editor-text font-mono whitespace-pre-wrap">
          {output || 'Output will appear here after execution...'}
          <div ref={outputEndRef} />
        </pre>
      </div>
      
      {waitingForInput && (
        <form onSubmit={handleSubmitInput} className="flex items-center gap-2 mt-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input here..."
            className="flex-grow bg-background/50 border-editor-lineNumber"
            autoFocus
          />
          <Button type="submit" variant="outline" size="icon">
            <SendHorizontal size={16} />
          </Button>
        </form>
      )}
    </div>
  );
};

export default OutputPanel;
