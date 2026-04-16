import { motion } from 'motion/react';
import { CircularProgress } from './CircularProgress';
import { ModuleCard } from './ModuleCard';
import { Calculator, Shapes, BarChart3, Lightbulb, ChevronRight, Mountain, Download, Info } from 'lucide-react';
import { KnowledgePoint } from '../types';

interface DashboardProps {
  points: KnowledgePoint[];
  learnedIds: Set<string>;
  onEnterDirectory: (category?: string) => void;
  onExport: () => void;
}

export const Dashboard = ({ points, learnedIds, onEnterDirectory, onExport }: DashboardProps) => {
  const totalPoints = points.length;
  const totalLearned = learnedIds.size;
  const totalPercentage = totalPoints > 0 ? (totalLearned / totalPoints) * 100 : 0;

  const categories = [
    { name: '数与代数', icon: Calculator, color: '#1976D2' },
    { name: '几何', icon: Shapes, color: '#7B1FA2' },
    { name: '统计与概率', icon: BarChart3, color: '#F57C00' },
    { name: '解决问题', icon: Lightbulb, color: '#388E3C' },
  ];

  const getCategoryStats = (categoryName: string) => {
    const categoryPoints = points.filter(p => p.category === categoryName);
    const learnedInCategory = categoryPoints.filter(p => learnedIds.has(p.id)).length;
    return {
      learned: learnedInCategory,
      total: categoryPoints.length
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="h-14 bg-white flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-2 text-xl font-extrabold text-primary">
          <Mountain size={24} strokeWidth={3} />
          <span>数学小状元</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">总进度 {Math.round(totalPercentage)}%</span>
            <div className="w-20 h-1 bg-primary/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${totalPercentage}%` }}
              />
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-white shadow-sm">
            小
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-text-dark mb-2">今天想学习什么呢？</h1>
            <p className="text-base text-text-light mb-6 opacity-80">已连续打卡 5 天，继续加油！</p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEnterDirectory()}
              className="bg-primary text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all"
            >
              进入提前学目录
            </motion.button>
          </div>

          <div className="flex items-center gap-10">
            <div className="relative flex flex-col items-center">
              <CircularProgress percentage={totalPercentage} size={140} strokeWidth={12} />
            </div>

            <div className="hidden sm:flex w-36 h-36 border-2 border-dashed border-accent/40 rounded-full flex-col items-center justify-center gap-1 text-text-light bg-accent/15 shadow-inner">
              <span className="text-3xl font-black text-accent">LV.4</span>
              <span className="text-xs font-bold uppercase tracking-tight text-accent">数学达人</span>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => {
            const stats = getCategoryStats(cat.name);
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ModuleCard
                  title={cat.name}
                  icon={cat.icon}
                  learned={stats.learned}
                  total={stats.total}
                  color={cat.color}
                  onClick={() => onEnterDirectory(cat.name)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-auto flex flex-wrap justify-center gap-6 py-4 border-t border-gray-100/50">
          <button 
            onClick={onExport}
            className="flex items-center gap-2 text-[11px] text-text-light hover:text-primary transition-colors font-bold uppercase tracking-wider"
          >
            <Download size={14} />
            <span>导出未学清单</span>
          </button>
          <button className="flex items-center gap-2 text-[11px] text-text-light hover:text-primary transition-colors font-bold uppercase tracking-wider">
            <Info size={14} />
            <span>使用说明</span>
          </button>
        </div>
      </main>
    </div>
  );
};
