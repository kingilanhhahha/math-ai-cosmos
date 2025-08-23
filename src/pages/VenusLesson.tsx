import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Brain,
  Calculator,
  AlertTriangle
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
const venusBg = new URL('../../planet background/SATURN.jpeg', import.meta.url).href;

const VenusLesson: React.FC = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [equationsSolved, setEquationsSolved] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);

  const sections = [
    {
      id: 1,
      title: 'What is the LCD and Why It Matters',
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
            <h3 className="font-orbitron text-xl bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-3">Definition</h3>
            <p className="text-white/90 mb-3">
              The <strong>Least Common Denominator (LCD)</strong> is the product of all <strong>unique linear factors</strong> from every denominator, each raised to the <strong>highest power</strong> that appears.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-center mb-2">
                  <BlockMath math={'x^2 - 4 = (x+2)(x-2)'} />
                </div>
                <p className="text-xs text-white/80">Difference of squares factoring.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-center mb-2">
                  <BlockMath math={'\\text{LCD of }\\; \\frac{1}{x+2},\\; \\frac{1}{x-2},\\; \\frac{1}{x^2-4}'} />
                  <BlockMath math={'= (x+2)(x-2)'} />
                </div>
                <p className="text-xs text-white/80">Use each unique factor once with max exponent.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Prime Factorization of Denominators',
      icon: <Brain className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/90">Factor each denominator completely before building the LCD.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <BlockMath math={'\\frac{1}{x+1},\\; \\frac{2}{x-3}'} />
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <BlockMath math={'\\text{LCD} = (x+1)(x-3)'} />
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <BlockMath math={'\\frac{1}{x^2-1},\\; \\frac{1}{x-1}'} />
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <BlockMath math={'x^2-1=(x-1)(x+1)\\;\\Rightarrow\\;\\text{LCD}=(x-1)(x+1)'} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Build LCD + Identify Restrictions',
      icon: <Lightbulb className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h4 className="font-semibold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-2">Rule</h4>
            <ul className="list-disc list-inside text-sm text-white/90 space-y-1">
              <li>Use each unique linear factor from denominators.</li>
              <li>Pick the highest power that occurs among denominators.</li>
              <li>Restrictions: values that make any denominator zero.</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-center mb-2">
              <BlockMath math={'\\frac{1}{x+1}+\\frac{2}{x-3}=\\frac{3}{x^2-2x-3}'} />
              <BlockMath math={'x^2-2x-3=(x-3)(x+1)'} />
              <BlockMath math={'\\text{LCD}=(x+1)(x-3),\\;\\text{Restrictions: }x\\neq -1,\\;3'} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Multiply by LCD and Show Cancellation',
      icon: <Calculator className="w-6 h-6" />,
      content: (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-center mb-2">
              <BlockMath math={'(x+1)(x-3)\\left(\\frac{1}{x+1}+\\frac{2}{x-3}\\right)=(x+1)(x-3)\\cdot \\frac{3}{(x+1)(x-3)}'} />
            </div>
            <div className="text-center">
              <BlockMath math={'\\cancel{(x+1)}(x-3)\\cdot\\frac{1}{\\cancel{(x+1)}} + (x+1)\\cancel{(x-3)}\\cdot\\frac{2}{\\cancel{(x-3)}}=3'} />
            </div>
            <div className="text-center">
              <BlockMath math={'x-3 + 2(x+1) = 3'} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Solve and Check',
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-2">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <BlockMath math={'x-3 + 2x + 2 = 3 \\;\\Rightarrow\\; 3x -1 = 3 \\;\\Rightarrow\\; 3x = 4 \\;\\Rightarrow\\; x=\\tfrac{4}{3}'} />
            </div>
            <p className="text-sm text-white/80 mt-2">Check: <InlineMath math={'x=\\tfrac{4}{3}'} /> is not a restriction, so it’s valid.</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Assessment — Finding LCDs',
      icon: <Trophy className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
            <h3 className="font-orbitron text-lg bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-4">Quick Questions</h3>
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h4 className="font-semibold text-white mb-2">Question 1</h4>
                <div className="flex justify-center mb-3">
                  <BlockMath math={'\\frac{1}{x} + \\frac{2}{x+2}'} />
                </div>
                <p className="text-sm text-white/80 mb-3">What is the LCD?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['x(x+2)', 'x+2', 'x', 'x^2+2x'].map((a) => (
                    <Button
                      key={a}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (a === 'x(x+2)') {
                          setEquationsSolved(prev => [...prev, 'Found LCD: x(x+2)']);
                          toast({ title: 'Correct!', description: 'Product of unique factors.' });
                        } else {
                          setMistakes(prev => [...prev, `LCD mistake for 1/x + 2/(x+2): chose ${a}`]);
                          toast({ title: 'Try again', description: 'Use each unique factor.', variant: 'destructive' });
                        }
                      }}
                      className="hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h4 className="font-semibold text-white mb-2">Question 2</h4>
                <div className="flex justify-center mb-3">
                  <BlockMath math={'\\frac{1}{x^2-1} + \\frac{3}{x-1}'} />
                </div>
                <p className="text-sm text-white/80 mb-3">Choose the correct LCD:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['(x-1)(x+1)', 'x^2-1', '(x-1)', '(x+1)'].map((a) => (
                    <Button
                      key={a}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (a === '(x-1)(x+1)') {
                          setEquationsSolved(prev => [...prev, 'Factored LCD: (x-1)(x+1)']);
                          toast({ title: 'Great!', description: 'Use factored form with highest powers.' });
                        } else {
                          setMistakes(prev => [...prev, `LCD mistake for 1/(x^2-1)+3/(x-1): chose ${a}`]);
                          toast({ title: 'Not quite', description: 'Remember to include all unique factors.', variant: 'destructive' });
                        }
                      }}
                      className="hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h4 className="font-semibold text-white mb-2">Question 3</h4>
                <div className="flex justify-center mb-3">
                  <BlockMath math={'\\frac{2}{(x+2)^2} + \\frac{1}{x+2}'} />
                </div>
                <p className="text-sm text-white/80 mb-3">LCD is?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['(x+2)', '(x+2)^2', '(x+2)^3', '(x+2)^4'].map((a) => (
                    <Button
                      key={a}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (a === '(x+2)^2') {
                          setEquationsSolved(prev => [...prev, 'Power LCD: (x+2)^2']);
                          toast({ title: 'Correct!', description: 'Pick the highest power present.' });
                        } else {
                          setMistakes(prev => [...prev, `LCD power mistake: chose ${a}`]);
                          toast({ title: 'Incorrect', description: 'Use max exponent that appears.', variant: 'destructive' });
                        }
                      }}
                      className="hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-accent/20 rounded-xl p-4 border border-white/20">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <AlertTriangle size={16} /> Common Pitfall
              </h4>
              <p className="text-sm text-white/90">
                Do not add denominators to get the LCD. Always factor and <strong>multiply</strong> unique factors.
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h4 className="font-semibold text-white mb-2">Your Results</h4>
            <ul className="text-sm space-y-1">
              {equationsSolved.map((s, i) => (
                <li key={i} className="text-green-300 flex items-center gap-2"><CheckCircle size={14} /> {s}</li>
              ))}
            </ul>
            {mistakes.length > 0 && (
              <div className="mt-3">
                <h5 className="font-semibold text-destructive mb-1">Needs Attention</h5>
                <ul className="text-xs space-y-1">
                  {mistakes.map((m, i) => (
                    <li key={i} className="text-destructive">{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handlePrev = () => {
    if (currentSection > 0) {
      const next = currentSection - 1;
      setCurrentSection(next);
      setProgress((next / (sections.length - 1)) * 100);
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      const next = currentSection + 1;
      setCurrentSection(next);
      setProgress((next / (sections.length - 1)) * 100);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated cosmic background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${venusBg})` }}
        animate={{ scale: [1.06, 1.09, 1.06], x: [0, 10, 0], y: [0, 6, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.55)' }} />

      <motion.header 
        className="p-6 border-b border-white/10 backdrop-blur-sm relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Calculator className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-xl bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Venus — Finding LCDs
              </h1>
              <p className="text-xs text-white/80">Lesson 2</p>
            </div>
          </div>
          <Badge variant="secondary">{currentSection + 1} / {sections.length}</Badge>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white/80 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <motion.div
            key={sections[currentSection].id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shadow-[0_10px_50px_rgba(0,0,0,0.25)]"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.15)]">{sections[currentSection].icon ?? <Target className="w-5 h-5" />}</div>
                <h2 className="font-semibold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  {sections[currentSection].title}
                </h2>
              </div>
              {sections[currentSection].content}
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={handlePrev} disabled={currentSection === 0} className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button onClick={handleNext} disabled={currentSection === sections.length - 1} className="flex items-center gap-2 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenusLesson;


