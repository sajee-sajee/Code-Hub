
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }) => {
  return (
    <Select value={language} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="cpp">C++</SelectItem>
        <SelectItem value="java">Java</SelectItem>
        <SelectItem value="javascript">JavaScript</SelectItem>
        <SelectItem value="html">HTML</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
