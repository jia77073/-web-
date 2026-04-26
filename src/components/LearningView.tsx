import { useState } from 'react';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { KnowledgePoint } from '../types';
import { ArrowLeft, Menu, X } from 'lucide-react';

interface LearningViewProps {
  points: KnowledgePoint[];
  learnedIds: Set<string>;
  onToggleLearned: (id: string) => void;
  onExport: () => void;
  onBack: () => void;
  initialCategory?: string;
}

export const LearningView = ({ 
  points, 
  learnedIds, 
  onToggleLearned, 
  onExport, 
  onBack,
  initialCategory
}: LearningViewProps) => {
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedPoint = points.find(p => p.id === selectedPointId);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <motion.div
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -280,
          width: isSidebarOpen ? 280 : 0
        }}
        className="fixed lg:relative z-50 h-full bg-white shadow-xl lg:shadow-none"
      >
        <div className="w-[280px] h-full">
          <Sidebar
            points={points}
            learnedIds={learnedIds}
            selectedPointId={selectedPointId}
            onSelectPoint={(id) => {
              setSelectedPointId(id);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            onToggleLearned={onToggleLearned}
            onExport={onExport}
            initialCategory={initialCategory}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-app-bg rounded-lg text-text-light transition-colors"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-bold text-text-light hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              返回主页
            </button>
          </div>
          
          <div className="flex-1 text-center px-4">
            <h2 className="text-base font-bold text-text-dark truncate">
              {selectedPoint ? selectedPoint.name : '请选择知识点开始学习'}
            </h2>
          </div>

          <div className="w-24 flex justify-end">
            {selectedPoint && (
              <span className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary rounded-full font-bold uppercase tracking-wider border border-primary/10">
                {selectedPoint.grade}
              </span>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden bg-white">
          {selectedPoint ? (
            <div className="w-full h-full relative">
              <iframe
                key={selectedPoint.id}
                src={`/knowledge/${encodeURIComponent(selectedPoint.name)}.html`}
                className="w-full h-full border-none relative z-10"
                title={selectedPoint.name}
                onError={() => console.error('Iframe failed to load')}
              />
              <div className="absolute inset-0 flex items-center justify-center -z-0 bg-gray-50/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-xs text-gray-400 font-bold animate-pulse">正在加载互动模块...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6 text-primary">
                <Menu size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">准备好开始了吗？</h3>
              <p className="text-text-light max-w-xs">
                从左侧目录中选择一个你感兴趣的知识点，开始你的数学探索之旅吧！
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
