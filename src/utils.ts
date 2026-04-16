import { KNOWLEDGE_DATA_CSV } from './data';
import { KnowledgePoint } from './types';

export const parseCSV = (csv: string): KnowledgePoint[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      id: `kp-${index}`,
      category: values[0],
      subcategory: values[1],
      name: values[2],
      grade: values[3],
    };
  });
};

export const getLearnedPoints = (): Set<string> => {
  const stored = localStorage.getItem('learned_points');
  return new Set<string>(stored ? JSON.parse(stored) : []);
};

export const saveLearnedPoints = (points: Set<string>) => {
  localStorage.setItem('learned_points', JSON.stringify(Array.from(points)));
};

export const exportToCSV = (points: KnowledgePoint[], learnedIds: Set<string>) => {
  const unlearned = points.filter(p => !learnedIds.has(p.id));
  const headers = ['大分类', '子分类', '知识点名称', '年级'];
  const rows = unlearned.map(p => [p.category, p.subcategory, p.name, p.grade].join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', '未学知识点课程表.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
