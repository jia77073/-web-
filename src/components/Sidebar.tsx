import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronRight, CheckCircle2, Circle, Download } from 'lucide-react';
import { KnowledgePoint } from '../types';

interface SidebarProps {
  points: KnowledgePoint[];
  learnedIds: Set<string>;
  selectedPointId: string | null;
  onSelectPoint: (id: string) => void;
  onToggleLearned: (id: string) => void;
  onExport: () => void;
  initialCategory?: string;
}

export const Sidebar = ({ 
  points, 
  learnedIds, 
  selectedPointId, 
  onSelectPoint, 
  onToggleLearned,
  onExport,
  initialCategory
}: SidebarProps) => {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(initialCategory ? [initialCategory] : []));
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const toggleSubcategory = (sub: string) => {
    const next = new Set(expandedSubcategories);
    if (next.has(sub)) next.delete(sub);
    else next.add(sub);
    setExpandedSubcategories(next);
  };

  const filteredPoints = useMemo(() => {
    if (!search) return points;
    return points.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [points, search]);

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, KnowledgePoint[]>> = {};
    filteredPoints.forEach(p => {
      if (!groups[p.category]) groups[p.category] = {};
      if (!groups[p.category][p.subcategory]) groups[p.category][p.subcategory] = [];
      groups[p.category][p.subcategory].push(p);
    });
    return groups;
  }, [filteredPoints]);

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-100">
      {/* Search Header */}
      <div className="p-3 border-b border-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/60" size={16} />
          <input
            type="text"
            placeholder="搜索知识点..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-app-bg border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-light/40"
          />
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {Object.entries(groupedData).map(([category, subcategories]) => (
          <div key={category} className="space-y-0.5">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm font-bold text-text-dark hover:bg-app-bg rounded-lg transition-colors"
            >
              {expandedCategories.has(category) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {category}
            </button>
            
            <AnimatePresence>
              {expandedCategories.has(category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-3.5 space-y-0.5"
                >
                  {Object.entries(subcategories).map(([subcategory, kps]) => (
                    <div key={subcategory} className="space-y-0.5">
                      <button
                        onClick={() => toggleSubcategory(subcategory)}
                        className="w-full flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-text-light/70 hover:bg-app-bg rounded-lg transition-colors"
                      >
                        {expandedSubcategories.has(subcategory) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        {subcategory}
                      </button>
                      
                      <AnimatePresence>
                        {expandedSubcategories.has(subcategory) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-3.5 space-y-0.5"
                          >
                            {kps.map((kp) => (
                              <div 
                                key={kp.id}
                                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                  selectedPointId === kp.id ? 'bg-primary/10 text-primary' : 'text-text-dark/80 hover:bg-app-bg'
                                }`}
                                onClick={() => onSelectPoint(kp.id)}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLearned(kp.id);
                                  }}
                                  className="shrink-0 transition-transform active:scale-90"
                                >
                                  {learnedIds.has(kp.id) ? (
                                    <CheckCircle2 size={14} className="text-primary" />
                                  ) : (
                                    <Circle size={14} className="text-gray-300 group-hover:text-gray-400" />
                                  )}
                                </button>
                                <span className="text-[13px] truncate flex-1 font-medium">{kp.name}</span>
                                <span className="text-[10px] text-text-light/50 shrink-0 font-bold">{kp.grade}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/10"
        >
          <Download size={14} />
          导出课程表
        </button>
      </div>
    </div>
  );
};
