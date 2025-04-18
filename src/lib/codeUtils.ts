
import { toast } from '@/components/ui/use-toast';

export interface CodeData {
  code: string;
  language: string;
  output?: string;
}

// Mock function for compilation - in a real app, this would connect to a backend service
export const compileAndRun = async (
  code: string, 
  language: string, 
  inputCallback?: (prompt: string) => Promise<string>
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Simple mock responses based on language
    switch (language) {
      case 'python':
        // Check for input() function in Python
        if (code.includes('input(')) {
          if (!inputCallback) {
            return 'Error: This code requires user input, but input handling is not available.';
          }
          
          // Simple simulation of Python input() function
          let output = 'Python output:\n';
          const inputRegex = /input\(['"]?(.*?)['"]?\)/g;
          let match;
          let modifiedCode = code;
          
          while ((match = inputRegex.exec(code)) !== null) {
            const prompt = match[1] || 'Enter input:';
            const userInput = await inputCallback(prompt);
            output += `${prompt} ${userInput}\n`;
            modifiedCode = modifiedCode.replace(match[0], `"${userInput}"`);
          }
          
          if (modifiedCode.includes('print(')) {
            const printMatch = modifiedCode.match(/print\(['"](.+)['"]\)/);
            if (printMatch) {
              output += printMatch[1] + '\n';
            }
          }
          
          return output;
        } else if (code.includes('print(')) {
          return 'Python output: ' + code.match(/print\(['"](.+)['"]\)/)?.[1] || 'Hello from Python';
        }
        return 'Python code executed successfully!';
      
      case 'cpp':
        // Check for cin in C++
        if (code.includes('cin >>')) {
          if (!inputCallback) {
            return 'Error: This code requires user input, but input handling is not available.';
          }
          
          let output = 'C++ output:\n';
          const cinRegex = /cin\s*>>\s*(\w+)/g;
          let match;
          
          while ((match = cinRegex.exec(code)) !== null) {
            const variableName = match[1];
            const userInput = await inputCallback(`Enter value for ${variableName}:`);
            output += `${variableName} = ${userInput}\n`;
          }
          
          if (code.includes('cout <<')) {
            const coutMatch = code.match(/cout\s*<<\s*["'](.+)["']/);
            if (coutMatch) {
              output += coutMatch[1] + '\n';
            }
          }
          
          return output;
        } else if (code.includes('cout <<')) {
          return 'C++ output: ' + code.match(/cout\s*<<\s*["'](.+)["']/)?.[1] || 'Hello from C++';
        }
        return 'C++ code compiled and executed successfully!';
      
      case 'java':
        // Check for Scanner in Java
        if (code.includes('Scanner') && code.includes('.nextLine()') || code.includes('.next()')) {
          if (!inputCallback) {
            return 'Error: This code requires user input, but input handling is not available.';
          }
          
          let output = 'Java output:\n';
          const scannerRegex = /\.next(?:Line|Int|Double)?\(\)/g;
          let match;
          
          while ((match = scannerRegex.exec(code)) !== null) {
            const methodName = match[0];
            const prompt = `Enter input for ${methodName}:`;
            const userInput = await inputCallback(prompt);
            output += `${prompt} ${userInput}\n`;
          }
          
          if (code.includes('System.out.println')) {
            const printlnMatch = code.match(/System\.out\.println\(["'](.+)["']\)/);
            if (printlnMatch) {
              output += printlnMatch[1] + '\n';
            }
          }
          
          return output;
        } else if (code.includes('System.out.println')) {
          return 'Java output: ' + code.match(/System\.out\.println\(["'](.+)["']\)/)?.[1] || 'Hello from Java';
        }
        return 'Java code compiled and executed successfully!';
      
      case 'javascript':
        // Check for prompt in JavaScript
        if (code.includes('prompt(')) {
          if (!inputCallback) {
            return 'Error: This code requires user input, but input handling is not available.';
          }
          
          let output = 'JavaScript output:\n';
          const promptRegex = /prompt\(["'](.+)["']\)/g;
          let match;
          
          while ((match = promptRegex.exec(code)) !== null) {
            const promptMessage = match[1] || 'Enter input:';
            const userInput = await inputCallback(promptMessage);
            output += `${promptMessage} ${userInput}\n`;
          }
          
          if (code.includes('console.log')) {
            const consoleMatch = code.match(/console\.log\(["'](.+)["']\)/);
            if (consoleMatch) {
              output += consoleMatch[1] + '\n';
            }
          }
          
          return output;
        } else if (code.includes('console.log')) {
          return 'JavaScript output: ' + code.match(/console\.log\(["'](.+)["']\)/)?.[1] || 'Hello from JavaScript';
        }
        return 'JavaScript code executed successfully!';
      
      case 'html':
        // For HTML, return that it would be rendered
        return 'HTML would be rendered in a real environment';
      
      default:
        return 'Code execution completed';
    }
  } catch (error) {
    console.error('Error in compilation:', error);
    return 'Error during execution. Please check your code.';
  }
};

// Generate a shareable URL with the code data
export const generateShareableUrl = (codeData: CodeData): string => {
  const baseUrl = window.location.origin;
  const encodedData = encodeURIComponent(JSON.stringify(codeData));
  return `${baseUrl}?code=${encodedData}`;
};

// Extract code data from URL if present
export const getCodeDataFromUrl = (): CodeData | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const codeParam = urlParams.get('code');
  
  if (codeParam) {
    try {
      return JSON.parse(decodeURIComponent(codeParam));
    } catch (error) {
      console.error('Error parsing code data from URL:', error);
      return null;
    }
  }
  
  return null;
};

// Prepare and download code as a file
export const downloadCode = (code: string, language: string): void => {
  // Determine file extension based on language
  const extensions: Record<string, string> = {
    python: 'py',
    cpp: 'cpp',
    java: 'java',
    javascript: 'js',
    html: 'html'
  };
  
  const extension = extensions[language] || 'txt';
  const fileName = `code.${extension}`;
  
  // Create a blob and download it
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Get sample code based on selected language
export const getSampleCode = (language: string): string => {
  switch (language) {
    case 'python':
      return `# Python Sample with Input
name = input("Enter your name: ")
print(f"Hello, {name}!")
`;
    
    case 'cpp':
      return `// C++ Sample with Input
#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`;
    
    case 'java':
      return `// Java Sample with Input
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}`;
    
    case 'javascript':
      return `// JavaScript Sample with Input
const name = prompt("Enter your name:");
console.log(\`Hello, \${name}!\`);`;
    
    case 'html':
      return `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 2em;
        }
        h1 {
            color: #0066cc;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>`;
    
    default:
      return '// Write your code here';
  }
};
