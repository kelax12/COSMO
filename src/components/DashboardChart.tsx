import React, { useMemo, useEffect, useRef } from 'react';
import { BarChart3 } from 'lucide-react';

const DashboardChart: React.FC = () => {
  const chartTopRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const baseTime = 60;
      const variation = Math.sin((i * Math.PI) / 6) * 30;
      const randomFactor = (Math.random() - 0.5) * 20;
      const totalTime = Math.max(0, baseTime + variation + randomFactor);

      days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        time: Math.round(totalTime),
        fullDate: date.toLocaleDateString('fr-FR')
      });
    }
    return days;
  }, []);

  const maxTime = Math.max(...chartData.map(d => d.time));
  const chartHeight = 200;
  const labelSpace = 50;

  useEffect(() => {
    if (chartTopRef.current) {
      chartTopRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [chartData]);

  return (
    <div className="card p-6 lg:p-8 h-full bg-transparent">
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex-shrink-0 transition-colors duration-300">
          <BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg lg:text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Temps de travail quotidien
          </h2>
          <p className="text-[rgb(var(--color-text-secondary))] text-xs lg:text-sm">
            7 derniers jours
          </p>
        </div>
      </div>

      <div ref={chartTopRef} className="absolute -mt-32" />

      <div className="relative overflow-x-auto overflow-y-visible">
        <div className="flex items-end justify-between gap-2 lg:gap-3 min-w-[500px] lg:min-w-0 pt-20 pb-4 bg-transparent" style={{ height: `${chartHeight + labelSpace + 60}px` }}>
          {chartData.map((day, index) => {
            const barHeight = (day.time / maxTime) * chartHeight * 0.9;
            const isToday = index === chartData.length - 1;

            return (
              <div key={index} className="flex-1 flex flex-col items-center group bg-transparent">
                <div className="relative flex-1 flex items-end justify-center w-full">
                  <div
                    className={`w-8 lg:w-10 rounded-t-lg transition-all duration-500 hover:opacity-80 relative ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500'
                    }`}
                    style={{ height: `${barHeight}px`, minHeight: barHeight > 0 ? '4px' : '0' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                    <span className={`text-sm lg:text-base font-bold ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-[rgb(var(--color-text-primary))]'
                    }`}>
                      {Math.floor(day.time / 60)}h{day.time % 60}min
                    </span>
                  </div>
                </div>

                <div className="mt-3 lg:mt-4 text-center">
                  <div className={`text-xs lg:text-sm font-semibold transition-colors duration-200 ${
                    isToday
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text-primary))]'
                  }`}>
                    {day.date}
                  </div>
                  <div className="text-[10px] lg:text-xs text-[rgb(var(--color-text-muted))]">
                    {day.fullDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 lg:mt-8 grid grid-cols-3 gap-4 lg:gap-6 pt-6 border-t border-[rgb(var(--color-border))]">
        <div className="text-center p-4 rounded-xl border border-[rgb(var(--color-border))] bg-transparent transition-all duration-300 hover:scale-105">
          <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.floor(chartData[chartData.length - 1].time / 60)}h{chartData[chartData.length - 1].time % 60}min
          </div>
          <div className="text-[10px] lg:text-xs text-[rgb(var(--color-text-secondary))] mt-1 font-medium">Aujourd'hui</div>
        </div>
        <div className="text-center p-4 rounded-xl border border-[rgb(var(--color-border))] bg-transparent transition-all duration-300 hover:scale-105">
          <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.floor(chartData.reduce((sum, d) => sum + d.time, 0) / chartData.length / 60)}h
          </div>
          <div className="text-[10px] lg:text-xs text-[rgb(var(--color-text-secondary))] mt-1 font-medium">Moyenne</div>
        </div>
        <div className="text-center p-4 rounded-xl border border-[rgb(var(--color-border))] bg-transparent transition-all duration-300 hover:scale-105">
          <div className="text-xl lg:text-2xl font-bold text-amber-600 dark:text-amber-400">
            {Math.floor(chartData.reduce((sum, d) => sum + d.time, 0) / 60)}h
          </div>
          <div className="text-[10px] lg:text-xs text-[rgb(var(--color-text-secondary))] mt-1 font-medium">Total semaine</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
