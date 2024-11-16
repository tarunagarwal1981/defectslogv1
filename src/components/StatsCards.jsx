import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#132337] p-2 rounded-[4px] border border-[#3BADE5]/20 shadow-lg">
        <p className="text-xs text-[#f4f4f4]">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StatsCards = ({ data }) => {
  // ... (same data processing code)

  const COLORS = ['#3BADE5', '#172A33'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-[#f4f4f4] opacity-80 mb-4">Equipment Distribution</h3>
          <div className="h-[180px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#f4f4f4', fontSize: 10 }}
                  axisLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  tickLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                />
                <YAxis 
                  tick={{ fill: '#f4f4f4', fontSize: 10 }}
                  axisLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  tickLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#3BADE5"
                  radius={[4, 4, 0, 0]}
                  className="hover:brightness-110 transition-all"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-[#f4f4f4] opacity-80 mb-4">Status Overview</h3>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:brightness-110 transition-all"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-[#f4f4f4] opacity-80">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
