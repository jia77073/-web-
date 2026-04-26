import { useState, useEffect, Component, ReactNode } from 'react';
import { Dashboard } from './components/Dashboard';
import { LearningView } from './components/LearningView';
import { KNOWLEDGE_DATA_CSV } from './data';
import { parseCSV, getLearnedPoints, saveLearnedPoints, exportToCSV } from './utils';
import { KnowledgePoint } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

// Simple Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">出错了</h2>
            <p className="text-gray-600 mb-6">{this.state.error?.message || "由于发生了意外错误，应用无法正常运行。"}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              刷新重试
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
