import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#132337] px-2 py-1 rounded-[4px] border border-[#3BADE5]/20 shadow-lg">
        <p className="text-[10px] text-[#f4f4f4]">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StatsCards = ({ data }) => {
  const equipmentCounts = React.useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.Equipments] = (acc[item.Equipments] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const barChartData = React.useMemo(() => {
    return Object.entries(equipmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Show top 8 equipment types
  }, [equipmentCounts]);

  const statusCounts = React.useMemo(() => {
    const counts = data.reduce((acc, item) => {
      acc[item['Status (Vessel)']] = (acc[item['Status (Vessel)']] || 0) + 1;
      return acc;
    }, {});
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: total ? ((value / total) * 100).toFixed(1) : 0
    }));
  }, [data]);

  // Calculate trends (simplified example - you'll need to adjust based on your data structure)
  const trends = React.useMemo(() => {
    const total = data.length;
    const open = data.filter(d => d['Status (Vessel)'] === 'OPEN').length;
    const closed = data.filter(d => d['Status (Vessel)'] === 'CLOSED').length;
    const inProgress = data.filter(d => d['Status (Vessel)'] === 'IN PROGRESS').length;

    return {
      open: ((open / total) * 100).toFixed(1),
      closed: ((closed / total) * 100).toFixed(1),
      inProgress: ((inProgress / total) * 100).toFixed(1),
    };
  }, [data]);

  const STATUS_COLORS = {
    'OPEN': '#FF4D4F',
    'CLOSED': '#52C41A',
    'IN PROGRESS': '#FAAD14'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <Card className="bg-[#132337]/50">
        <CardContent className="p-2">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-2 px-1">
            Equipment Distribution
          </h3>
          <div className="h-[160px] w-full flex items-center justify-center">
            <div className="w-[90%] h-full">
              <ResponsiveContainer>
                <BarChart data={barChartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(244, 244, 244, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#f4f4f4', fontSize: 9 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#f4f4f4', fontSize: 9 }} />
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
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#132337]/50">
        <CardContent className="p-2">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-2 px-1">
            Status Overview
          </h3>
          <div className="h-[100px] w-full flex justify-center">
            <div className="w-[180px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusCounts.map((entry) => (
                      <Cell 
                        key={entry.name} 
                        fill={STATUS_COLORS[entry.name]} 
                        className="hover:brightness-110 transition-all"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1">
            {statusCounts.map((status) => (
              <div key={status.name} className="flex items-center justify-between px-3 py-1 text-[10px]">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[status.name] }}
                  />
                  <span className="text-[#f4f4f4] opacity-80">{status.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f4f4f4]">{status.value}</span>
                  <span className="text-[#f4f4f4] opacity-60">({status.percentage}%)</span>
                  <span className={`${
                    trends[status.name.toLowerCase()] > status.percentage 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {trends[status.name.toLowerCase()] > status.percentage ? '↑' : '↓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
