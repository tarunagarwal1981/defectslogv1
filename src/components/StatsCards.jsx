import React, { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#132337] px-2 py-1 rounded-[4px] border border-[#3BADE5]/20 shadow-lg">
        <p className="text-[10px] text-[#f4f4f4]">
          {`${payload[0].payload.name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const ProgressBar = ({ value, max, className, showBorder = false }) => (
  <div className="relative h-2 w-full bg-white/5 rounded overflow-hidden">
    <div 
      className={`absolute top-0 left-0 h-full rounded ${className}`}
      style={{ width: `${(value / max) * 100}%` }}
    />
    {showBorder && (
      <div className="absolute inset-0 border border-dashed border-white/20 rounded" />
    )}
  </div>
);

const StatsCards = ({ data }) => {
  // Equipment data processing
  const equipmentData = useMemo(() => {
    const counts = data.reduce((acc, item) => {
      acc[item.Equipments] = (acc[item.Equipments] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  // Status data processing
  const statusMetrics = useMemo(() => {
    const total = data.length;
    const closed = data.filter(item => item['Status (Vessel)'] === 'CLOSED').length;
    const open = data.filter(item => item['Status (Vessel)'] === 'OPEN').length;
    const inProgress = data.filter(item => item['Status (Vessel)'] === 'IN PROGRESS').length;

    // Calculate month-over-month change
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const previousClosedRate = data
      .filter(item => new Date(item['Date Reported']) < lastMonth)
      .filter(item => item['Status (Vessel)'] === 'CLOSED').length / total * 100;
    const currentClosedRate = (closed / total) * 100;
    const rateChange = currentClosedRate - previousClosedRate;

    return {
      total,
      closed,
      open,
      inProgress,
      closureRate: (closed / total) * 100,
      openRate: (open / total) * 100,
      inProgressRate: (inProgress / total) * 100,
      rateChange
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Equipment Distribution Card */}
      <Card className="bg-[#132337]/30 backdrop-blur-sm border border-white/10">
        <CardContent className="p-5">
          <h3 className="text-xs font-medium text-[#f4f4f4] mb-6">
            Equipment Distribution
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={equipmentData}
                layout="vertical"
                margin={{ top: 0, right: 40, bottom: 0, left: 100 }}
              >
                <XAxis 
                  type="number" 
                  tick={{ fill: '#f4f4f4', fontSize: 10 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: '#f4f4f4', fontSize: 10 }}
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                >
                  {equipmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill="url(#equipmentGradient)"
                      className="hover:brightness-110 transition-all"
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="equipmentGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3BADE5" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3BADE5" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview Card */}
      <Card className="bg-[#132337]/30 backdrop-blur-sm border border-white/10">
        <CardContent className="p-5">
          <h3 className="text-xs font-medium text-[#f4f4f4] mb-6">
            Status Overview
          </h3>
          
          {/* Main metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#3BADE5]">
                {statusMetrics.closureRate.toFixed(1)}%
              </div>
              <div className="text-xs text-[#f4f4f4]/60 mt-1">
                Closure Rate
                <span className={`inline-flex items-center ml-2 text-[10px] ${
                  statusMetrics.rateChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {statusMetrics.rateChange >= 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {Math.abs(statusMetrics.rateChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {statusMetrics.total}
              </div>
              <div className="text-xs text-[#f4f4f4]/60 mt-1">
                Total Defects
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-green-400">Closed</span>
                <span className="text-xs text-green-400">{statusMetrics.closed} ({statusMetrics.closureRate.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                value={statusMetrics.closed} 
                max={statusMetrics.total}
                className="bg-gradient-to-r from-green-500/50 to-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-red-400">Open</span>
                <span className="text-xs text-red-400">{statusMetrics.open} ({statusMetrics.openRate.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                value={statusMetrics.open} 
                max={statusMetrics.total}
                className="bg-gradient-to-r from-red-500/50 to-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-yellow-400">In Progress</span>
                <span className="text-xs text-yellow-400">{statusMetrics.inProgress} ({statusMetrics.inProgressRate.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                value={statusMetrics.inProgress} 
                max={statusMetrics.total}
                className="bg-gradient-to-r from-yellow-500/50 to-yellow-500"
                showBorder={statusMetrics.inProgress === 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
