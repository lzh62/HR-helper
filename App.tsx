
import React, { useState } from 'react';
import { NameInput } from './components/NameInput';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupingTool } from './components/GroupingTool';
import { AppMode } from './types';

const App: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [mode, setMode] = useState<AppMode>('setup');

  const handleNamesSubmit = (newNames: string[]) => {
    setNames(newNames);
    setMode('draw');
  };

  const clearData = () => {
    if (confirm('确定要清除所有名单并重新开始吗？')) {
      setNames([]);
      setMode('setup');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <i className="fa-solid fa-briefcase text-white"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">HR 办公助手</h1>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">高效 · 有趣</p>
              </div>
            </div>

            {names.length > 0 && (
              <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMode('draw')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  <i className="fa-solid fa-dice mr-2"></i>随机抽签
                </button>
                <button 
                  onClick={() => setMode('grouping')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'grouping' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  <i className="fa-solid fa-people-group mr-2"></i>自动分组
                </button>
                <button 
                  onClick={() => setMode('setup')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'setup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  <i className="fa-solid fa-user-pen mr-2"></i>修改名单
                </button>
              </div>
            )}

            <div className="flex items-center">
               <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-bold">
                 共 {names.length} 人
               </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">准备开启活动</h2>
              <p className="text-slate-500">上传参与者名单，系统将协助您进行公平抽签或智能分组</p>
            </div>
            <NameInput onNamesSubmit={handleNamesSubmit} />
          </div>
        )}

        {mode === 'draw' && names.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">随机抽签</h2>
                <p className="text-slate-500 text-sm">点击按钮开始抽取，支持多种抽签规则</p>
              </div>
              <button onClick={clearData} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">重置所有数据</button>
            </div>
            <LuckyDraw names={names} />
          </div>
        )}

        {mode === 'grouping' && names.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">自动分组</h2>
                <p className="text-slate-500 text-sm">AI 协助分配成员并生成个性化组名</p>
              </div>
              <button onClick={clearData} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">重置所有数据</button>
            </div>
            <GroupingTool names={names} />
          </div>
        )}
      </main>

      {names.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50">
          <button onClick={() => setMode('draw')} className={`flex flex-col items-center space-y-1 ${mode === 'draw' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fa-solid fa-dice text-xl"></i>
            <span className="text-[10px] font-bold">抽签</span>
          </button>
          <button onClick={() => setMode('grouping')} className={`flex flex-col items-center space-y-1 ${mode === 'grouping' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fa-solid fa-people-group text-xl"></i>
            <span className="text-[10px] font-bold">分组</span>
          </button>
          <button onClick={() => setMode('setup')} className={`flex flex-col items-center space-y-1 ${mode === 'setup' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fa-solid fa-user-pen text-xl"></i>
            <span className="text-[10px] font-bold">名单</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
