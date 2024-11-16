import React, { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

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

// Custom Gauge Chart Component
const GaugeChart = ({ percentage, size = 160 }) => {
  const circumference = size * Math.PI;
  const progress = (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke="#1a2e44"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke="#3BADE5"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold text-[#f4f4f4]">{percentage}%</span>
        <span className="text-xs text-[#f4f4f4]/60">Closure Rate</span>
      </div>
    </div>
  );
};

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

    return {
      total,
      closed,
      open,
      inProgress,
      closureRate: total ? ((closed / total) * 100).toFixed(1) : 0,
      openRate: total ? ((open / total) * 100).toFixed(1) : 0,
      inProgressRate: total ? ((inProgress / total) * 100).toFixed(1) : 0
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Equipment Distribution Card */}
      <Card className="bg-[#132337]/30 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-[#f4f4f4] mb-4">
            Equipment Distribution
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={equipmentData}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 100 }}
              >
                <XAxis type="number" tick={{ fill: '#f4f4f4', fontSize: 10 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: '#f4f4f4', fontSize: 10 }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#3BADE5"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                >
                  {equipmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={`rgba(59, 173, 229, ${1 - (index * 0.1)})`}
                      className="hover:brightness-110 transition-all"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview Card */}
      <Card className="bg-[#132337]/30 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-[#f4f4f4] mb-4">
            Status Overview
          </h3>
          <div className="flex flex-col items-center">
            <GaugeChart percentage={Number(statusMetrics.closureRate)} />
            
            <div className="w-full grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">
                  {statusMetrics.closed}
                </div>
                <div className="text-xs text-[#f4f4f4]/60">
                  Closed
                </div>
                <div className="text-[10px] text-green-400/80 mt-1">
                  {statusMetrics.closureRate}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-red-400">
                  {statusMetrics.open}
                </div>
                <div className="text-xs text-[#f4f4f4]/60">
                  Open
                </div>
                <div className="text-[10px] text-red-400/80 mt-1">
                  {statusMetrics.openRate}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-400">
                  {statusMetrics.inProgress}
                </div>
                <div className="text-xs text-[#f4f4f4]/60">
                  In Progress
                </div>
                <div className="text-[10px] text-yellow-400/80 mt-1">
                  {statusMetrics.inProgressRate}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
