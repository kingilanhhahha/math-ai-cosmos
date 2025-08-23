import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle, Lightbulb, Target, AlertTriangle, Trophy } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import earth1 from '../../planet background/EARTH 1.jpeg';
import earth2 from '../../planet background/EARTH 2.jpeg';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/database';

const EarthLesson: React.FC = () => {
  const { toast } = useToast();
  const { awardXP } = usePlayer();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [equationsSolved, setEquationsSolved] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const startRef = useRef<number>(Date.now());
  const [skills, setSkills] = useState<Record<string, { correct: number; total: number }>>({
    lcdFinding: { correct: 0, total: 0 },
    solvingProcess: { correct: 0, total: 0 },
    restrictions: { correct: 0, total: 0 },
    extraneousSolutions: { correct: 0, total: 0 },
    factoring: { correct: 0, total: 0 },
    algebra: { correct: 0, total: 0 },
  });

  useEffect(() => { startRef.current = Date.now(); }, []);

  // Two Earth background images; alternate every slide
  const earthBackgrounds = [
    earth1,
    earth2
  ];

  const saveProgress = async () => {
    try {
      const total = equationsSolved.length + mistakes.length;
      const score = total > 0 ? Math.round((equationsSolved.length / total) * 100) : 0;
      const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
      await db.saveStudentProgress({
        studentId: user?.id || 'guest',
        moduleId: 'lesson-earth',
        moduleName: 'Earth — Clearing Denominators',
        completedAt: new Date(),
        score,
        timeSpent: minutes,
        equationsSolved,
        mistakes,
        skillBreakdown: skills,
      } as any);
      toast({ title: 'Saved', description: 'Your Earth lesson results were saved.' });
    } catch (e) {
      toast({ title: 'Save failed', description: 'Could not save progress. Will retry later.', variant: 'destructive' });
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Eliminate Denominators with the LCD',
      icon: <Target className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-card-foreground">Multiply <strong>every term</strong> on both sides by the LCD to clear fractions.</p>
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <BlockMath math={'(x+2)(x-2) \\cdot \\frac{1}{x+2} + (x+2)(x-2) \\cdot \\frac{1}{x-2} = (x+2)(x-2) \\cdot \\frac{3}{x^2-4}'} />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Show Cancellation Explicitly',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <BlockMath math={'\\cancel{(x+2)}(x-2) \\cdot \\frac{1}{\\cancel{(x+2)}} + (x+2)\\cancel{(x-2)} \\cdot \\frac{1}{\\cancel{(x-2)}} = 3'} />
          </div>
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <BlockMath math={'x-2 + (x+2) = 3'} />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Solve the Resulting Equation',
      icon: <Calculator className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <BlockMath math={'2x = 3 \\;\\Rightarrow\\; x = \\tfrac{3}{2}'} />
          </div>
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <p className="text-sm text-muted-foreground">Always solve after combining like terms.</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Verify Against Restrictions',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <div className="bg-card/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.15)]">
            <p className="text-sm text-card-foreground mb-2">Restrictions come from denominators only.</p>
            <BlockMath math={'x \\neq 2,\\; -2'} />
            <p className="text-sm text-muted-foreground mt-2">Since <InlineMath math={'x=\\tfrac{3}{2}'} /> is not restricted, it’s valid.</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Mini Assessment — Clearing Denominators',
      icon: <Trophy className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-card/30 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Question 1</h4>
            <div className="flex justify-center mb-3">
              <BlockMath math={'\\frac{1}{x} + \\frac{2}{x+1} = 3'} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">Multiply both sides by which LCD?</p>
            <div className="grid grid-cols-2 gap-2">
              {['x(x+1)', 'x+1', 'x', 'x^2+x'].map((a) => (
                <Button
                  key={a}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (a === 'x(x+1)') {
                      setEquationsSolved(prev => [...prev, 'Chose LCD: x(x+1)']);
                      setSkills(prev => ({ ...prev, lcdFinding: { correct: prev.lcdFinding.correct + 1, total: prev.lcdFinding.total + 1 } }));
                      awardXP(50, 'earth-q1');
                      toast({ title: 'Correct!', description: 'Use the product of unique factors.' });
                    } else {
                      setSkills(prev => ({ ...prev, lcdFinding: { ...prev.lcdFinding, total: prev.lcdFinding.total + 1 } }));
                      setMistakes(prev => [...prev, `LCD mistake for 1/x + 2/(x+1): chose ${a}`]);
                      toast({ title: 'Not quite', description: 'Include all unique factors.', variant: 'destructive' });
                    }
                  }}
                  className="hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card/30 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Question 2</h4>
            <div className="flex justify-center mb-3">
              <BlockMath math={'(x+1)(x-1) \\cdot \\frac{1}{x+1} + (x+1)(x-1) \\cdot \\frac{1}{x-1)'} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">After cancellation, which equation remains?</p>
            <div className="grid grid-cols-2 gap-2">
              {['x-1 + x+1 = 3', 'x+1 + x-1 = 3', '2x = 3', 'x^2-1 = 3'].map((a) => (
                <Button
                  key={a}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (a === '2x = 3') {
                      setEquationsSolved(prev => [...prev, 'Simplified correctly to 2x = 3']);
                      setSkills(prev => ({ ...prev, solvingProcess: { correct: prev.solvingProcess.correct + 1, total: prev.solvingProcess.total + 1 } }));
                      awardXP(50, 'earth-q2');
                      toast({ title: 'Great!', description: 'You showed the correct cancellation.' });
                    } else {
                      setSkills(prev => ({ ...prev, solvingProcess: { ...prev.solvingProcess, total: prev.solvingProcess.total + 1 } }));
                      setMistakes(prev => [...prev, `Wrong simplification choice: ${a}`]);
                      toast({ title: 'Incorrect', description: 'Track each term’s cancellation.', variant: 'destructive' });
                    }
                  }}
                  className="hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-accent/20 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <h4 className="font-semibold text-accent mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Tip</h4>
            <p className="text-sm text-card-foreground">Distribute LCD to <strong>every term</strong> and show cancellations explicitly to avoid mistakes.</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveProgress} className="mt-2">Finish Lesson</Button>
          </div>

          <div className="bg-primary/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <h4 className="font-semibold text-primary mb-2">Your Results</h4>
            <ul className="text-sm space-y-1">
              {equationsSolved.map((s, i) => (
                <li key={i} className="text-success flex items-center gap-2"><CheckCircle size={14} /> {s}</li>
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

  const prev = () => {
    if (current > 0) {
      const n = current - 1;
      setCurrent(n);
      setProgress((n / (steps.length - 1)) * 100);
    }
  };
  const next = () => {
    if (current < steps.length - 1) {
      const n = current + 1;
      setCurrent(n);
      setProgress((n / (steps.length - 1)) * 100);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Earth background drift */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${earthBackgrounds[current % earthBackgrounds.length]})` }}
        animate={{ scale: [1.06, 1.09, 1.06], x: [0, 12, 0], y: [0, 8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Vignette/gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.55)' }} />

      <motion.header className="p-6 border-b border-white/10 backdrop-blur-sm relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Calculator className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Earth — Clearing Denominators</h1>
              <p className="text-xs text-white/80">Lesson 3</p>
            </div>
          </div>
          <Badge variant="secondary">{current + 1} / {steps.length}</Badge>
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
            key={steps[current].id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shadow-[0_10px_50px_rgba(0,0,0,0.25)]"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.15)]">{steps[current].icon ?? <Target className="w-5 h-5" />}</div>
                <h2 className="font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {steps[current].title}
                </h2>
              </div>
              {steps[current].content}
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={prev} disabled={current === 0} className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button onClick={next} disabled={current === steps.length - 1} className="flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthLesson;


