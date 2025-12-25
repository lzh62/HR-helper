
import React, { useState, useMemo } from 'react';

interface NameInputProps {
  onNamesSubmit: (names: string[]) => void;
}

const SAMPLE_NAMES = [
  "1, 王伟", "2, 李芳", "3, 张敏", "4, 李军", "5, 王丽", 
  "6, 张强", "7, 刘洋", "8, 陈静", "9, 杨建", "10, 赵霞",
  "11, 黄刚", "12, 周磊", "13, 吴芳", "14, 徐勇", "15, 孙丽", 
  "16, 马静", "17, 朱强", "18, 胡敏", "19, 郭伟", "20, 何丽",
  "21, 王伟", "22, 张敏", "23, 刘洋" 
];

const COMMON_HEADERS = ['姓名', '名字', 'name', '序号', 'id', 'no', 'no.', '编号'];

export const NameInput: React.FC<NameInputProps> = ({ onNamesSubmit }) => {
  const [inputText, setInputText] = useState('');

  const currentNames = useMemo(() => {
    return inputText
      .split(/[\n\r]+/) // 首先按行分割
      .map(line => {
        // 将每一行按逗号、分号、制表符或空格分割
        const parts = line.split(/[,;\t\s]+/).map(p => p.trim()).filter(p => p.length > 0);
        
        // 查找第一个不是纯数字的片段（排除序号和ID）
        const namePart = parts.find(p => !/^\d+$/.test(p));
        return namePart;
      })
      // 过滤掉空值、长度过短的内容，以及常见的表头关键字
      .filter((n): n is string => {
        if (!n || n.length < 1) return false;
        const lowerN = n.toLowerCase();
        return !COMMON_HEADERS.some(header => lowerN === header || lowerN.includes(header));
      });
  }, [inputText]);

  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    currentNames.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
    return Array.from(counts.entries())
      .filter(([_, count]) => count > 1)
      .map(([name]) => name);
  }, [currentNames]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const processNames = () => {
    if (currentNames.length === 0) {
      alert('请输入至少一个姓名！');
      return;
    }
    if (duplicateNames.length > 0) {
      if (!confirm(`发现 ${duplicateNames.length} 个重复姓名，确定要继续吗？建议先点击“一键去重”。`)) {
        return;
      }
    }
    onNamesSubmit(currentNames);
  };

  const removeDuplicates = () => {
    const unique = Array.from(new Set(currentNames));
    setInputText(unique.join('\n'));
  };

  const useSampleData = () => {
    setInputText(SAMPLE_NAMES.join('\n'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <i className="fa-solid fa-users-medical mr-2 text-indigo-600"></i>
          导入名单
        </h2>
        <button 
          onClick={useSampleData}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-lightbulb mr-1"></i> 使用示例数据 (模拟复杂格式)
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-2">
          <p className="text-xs text-blue-700 leading-relaxed">
            <i className="fa-solid fa-circle-info mr-1"></i>
            <strong>智能提取提示：</strong>系统会自动识别并忽略序号、ID等数字列，以及“姓名”、“序号”等表头信息。您可以直接粘贴 Excel 或 CSV 内容。
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">上传 CSV 或 TXT 文件</label>
          <input 
            type="file" 
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-600">粘贴名单 (支持多列格式)</label>
            <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded">解析出 {currentNames.length} 个姓名</span>
          </div>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none font-mono text-sm"
            placeholder="例如：&#10;1, 张三&#10;2, 李四&#10;或者直接从Excel复制两列内容粘贴"
          />
        </div>

        {duplicateNames.length > 0 && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2 text-red-600">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <div className="text-sm">
                发现重复姓名：<span className="font-bold">{duplicateNames.slice(0, 3).join(', ')}{duplicateNames.length > 3 ? '...' : ''}</span>
              </div>
            </div>
            <button 
              onClick={removeDuplicates}
              className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-50 transition-colors"
            >
              一键去重
            </button>
          </div>
        )}

        <button
          onClick={processNames}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <span>确认名单</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
