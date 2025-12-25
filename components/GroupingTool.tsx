
import React, { useState } from 'react';
import { GroupResult } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface GroupingToolProps {
  names: string[];
}

export const GroupingTool: React.FC<GroupingToolProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState(3);
  const [results, setResults] = useState<GroupResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState("创新与未来");

  const performGrouping = async () => {
    setIsProcessing(true);
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const numGroups = Math.ceil(shuffled.length / groupSize);
    
    const teamNames = await generateTeamNames(numGroups, theme);

    const newGroups: GroupResult[] = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        groupName: teamNames[i] || `小组 ${i + 1}`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setResults(newGroups);
    setIsProcessing(false);
  };

  const exportGroupsToCSV = () => {
    if (results.length === 0) return;
    
    let csvContent = "\ufeff小组名称,小组成员\n";
    results.forEach((group) => {
      csvContent += `"${group.groupName}","${group.members.join('、')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分组结果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
          <i className="fa-solid fa-layer-group mr-2 text-indigo-600"></i>
          自动分组设置
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">每组人数</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="2" 
                max={Math.max(2, names.length)} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 text-center font-bold text-indigo-600 bg-indigo-50 py-1 rounded-md">{groupSize}</span>
            </div>
            <p className="text-xs text-slate-400 italic">
              预计分成 <span className="text-indigo-500 font-bold">{Math.ceil(names.length / groupSize)}</span> 组
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">组名主题 (AI 生成)</label>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="创新与未来">创新与未来</option>
              <option value="森林与大自然">森林与大自然</option>
              <option value="超级英雄与传奇">超级英雄与传奇</option>
              <option value="宇宙与星际探险">宇宙与星际探险</option>
              <option value="美食与甜点">美食与甜点</option>
              <option value="中国传统色">中国传统色</option>
            </select>
          </div>
        </div>

        <button
          onClick={performGrouping}
          disabled={isProcessing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:bg-slate-300"
        >
          <i className={`fa-solid ${isProcessing ? 'fa-wand-magic-sparkles fa-spin' : 'fa-people-group'}`}></i>
          <span>{isProcessing ? 'AI 分组中...' : '开始自动分组'}</span>
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-700">分组预览</h3>
            <button 
              onClick={exportGroupsToCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center space-x-2 active:scale-95"
            >
              <i className="fa-solid fa-file-csv"></i>
              <span>导出分组结果 (CSV)</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors group">
                <div className="bg-indigo-50 p-4 border-b border-slate-100 flex justify-between items-center group-hover:bg-indigo-600 transition-colors">
                  <h4 className="font-bold text-indigo-700 group-hover:text-white truncate pr-2">{group.groupName}</h4>
                  <span className="text-[10px] font-bold bg-white text-indigo-600 px-2 py-0.5 rounded-full">第 {gIdx + 1} 组</span>
                </div>
                <div className="p-4 space-y-2">
                  {group.members.map((member, mIdx) => (
                    <div key={mIdx} className="flex items-center space-x-3 text-slate-600">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {mIdx + 1}
                      </div>
                      <span className="text-sm font-medium">{member}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 text-[10px] text-center text-slate-400 font-medium">
                  共 {group.members.length} 位成员
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
