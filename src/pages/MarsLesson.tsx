import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, AlertTriangle, Calculator, CheckCircle, Target, Trophy } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import marsPng from '@/components/other planets/mars.png';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/database';

const MarsLesson: React.FC = () => {
  const { toast } = useToast();
  const { awardXP } = usePlayer();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [wins, setWins] = useState<string[]>([]);
  const [errs, setErrs] = useState<string[]>([]);
  const startRef = useRef<number>(Date.now());
  const [skills, setSkills] = useState<Record<string, { correct: number; total: number }>>({
    extraneousSolutions: { correct: 0, total: 0 },
    restrictions: { correct: 0, total: 0 },
    lcdFinding: { correct: 0, total: 0 },
    solvingProcess: { correct: 0, total: 0 },
    factoring: { correct: 0, total: 0 },
    algebra: { correct: 0, total: 0 },
  });

  useEffect(() => { startRef.current = Date.now(); }, []);

  // Prefer WEBP, fallback to bundled PNG if WEBP fails to load or is unsupported
  const [bgSrc, setBgSrc] = useState<string>(new URL('../../planet background/MARS.webp', import.meta.url).href);

  const saveProgress = async () => {
    try {
      const total = wins.length + errs.length;
      const score = total > 0 ? Math.round((wins.length / total) * 100) : 0;
      const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
      await db.saveStudentProgress({
        studentId: user?.id || 'guest',
        moduleId: 'lesson-mars',
        moduleName: 'Mars — Extraneous Solutions',
        completedAt: new Date(),
        score,
        timeSpent: minutes,
        equationsSolved: wins,
        mistakes: errs,
        skillBreakdown: skills,
      } as any);
      toast({ title: 'Saved', description: 'Your Mars lesson results were saved.' });
    } catch (e) {
      toast({ title: 'Save failed', description: 'Could not save progress. Will retry later.', variant: 'destructive' });
    }
  };

  const slides = [
    {
      id: 1,
      title: 'Why Extraneous Solutions Appear',
      icon: <Target className="w-5 h-5" />,
      body: (
        <div className="space-y-3">
          <p className="text-white/90">When you multiply both sides by an expression that can be <strong>zero</strong>, you may create solutions that weren’t allowed originally.</p>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <InlineMath math={'x \\neq 1 \\text{ for } \\dfrac{x}{x-1}'} />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Worked Example — Check for Extraneous',
      icon: <AlertTriangle className="w-5 h-5" />,
      body: (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <BlockMath math={'\\frac{x}{x-1} = \\frac{1}{x-1} + 2'} />
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/90 mb-2">Multiply by <InlineMath math={'x-1'} /> and simplify:</p>
            <BlockMath math={'x = 1 + 2(x-1)'} />
            <BlockMath math={'x = 2x - 1 \\;\\Rightarrow\\; -x = -1 \\;\\Rightarrow\\; x = 1'} />
            <p className="text-sm text-white/80 mt-2">But <InlineMath math={'x=1'} /> is <strong>forbidden</strong> (denominator zero) → extraneous → <strong>No solution</strong>.</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Mini Assessment — Spot the Extraneous',
      icon: <Trophy className="w-5 h-5" />,
      body: (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-2">Question 1</h4>
            <div className="flex justify-center mb-3">
              <BlockMath math={'\\frac{x}{x-2} = \\frac{1}{x-2} + 1'} />
            </div>
            <p className="text-sm text-white/80 mb-3">If you solve and get <InlineMath math={'x=2'} />, what’s the conclusion?</p>
            <div className="grid grid-cols-2 gap-2">
              {['Accept x = 2', 'Reject x = 2 as extraneous', 'Try squaring both sides', 'Multiply by x'].map((a) => (
                <Button
                  key={a}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (a === 'Reject x = 2 as extraneous') {
                      setWins(prev => [...prev, 'Correctly rejected extraneous solution (x=2)']);
                      setSkills(prev => ({ ...prev, extraneousSolutions: { correct: prev.extraneousSolutions.correct + 1, total: prev.extraneousSolutions.total + 1 } }));
                      awardXP(50, 'mars-q1');
                      toast({ title: 'Correct!', description: 'x=2 makes the denominator zero.' });
                    } else {
                      setSkills(prev => ({ ...prev, extraneousSolutions: { ...prev.extraneousSolutions, total: prev.extraneousSolutions.total + 1 } }));
                      setErrs(prev => [...prev, `Extraneous check mistake: chose ${a}`]);
                      toast({ title: 'Incorrect', description: 'Values that zero denominators must be rejected.', variant: 'destructive' });
                    }
                  }}
                  className="hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-2">Question 2</h4>
            <div className="flex justify-center mb-3">
              <BlockMath math={'\\frac{1}{x+3} + \\frac{2}{x-3} = \\frac{3}{x^2-9}'} />
            </div>
            <p className="text-sm text-white/80 mb-3">Which values must be excluded?</p>
            <div className="grid grid-cols-2 gap-2">
              {['x = 3, -3', 'x = 3 only', 'x = -3 only', 'x = 0'].map((a) => (
                <Button
                  key={a}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (a === 'x = 3, -3') {
                      setWins(prev => [...prev, 'Identified restrictions: x≠3,-3']);
                      setSkills(prev => ({ ...prev, restrictions: { correct: prev.restrictions.correct + 1, total: prev.restrictions.total + 1 } }));
                      awardXP(50, 'mars-q2');
                      toast({ title: 'Great!', description: 'x^2-9=(x+3)(x-3).' });
                    } else {
                      setSkills(prev => ({ ...prev, restrictions: { ...prev.restrictions, total: prev.restrictions.total + 1 } }));
                      setErrs(prev => [...prev, `Restriction mistake: chose ${a}`]);
                      toast({ title: 'Not quite', description: 'Factor denominators to find all zeros.', variant: 'destructive' });
                    }
                  }}
                  className="hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveProgress} className="mt-2">Finish Lesson</Button>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-2">Your Results</h4>
            <ul className="text-sm space-y-1">
              {wins.map((s, i) => (
                <li key={i} className="text-green-300 flex items-center gap-2"><CheckCircle size={14} /> {s}</li>
              ))}
            </ul>
            {errs.length > 0 && (
              <div className="mt-3">
                <h5 className="font-semibold text-destructive mb-1">Needs Attention</h5>
                <ul className="text-xs space-y-1">
                  {errs.map((m, i) => (
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
    if (index > 0) {
      const n = index - 1;
      setIndex(n);
      setProgress((n / (slides.length - 1)) * 100);
    }
  };
  const next = () => {
    if (index < slides.length - 1) {
      const n = index + 1;
      setIndex(n);
      setProgress((n / (slides.length - 1)) * 100);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* WebP-first background with PNG fallback */}
      <motion.img
        src={bgSrc}
        onError={() => setBgSrc(marsPng)}
        alt="Mars Background"
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: [1.05, 1.08, 1.05], x: [0, 10, 0], y: [0, 6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 180px rgba(0,0,0,0.55)' }} />

      <motion.header className="p-6 border-b border-white/10 backdrop-blur-sm relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Calculator className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-xl bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">Mars — Extraneous Solutions</h1>
              <p className="text-xs text-white/80">Lesson 4</p>
            </div>
          </div>
          <Badge variant="secondary">{index + 1} / {slides.length}</Badge>
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

          <motion.div key={slides[index].id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} whileHover={{ scale: 1.01 }} className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
            <div className="p-6">
              <div className="flex items=center gap-2 mb-3">
                {slides[index].icon ?? <AlertTriangle size={16} className="text-warning" />}
                <h2 className="font-semibold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">{slides[index].title}</h2>
              </div>
              {slides[index].body}
            </div>
          </motion.div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={prev} disabled={index === 0} className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button onClick={next} disabled={index === slides.length - 1} className="flex items-center gap-2 hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]">
              Next <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarsLesson;


