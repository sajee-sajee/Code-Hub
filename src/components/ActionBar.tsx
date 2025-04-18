
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Play, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from './LanguageSelector';

interface ActionBarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onShare: () => void;
  onDownload: () => void;
  code: string;
  isRunning: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  language,
  onLanguageChange,
  onRun,
  onShare,
  onDownload,
  code,
  isRunning
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        <LanguageSelector language={language} onChange={onLanguageChange} />
        <Button 
          variant="default" 
          className="gap-1" 
          onClick={onRun}
          disabled={isRunning}
        >
          <Play size={16} />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={onShare}>
          <Share2 size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={onDownload}>
          <Download size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
