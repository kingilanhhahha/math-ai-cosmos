import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CharacterBox from '@/components/character/CharacterBox';
import DialogueBox from '@/components/character/DialogueBox';
import XPBar from '@/components/game/XPBar';
import LessonCard from '@/components/lesson/LessonCard';
import JoinClassroom from '@/components/classroom/JoinClassroom';
import ClassroomGate from '@/components/classroom/ClassroomGate';
import { Play, Settings, User, BookOpen, Trophy, Zap, LogOut, School } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import cosmicBackground from '@/assets/cosmic-background.png';
import { usePlayer } from '@/contexts/PlayerContext';

const Index = () => {
  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueStep, setDialogueStep] = useState(0);
  const { level, currentXP, nextLevelXP } = usePlayer();

  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Show loading state while AuthContext is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Math Cosmos Tutor...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const dialogues = [
    {
      speaker: "AI Tutor Ava",
      text: "Welcome to MathVerse, Math Warrior! I'm Ava, your AI guide through the cosmos of rational equations and inequalities."
    },
    {
      speaker: "AI Tutor Ava", 
      text: "Ready to embark on an epic mathematical journey? Each lesson you complete will earn you XP and unlock new challenges!"
    },
    {
      speaker: "AI Tutor Ava",
      text: "Choose your first quest below, and let's master the universe of mathematics together! 🚀"
    }
  ];

  const lessons = [
    {
      title: "Introduction to Rational Equations",
      description: "Learn the fundamentals of rational equations with interactive examples",
      difficulty: "beginner" as const,
      status: "available" as const,
      xpReward: 150,
      estimatedTime: "15 min"
    },
    {
      title: "Solving Basic Rational Equations", 
      description: "Master the art of solving simple rational equations step by step",
      difficulty: "beginner" as const,
      status: "locked" as const,
      xpReward: 200,
      estimatedTime: "20 min"
    },
    {
      title: "Rational Inequalities Basics",
      description: "Understand how inequalities work with rational expressions",
      difficulty: "intermediate" as const,
      status: "locked" as const,
      xpReward: 250,
      estimatedTime: "25 min"
    },
    {
      title: "Complex Rational Equations",
      description: "Challenge yourself with advanced rational equation problems",
      difficulty: "advanced" as const,
      status: "locked" as const,
      xpReward: 350,
      estimatedTime: "30 min"
    }
  ];

  const handleNextDialogue = () => {
    if (dialogueStep < dialogues.length - 1) {
      setDialogueStep(dialogueStep + 1);
    } else {
      setShowDialogue(false);
    }
  };

  const handleLessonClick = (lessonTitle: string) => {
    console.log(`Starting lesson: ${lessonTitle}`);
    // TODO: Navigate to lesson page
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${cosmicBackground})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-40 border-b backdrop-blur-md bg-background/60"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-orbitron font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
                    MathVerse
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Welcome, {user?.username || 'Student'}! 🚀
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <XPBar 
                currentXP={currentXP} 
                maxXP={nextLevelXP} 
                level={level}
                className="hidden md:flex"
              />
              <div className="flex gap-2">
                <Button 
                  variant="gaming" 
                  size="sm"
                  onClick={() => navigate('/rpg')}
                  className="bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  <Play size={16} className="mr-1" />
                  RPG Mode
                </Button>
                <Button variant="gaming" size="sm">
                  <User size={16} />
                </Button>
                <Button variant="gaming" size="sm">
                  <Settings size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero section */}
        <motion.section 
          className="container mx-auto px-6 py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            className="font-orbitron font-bold text-4xl md:text-6xl mb-6 bg-gradient-primary bg-clip-text text-transparent"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(79, 195, 247, 0.3)",
                "0 0 30px rgba(79, 195, 247, 0.5)", 
                "0 0 20px rgba(79, 195, 247, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Enter the MathVerse
          </motion.h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master rational equations and inequalities with your AI companion. 
            Level up your math skills in an epic gamified learning experience!
          </p>

          {/* Always show Join Classroom button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center mb-6"
          >
            <JoinClassroom />
          </motion.div>

          {!showDialogue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button variant="hero" size="lg" className="px-8">
                <Play size={20} />
                Continue Journey
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/rpg'}>
                <BookOpen size={20} />
                🚀 RPG Mode
              </Button>
            </motion.div>
          )}
        </motion.section>

        {/* XP Bar for mobile */}
        <motion.div 
          className="md:hidden px-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <XPBar currentXP={currentXP} maxXP={nextLevelXP} level={level} />
        </motion.div>

        {/* Lessons grid */}
        <motion.section 
          className="container mx-auto px-6 pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy size={24} className="text-accent" />
            <h3 className="font-orbitron font-semibold text-2xl text-card-foreground">
              Choose Your Quest
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <LessonCard
                  {...lesson}
                  onClick={() => handleLessonClick(lesson.title)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Calculator Preview Section */}
        <motion.section 
          className="container mx-auto px-6 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="text-center mb-8">
            <h3 className="font-orbitron font-semibold text-2xl text-card-foreground mb-4">
              🧮 Interactive AI Solver
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience our advanced equation solver with handwriting recognition and step-by-step AI guidance
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card border border-primary/30 rounded-lg p-4 shadow-card backdrop-blur-sm">
              <div className="bg-cosmic-dark rounded-lg overflow-hidden">
                <iframe 
                  src="/calculator" 
                  className="w-full h-[500px] border-0"
                  title="Interactive Math Solver"
                />
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Character and dialogue */}
      <CharacterBox expression="happy" />
      
      {showDialogue && (
        <DialogueBox
          speaker={dialogues[dialogueStep].speaker}
          text={dialogues[dialogueStep].text}
          onNext={handleNextDialogue}
          showNext={true}
        />
      )}

      {/* Classroom Gate for registered students (guests skip) */}
      <ClassroomGate enabled={true} />
    </div>
  );
};

export default Index;