import { KNOWLEDGE_DATA_CSV } from './data';
import { KnowledgePoint } from './types';

export const parseCSV = (csv: string): KnowledgePoint[] => {
  try {
    const lines = csv.trim().split('\n');
    return lines.slice(1).map((line, index) => {
      const values = line.split(',');
      if (values.length < 3) return null;
      
      // If there are more than 4 values, assume the name contains commas
      // category: values[0], subcategory: values[1], grade: last, name: middle
      const category = (values[0] || '').trim();
      const subcategory = (values[1] || '').trim();
      const grade = (values[values.length - 1] || '').trim().replace(/\r/g, '');
      const name = values.slice(2, values.length - 1).join(',').trim();
      
      return {
        id: `kp-${index}-${category.slice(0,3)}-${name.slice(0,5)}`,
        category,
        subcategory,
        name,
        grade,
      };
    }).filter((p): p is KnowledgePoint => p !== null);
  } catch (err) {
    console.error('CSV Parsing failed:', err);
    return [];
  }
};

export const getLearnedPoints = (): Set<string> => {
  try {
    const stored = localStorage.getItem('learned_points');
    return new Set<string>(stored ? JSON.parse(stored) : []);
  } catch (error) {
    console.error('Failed to access localStorage:', error);
    return new Set<string>();
  }
};

export const saveLearnedPoints = (points: Set<string>) => {
  try {
    localStorage.setItem('learned_points', JSON.stringify(Array.from(points)));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
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
