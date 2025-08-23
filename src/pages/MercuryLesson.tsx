import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Pause,
  Volume2,
  Trophy,
  Zap,
  Brain,
  Calculator,
  Globe,
  Rocket,
  ArrowLeft,
  Home,
  AlertTriangle,
  Star,
  HelpCircle,
  Award,
  Clock,
  Users
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const mercuryBg = new URL('../../planet background/mercury.webp', import.meta.url).href;

const MercuryLesson: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [showDialogue, setShowDialogue] = useState(true);
  const [userLevel] = useState(3);
  const [userXP] = useState(750);
  const [maxXP] = useState(1000);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [quizResults, setQuizResults] = useState<{[key: string]: boolean}>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [equationsSolved, setEquationsSolved] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  
  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>('');
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio files sequence
  const audioSequence = [
    '/src/components/character/Lesson Voices/Mercury/WHATISARATIONALEQUATION 1.mp3',
    '/src/components/character/Lesson Voices/Mercury/WHATISARATIONALEQUATION 2.mp3'
  ];

  // Key Components audio sequence
  const keyComponentsAudioSequence = [
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 1.mp3',
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 2.mp3',
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 3.mp3',
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 4.mp3',
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 5.mp3',
    '/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 6.mp3'
  ];

  // Why Study Rational Equations audio sequence
  const whyStudyAudioSequence = [
    '/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 1.mp3',
    '/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 2.mp3',
    '/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 3.mp3',
    '/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 4.mp3',
    '/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 5.mp3'
  ];

  // Basic Concepts to Review audio (single file)
  const basicConceptsAudio = [
    '/src/components/character/Lesson Voices/Mercury/Basic Concepts to Review.mp3'
  ];

  // Steps to Solve Rational Equations audio (single file)
  const stepsToSolveAudio = [
    '/src/components/character/Lesson Voices/Mercury/Steps To Solve Rational Equations.mp3'
  ];

  // Audio controls
  const toggleAudio = (audioSrc?: string, sequence?: string[]) => {
    console.log('toggleAudio called with:', audioSrc);
    console.log('Current audio state:', { isAudioPlaying, currentAudioSrc, currentAudioIndex });
    
    if (audioRef.current) {
      // If a new audio source is provided, switch to it
      if (audioSrc && audioSrc !== currentAudioSrc) {
        console.log('Setting new audio source:', audioSrc);
        audioRef.current.src = audioSrc;
        setCurrentAudioSrc(audioSrc);
        setCurrentAudioIndex(0); // Start from first audio
        audioRef.current.play().then(() => {
          console.log('Audio started playing successfully');
          setIsAudioPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
          setIsAudioPlaying(false);
        });
        return;
      }
      
      // Otherwise, toggle current audio
      if (isAudioPlaying) {
        console.log('Pausing audio');
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        console.log('Resuming audio');
        audioRef.current.play().then(() => {
          console.log('Audio resumed successfully');
          setIsAudioPlaying(true);
        }).catch((error) => {
          console.error('Error resuming audio:', error);
          setIsAudioPlaying(false);
        });
      }
    } else {
      console.error('Audio ref is null');
    }
  };

  const handleAudioEnded = () => {
    // Determine which sequence we're in based on current audio source
    let currentSequence = audioSequence;
    let maxIndex = 1; // For WHATISARATIONALEQUATION sequence (0-1)
    
    if (currentAudioSrc.includes('Key Components')) {
      currentSequence = keyComponentsAudioSequence;
      maxIndex = 5; // For Key Components sequence (0-5)
    } else if (currentAudioSrc.includes('Why Study')) {
      currentSequence = whyStudyAudioSequence;
      maxIndex = 4; // For Why Study sequence (0-4)
    } else if (currentAudioSrc.includes('Basic Concepts')) {
      currentSequence = basicConceptsAudio;
      maxIndex = 0; // For Basic Concepts (0-0)
    } else if (currentAudioSrc.includes('Steps To Solve')) {
      currentSequence = stepsToSolveAudio;
      maxIndex = 0; // For Steps To Solve (0-0)
    }
    
    // If we haven't reached the end of the sequence, play next audio
    if (currentAudioIndex < maxIndex) {
      const nextIndex = currentAudioIndex + 1;
      setCurrentAudioIndex(nextIndex);
      if (audioRef.current) {
        audioRef.current.src = currentSequence[nextIndex];
        setCurrentAudioSrc(currentSequence[nextIndex]);
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    } else {
      // Sequence finished, stop playing
      setIsAudioPlaying(false);
      setCurrentAudioIndex(0);
    }
  };

  const handleAudioError = () => {
    setIsAudioPlaying(false);
  };

  const sections = [
    {
      id: 1,
      title: "What is a Rational Equation?",
      icon: <Calculator className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-primary">What is a Rational Equation?</h3>
              <Button
                onClick={() => toggleAudio('/src/components/character/Lesson Voices/Mercury/WHATISARATIONALEQUATION 1.mp3')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isAudioPlaying && currentAudioSrc.includes('WHATISARATIONALEQUATION') ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAudioPlaying && currentAudioSrc.includes('WHATISARATIONALEQUATION') ? 'Pause' : 'Listen'}
              </Button>
            </div>
            
            <p className="text-white/90 leading-relaxed mb-4">
              A rational equation is an equation that contains at least one rational expression, which is a fraction where both the numerator and denominator are polynomials.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
              <h4 className="font-orbitron text-sm text-primary mb-2">General Form:</h4>
              <div className="text-center mb-4">
                <BlockMath math="\frac{p(x)}{q(x)} = \frac{r(x)}{q(x)}" />
              </div>
              <p className="text-white/80 text-sm">
                where P(x) Q(x) R(x) S(x) are polynomials and Q(x) ≠ 0 and S(x) ≠ 0 and s(x) ≠ 0 (denominators cannot be zero).
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-orbitron text-sm text-success mb-2">Simple Example:</h4>
              <div className="text-center">
                <BlockMath math="\frac{x+1}{x-3} = \frac{2x}{x^2}" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Key Components of Rational Equations",
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-primary">Key Components of Rational Equations</h3>
              <Button
                onClick={() => toggleAudio('/src/components/character/Lesson Voices/Mercury/Key Components of Rational Equations 1.mp3')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isAudioPlaying && currentAudioSrc.includes('Key Components') ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAudioPlaying && currentAudioSrc.includes('Key Components') ? 'Pause' : 'Listen'}
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">Numerator</h4>
                <p className="text-white/80 text-sm mb-2">
                  The top part of the fraction (a polynomial).
                </p>
                <div className="text-center">
                  <BlockMath math="\text{Numerator/Denominator}" />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-warning mb-3">Denominator</h4>
                <p className="text-white/80 text-sm mb-2">
                  The bottom part of the fraction (must be non-zero).
                </p>
                <div className="text-center">
                  <BlockMath math="\text{Denominator} \neq 0" />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-info mb-3">Restrictions</h4>
                <p className="text-white/80 text-sm mb-2">
                  Values that make the denominator zero (excluded from solutions).
                </p>
                <p className="text-white/80 text-sm">
                  <span className="text-info font-semibold">Example: if x-3 = 0, then x=3 is excluded.</span>
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-purple-400 mb-3">LCD</h4>
                <p className="text-white/80 text-sm mb-2">
                  Least Common Denominator - Used to combine fractions and eliminate denominators.
                </p>
                <p className="text-white/80 text-sm">
                  Essential for solving rational equations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Why Study Rational Equations?",
      icon: <Lightbulb className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-primary">Why Study Rational Equations?</h3>
              <Button
                onClick={() => toggleAudio('/src/components/character/Lesson Voices/Mercury/Why Study Rational Equations 1.mp3')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isAudioPlaying && currentAudioSrc.includes('Why Study') ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAudioPlaying && currentAudioSrc.includes('Why Study') ? 'Pause' : 'Listen'}
              </Button>
            </div>
            
            <div className="grid md:grid-cols-1 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">Academic Foundation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Essential in algebra</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Required for calculus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Important in engineering</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-warning mb-3">Real-World Applications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Solve rate problems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Calculate work problems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Determine concentrations</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-info mb-3">Advanced Concepts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Understand asymptotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Study discontinuities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Analyze function behavior</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Common Applications",
      icon: <Globe className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h3 className="font-orbitron text-xl text-primary mb-4">Common Applications</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">Physics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Calculating rates and velocities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Resistances in electrical circuits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-white/80">Force and motion problems</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-warning mb-3">Economics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Cost and revenue optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Supply and demand analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-white/80">Profit maximization</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-info mb-3">Chemistry</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Mixing solutions with different concentrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Reaction rate calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <span className="text-info font-semibold">Equilibrium constant problems</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-purple-400 mb-3">Engineering</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Signal processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Control systems design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Circuit analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Basic Concepts to Review",
      icon: <BookOpen className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-primary">Basic Concepts to Review</h3>
              <Button
                onClick={() => toggleAudio('/src/components/character/Lesson Voices/Mercury/Basic Concepts to Review.mp3')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isAudioPlaying && currentAudioSrc.includes('Basic Concepts') ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAudioPlaying && currentAudioSrc.includes('Basic Concepts') ? 'Pause' : 'Listen'}
              </Button>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <h4 className="font-orbitron text-sm text-success mb-3">Prerequisites</h4>
              <p className="text-white/80 text-sm mb-4">
                Before tackling rational equations, ensure you understand these fundamental concepts:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">Polynomials</h4>
                <p className="text-white/80 text-sm mb-2">Example: x² - 4</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-warning mb-3">LCD (Least Common Denominator)</h4>
                <p className="text-white/80 text-sm">Used to combine fractions and eliminate denominators.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-info mb-3">Linear & Quadratic Equations</h4>
                <p className="text-info font-semibold text-sm">Since rational equations often simplify to these forms.</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-purple-400 mb-3">Factoring</h4>
                <p className="text-white/80 text-sm mb-2">Example (difference of squares):</p>
                <div className="text-center">
                  <BlockMath math="x^2 - 9 = (x + 3)(x - 3)" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mt-6 border border-white/10">
              <h4 className="font-orbitron text-sm text-success mb-3">Quick Check</h4>
              <p className="text-white/80 text-sm mb-2">
                Can you factor x² - 16? If yes, you're ready to proceed!
              </p>
              <p className="text-white/80 text-sm">
                Answer: (x + 4)(x - 4)
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Steps to Solve Rational Equations",
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-card/70 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-xl text-primary">Steps to Solve Rational Equations</h3>
              <Button
                onClick={() => toggleAudio('/src/components/character/Lesson Voices/Mercury/Steps To Solve Rational Equations.mp3')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isAudioPlaying && currentAudioSrc.includes('Steps To Solve') ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isAudioPlaying && currentAudioSrc.includes('Steps To Solve') ? 'Pause' : 'Listen'}
              </Button>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <h4 className="font-orbitron text-sm text-success mb-3">Step-by-Step Approach</h4>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">1. Identify Restrictions</h4>
                <p className="text-white/80 text-sm">
                  Find values that make any denominator zero. These are excluded from solutions.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-warning mb-3">2. Find LCD</h4>
                <p className="text-white/80 text-sm">
                  Determine the Least Common Denominator of all fractions in the equation.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-info mb-3">3. Multiply by LCD</h4>
                <p className="text-info font-semibold text-sm">
                  Multiply both sides by the LCD to eliminate all denominators.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-purple-400 mb-3">4. Solve Resulting Equation</h4>
                <p className="text-white/80 text-sm">
                  Solve the polynomial equation that results from step 3.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-orbitron text-sm text-success mb-3">5. Check Solutions</h4>
                <p className="text-white/80 text-sm">
                  Verify that solutions don't violate the restrictions from step 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setProgress(((currentSection + 1) / sections.length) * 100);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setProgress(((currentSection - 1) / sections.length) * 100);
    }
  };

  const handleSectionClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setProgress((sectionIndex / sections.length) * 100);
  };

  const handleNextDialogue = () => {
    if (showDialogue) {
      setShowDialogue(false);
    }
  };

  const handleGoBack = () => {
    navigate('/rpg');
  };

  const handleFinishLesson = () => {
    // Show completion message
    toast({
      title: "Lesson Completed! 🎉",
      description: "Congratulations! You've completed the Mercury Introduction to Rational Equations lesson.",
      variant: "default",
    });
    
    // Navigate back to the solar system
    navigate('/rpg');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with parallax and vignette */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mercuryBg})` }}
        initial={{ scale: 1.05, x: -10, y: -10 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      <div className="absolute inset-0 cosmic-starfield opacity-30" />
      <div className="absolute inset-0 bg-radial-vignette" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="p-6 border-b border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoBack}
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Back to Solar System
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                  <Star size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-orbitron font-bold text-xl bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    Mercury — Intro to Rational Equations
                  </h1>
                  <p className="text-xs text-white/60">Level {userLevel} • {userXP}/{maxXP} XP</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/rpg')} className="text-white border-white/20 hover:bg-white/10">
                <Home size={16} />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Progress Bar */}
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-white/80 text-sm font-orbitron">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Section Navigation */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleSectionClick(index)}
                    className={`p-4 rounded-lg border transition-all ${
                      currentSection === index
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        currentSection === index ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        {section.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-orbitron font-semibold text-sm">{section.title}</h3>
                        <p className="text-xs opacity-60">Section {index + 1}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Current Section Content */}
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {sections[currentSection].content}
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              className="flex justify-between items-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/20">
                  Section {currentSection + 1} of {sections.length}
                </Badge>
              </div>

              {currentSection === sections.length - 1 ? (
                <Button
                  onClick={handleFinishLesson}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Trophy size={16} className="mr-2" />
                  Finish Lesson
                </Button>
              ) : (
                <Button
                  onClick={handleNextSection}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Global Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />
    </div>
  );
};

export default MercuryLesson;
