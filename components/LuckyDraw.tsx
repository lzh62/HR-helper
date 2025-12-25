
import React, { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

interface LuckyDrawProps {
  names: string[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ names }) => {
  const [availableNames, setAvailableNames] = useState<string[]>([...names]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('准备好了吗？');
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const drawIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fireFireworks = () => {
    if (!canvasRef.current) return;

    // 创建局域礼花实例，限制在 canvasRef 所在的容器内
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // 注意：局域 canvas 的坐标系原点通常是 canvas 中心或底部，取决于实现
      // canvas-confetti 在局域模式下，origin {y: 0.5} 通常指 canvas 的垂直中心
      myConfetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.5) } 
      });
      myConfetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.5) } 
      });
    }, 250);
  };

  const startDraw = useCallback(() => {
    if (availableNames.length === 0 && !repeatMode) {
      alert('名单中的人已经抽完啦！');
      return;
    }

    setIsDrawing(true);
    setLastWinner(null);
    let counter = 0;
    const maxTries = 40;

    drawIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentDisplay(names[randomIndex]);
      counter++;

      if (counter >= maxTries) {
        if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
        
        const listToPickFrom = repeatMode ? names : availableNames;
        const winnerIndex = Math.floor(Math.random() * listToPickFrom.length);
        const winner = listToPickFrom[winnerIndex];

        setCurrentDisplay(winner);
        setLastWinner(winner);
        setHistory(prev => [winner, ...prev]);

        if (!repeatMode) {
          setAvailableNames(prev => prev.filter((_, i) => i !== winnerIndex));
        }

        setIsDrawing(false);
        // 触发本地礼花效果
        setTimeout(fireFireworks, 50);
      }
    }, 60);
  }, [availableNames, names, repeatMode]);

  const reset = () => {
    if (confirm('确定要重置所有抽签数据吗？')) {
      setAvailableNames([...names]);
      setHistory([]);
      setCurrentDisplay('准备好了吗？');
      setLastWinner(null);
    }
  };

  const exportToCSV = () => {
    if (history.length === 0) return;
    
    let csvContent = "\ufeff序号,中奖姓名\n";
    history.forEach((name, index) => {
      csvContent += `${history.length - index},${name}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `抽签历史_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className={`bg-white p-10 rounded-3xl shadow-xl border-2 transition-all duration-500 text-center relative overflow-hidden ${lastWinner ? 'border-amber-400 shadow-amber-200' : 'border-indigo-100'}`}>
        {/* 本地礼花 Canvas，仅在此图框内生效 */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none w-full h-full z-20"
        />

        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isDrawing ? 'from-indigo-500 via-purple-500 to-pink-500 animate-pulse' : (lastWinner ? 'from-amber-400 to-orange-500' : 'from-slate-200 to-slate-200')} z-30`}></div>
        
        {/* 背景装饰 */}
        {lastWinner && (
          <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
             <i className="fa-solid fa-gift text-[200px] text-amber-500 animate-bounce"></i>
          </div>
        )}

        <div className="mb-8 relative z-10">
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 transition-colors ${lastWinner ? 'bg-amber-100 text-amber-700 animate-bounce' : 'bg-indigo-50 text-indigo-600'}`}>
            {isDrawing ? '正在随机抽取...' : (lastWinner ? '🎊 恭喜！中奖的是 🎊' : (repeatMode ? '模式：允许重复' : '模式：不重复'))}
          </div>
          
          <div className="min-h-[120px] flex flex-col items-center justify-center">
            <h1 className={`font-black transition-all duration-300 ${
              isDrawing 
                ? 'text-5xl text-slate-400 blur-[1px]' 
                : (lastWinner 
                    ? 'text-8xl text-transparent bg-clip-text bg-gradient-to-br from-amber-600 to-orange-500 scale-110 drop-shadow-lg' 
                    : 'text-6xl text-slate-800')
            }`}>
              {currentDisplay}
            </h1>
            {lastWinner && (
              <div className="mt-4 text-amber-500 font-bold animate-pulse">
                中大奖啦！
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-30">
          <button
            onClick={startDraw}
            disabled={isDrawing || (availableNames.length === 0 && !repeatMode)}
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 text-lg ${
              isDrawing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <i className={`fa-solid ${isDrawing ? 'fa-spinner fa-spin' : 'fa-dice'}`}></i>
            <span>{isDrawing ? '抽取中...' : '开始抽奖'}</span>
          </button>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">允许重复</span>
            <button
              onClick={() => setRepeatMode(!repeatMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${repeatMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${repeatMode ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
        </div>

        {!repeatMode && !isDrawing && (
          <p className="mt-6 text-sm text-slate-400 relative z-10">
            待抽人数: <span className="font-bold text-indigo-500">{availableNames.length}</span> / {names.length}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center">
              <i className="fa-solid fa-clock-rotate-left mr-2 text-indigo-400"></i>
              抽签历史
            </h3>
            <div className="flex space-x-3">
              {history.length > 0 && (
                <button 
                  onClick={exportToCSV}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center"
                >
                  <i className="fa-solid fa-file-csv mr-1"></i> 导出 CSV
                </button>
              )}
              <button onClick={reset} className="text-xs text-red-500 hover:underline">清空</button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10">
                <i className="fa-solid fa-inbox text-slate-200 text-4xl mb-2"></i>
                <p className="text-slate-400 text-sm italic">暂无记录</p>
              </div>
            ) : (
              history.map((name, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${idx === 0 ? 'bg-amber-50 border-amber-200 scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center">
                    {idx === 0 && <i className="fa-solid fa-crown text-amber-500 mr-2 text-xs"></i>}
                    <span className={`font-medium ${idx === 0 ? 'text-amber-900' : 'text-slate-700'}`}>{name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full">#{history.length - idx}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center">
            <i className="fa-solid fa-users mr-2 text-indigo-400"></i>
            名单池 ({availableNames.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {availableNames.map((name, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium border border-indigo-100">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
