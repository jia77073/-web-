import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  learned: number;
  total: number;
  color: string;
  onClick: () => void;
}

export const ModuleCard = ({ title, icon: Icon, learned, total, color, onClick }: ModuleCardProps) => {
  const percentage = total > 0 ? (learned / total) * 100 : 0;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-5 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col items-start text-left w-full transition-all hover:shadow-md"
      style={{ backgroundColor: `${color}45` }}
    >
      <div className="flex items-center gap-3 mb-4 w-full">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm" 
          style={{ backgroundColor: 'white', color: color }}
        >
          <Icon size={24} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-text-dark truncate">{title}</h3>
          <p className="text-xs text-text-dark/70 truncate font-medium">
            {title === '数与代数' && '整数、分数、方程初步'}
            {title === '几何' && '长度、面积、体积、图形认识'}
            {title === '统计与概率' && '平均数、可能性预测'}
            {title === '解决问题' && '时间、人民币、数学广角、应用题'}
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <div className="flex justify-between mb-2 text-xs font-bold text-text-dark/60">
          <span>进度</span>
          <span>{learned} / {total}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.button>
  );
};
