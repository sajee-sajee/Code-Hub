
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import ActionBar from '@/components/ActionBar';
import ShareDialog from '@/components/ShareDialog';
import { Card, CardContent } from '@/components/ui/card';
import { compileAndRun, generateShareableUrl, getCodeDataFromUrl, downloadCode, getSampleCode, type CodeData } from '@/lib/codeUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [pendingInputResolver, setPendingInputResolver] = useState<((value: string) => void) | null>(null);
  const { toast } = useToast();

  // Check for shared code in URL
  useEffect(() => {
    const codeData = getCodeDataFromUrl();
    if (codeData) {
      setLanguage(codeData.language);
      setCode(codeData.code);
      if (codeData.output) {
        setOutput(codeData.output);
      }
      toast({
        title: "Code loaded",
        description: "Shared code has been loaded successfully",
      });
    } else {
      // Load sample code for the selected language
      setCode(getSampleCode(language));
    }
  }, []);

  // Update sample code when language changes
  useEffect(() => {
    if (code === '' || code === getSampleCode('python') || code === getSampleCode('cpp') || 
        code === getSampleCode('java') || code === getSampleCode('javascript') || code === getSampleCode('html')) {
      setCode(getSampleCode(language));
    }
  }, [language]);

  const handleUserInput = (input: string) => {
    if (pendingInputResolver) {
      pendingInputResolver(input);
      setPendingInputResolver(null);
      setWaitingForInput(false);
      
      // Append the user input to the output
      setOutput(prev => prev + input + '\n');
    }
  };

  const inputCallback = async (prompt: string): Promise<string> => {
    return new Promise(resolve => {
      setInputPrompt(prompt);
      setWaitingForInput(true);
      setPendingInputResolver(() => resolve);
      
      // Add the prompt to the output
      setOutput(prev => prev + prompt + ' ');
    });
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to run",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setOutput('Running...\n');
    setWaitingForInput(false);
    setPendingInputResolver(null);
    
    try {
      const result = await compileAndRun(code, language, inputCallback);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Execution failed",
        description: "There was an error running your code",
        variant: "destructive",
      });
    } finally {
      if (!waitingForInput) {
        setIsRunning(false);
      }
    }
  };

  const handleShare = () => {
    const codeData: CodeData = {
      code,
      language,
      output
    };
    
    const url = generateShareableUrl(codeData);
    setShareUrl(url);
    setShareDialogOpen(true);
  };

  const handleDownload = () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to download",
        variant: "destructive",
      });
      return;
    }
    
    downloadCode(code, language);
    toast({
      title: "Downloaded",
      description: `Your ${language} code has been downloaded`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 animate-fade-in">
      <header className="mb-8 flex items-center">
        <i className="bi bi-alt text-4xl mr-4 text-primary"></i>
        <div>
          <h1 className="text-3xl font-bold mb-1">Code Hub</h1>
          <p className="text-muted-foreground">
            Wanna Code
          </p>
        </div>
      </header>
      
      <ActionBar
        language={language}
        onLanguageChange={setLanguage}
        onRun={handleRun}
        onShare={handleShare}
        onDownload={handleDownload}
        code={code}
        isRunning={isRunning}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 flex-grow">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            <h2 className="text-lg font-medium mb-2">Code Editor</h2>
            <CodeEditor
              language={language}
              value={code}
              onChange={setCode}
              className="h-[calc(100%-2rem)]"
            />
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            <h2 className="text-lg font-medium mb-2">Output</h2>
            <OutputPanel
              output={output}
              className="h-[calc(100%-2rem)]"
              onInput={handleUserInput}
              waitingForInput={waitingForInput}
            />
          </CardContent>
        </Card>
      </div>
      
      <footer className="text-center text-sm text-muted-foreground pt-4">
        <p>CodeShare - Compile and share your code easily</p>
      </footer>
      
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default Index;

