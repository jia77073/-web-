import { motion } from 'motion/react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const CircularProgress = ({
  percentage,
  size = 130,
  strokeWidth = 10,
  color = '#4caf50'
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle Fill */}
      <div 
        className="absolute inset-0 rounded-full bg-[#E8F5E9]" 
        style={{ margin: strokeWidth / 2 }}
      />
      
      <svg width={size} height={size} className="relative transform -rotate-90 z-10">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none z-20">
        <span className="text-4xl font-black text-text-dark">{Math.round(percentage)}%</span>
        <span className="text-xs text-primary font-bold uppercase tracking-widest mt-1">已掌握</span>
      </div>
    </div>
  );
};
