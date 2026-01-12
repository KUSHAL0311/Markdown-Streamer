import { useState, useRef, useEffect } from "react";
import MarkdownParser from "@/lib/MarkdownParser";
import { PaneContainer } from "@/components/PaneContainer";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, FileCode, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_MARKDOWN = `# Streaming Parser Demo

Welcome to the **future** of text processing. This parser handles streams optimistically.

Here is inline code: \`console.log('Hello World')\`

And a code block that might be incomplete during streaming:

\`\`\`javascript
function simulateStream() {
  return new Promise(resolve => {
    setTimeout(resolve, 50);
  });
}
\`\`\`

## Features
- Optimistic closing of tags
- Real-time rendering
- Fast and lightweight

Try typing in the left pane!
`;

export default function Home() {
  const [input, setInput] = useState("");
  const [parsedHtml, setParsedHtml] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const parserRef = useRef(new MarkdownParser());
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Update parsed HTML whenever input changes
  useEffect(() => {
    const html = parserRef.current.parse(input);
    setParsedHtml(html);
  }, [input]);

  const handleSimulate = () => {
    if (isSimulating) {
      // Stop simulation
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
      setIsSimulating(false);
      return;
    }

    // Start simulation
    setInput("");
    setIsSimulating(true);
    let index = 0;

    simulationInterval.current = setInterval(() => {
      if (index < SAMPLE_MARKDOWN.length) {
        setInput((prev) => prev + SAMPLE_MARKDOWN.charAt(index));
        index++;
      } else {
        if (simulationInterval.current) {
          clearInterval(simulationInterval.current);
        }
        setIsSimulating(false);
      }
    }, 30); // 30ms per character
  };

  const handleClear = () => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);
    setIsSimulating(false);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              StreamMark
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="hidden sm:flex border-border/50 hover:bg-secondary/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              onClick={handleSimulate}
              className={`
                shadow-lg shadow-primary/20 transition-all duration-300
                ${isSimulating 
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-destructive/20" 
                  : "bg-primary text-primary-foreground hover:translate-y-[-1px] hover:shadow-primary/30"
                }
              `}
            >
              {isSimulating ? (
                <>Stop Simulation</>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Simulate Stream
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Editor Pane */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full min-h-[400px]"
          >
            <PaneContainer 
              title="Markdown Input" 
              icon={<FileCode className="w-4 h-4" />}
              className="bg-card/50"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your markdown here..."
                className="w-full h-full p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed outline-none"
                spellCheck={false}
              />
              
              {/* Floating clear button for mobile */}
              <div className="absolute bottom-4 right-4 sm:hidden">
                 <Button 
                    variant="secondary" 
                    size="icon" 
                    onClick={handleClear}
                    className="shadow-md rounded-full"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
              </div>
            </PaneContainer>
          </motion.div>

          {/* Preview Pane */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="h-full min-h-[400px]"
          >
            <PaneContainer 
              title="Live Preview" 
              icon={<Eye className="w-4 h-4" />}
              action={
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live
                </div>
              }
              className="bg-card"
            >
              <div className="p-6 prose-custom h-full w-full">
                {input ? (
                  <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Preview will appear here</p>
                  </div>
                )}
              </div>
            </PaneContainer>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
