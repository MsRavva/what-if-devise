'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startTyping = () => {
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextChar();
    };

    timeout = setTimeout(startTyping, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  // Blink cursor
  useEffect(() => {
    if (isComplete && !cursor) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [isComplete, cursor]);

  return (
    <span className={cn('font-serif', className)}>
      {displayText}
      {cursor && (
        <span 
          className={cn(
            'inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle transition-opacity duration-100',
            showCursor ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </span>
  );
}

interface TypewriterParagraphProps {
  lines: string[];
  className?: string;
  lineDelay?: number;
  charSpeed?: number;
}

export function TypewriterParagraph({
  lines,
  className,
  lineDelay = 1000,
  charSpeed = 30
}: TypewriterParagraphProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const timer = setTimeout(() => {
      setCompletedLines(prev => [...prev, lines[currentLine]]);
      setCurrentLine(prev => prev + 1);
    }, lineDelay);

    return () => clearTimeout(timer);
  }, [currentLine, lines, lineDelay]);

  return (
    <div className={className}>
      {completedLines.map((line, index) => (
        <p key={index} className="mb-2">
          <TypewriterText 
            text={line} 
            speed={charSpeed}
            cursor={index === completedLines.length - 1 && currentLine >= lines.length}
          />
        </p>
      ))}
      {currentLine < lines.length && (
        <p className="mb-2">
          <TypewriterText 
            text={lines[currentLine]} 
            speed={charSpeed}
            cursor={true}
          />
        </p>
      )}
    </div>
  );
}
