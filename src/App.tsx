import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LearningView } from './components/LearningView';
import { KNOWLEDGE_DATA_CSV } from './data';
import { parseCSV, getLearnedPoints, saveLearnedPoints, exportToCSV } from './utils';
import { KnowledgePoint } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'learning'>('dashboard');
  const [points] = useState<KnowledgePoint[]>(() => parseCSV(KNOWLEDGE_DATA_CSV));
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set<string>());
  const [initialCategory, setInitialCategory] = useState<string | undefined>();

  // Load initial state
  useEffect(() => {
    setLearnedIds(getLearnedPoints());
  }, []);

  const handleToggleLearned = (id: string) => {
    const next = new Set<string>(learnedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLearnedIds(next);
    saveLearnedPoints(next);
  };

  const handleEnterDirectory = (category?: string) => {
    setInitialCategory(category);
    setView('learning');
  };

  const handleExport = () => {
    exportToCSV(points, learnedIds);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard 
              points={points} 
              learnedIds={learnedIds} 
              onEnterDirectory={handleEnterDirectory} 
              onExport={handleExport}
            />
          </motion.div>
        ) : (
          <motion.div
            key="learning"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <LearningView 
              points={points} 
              learnedIds={learnedIds} 
              onToggleLearned={handleToggleLearned}
              onExport={handleExport}
              onBack={() => setView('dashboard')}
              initialCategory={initialCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
