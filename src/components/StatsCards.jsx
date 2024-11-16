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
  // Equipment data for bar chart
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

  // Status data for pie chart
  const statusCounts = React.useMemo(() => {
    const counts = data.reduce((acc, item) => {
      const status = item['Status (Vessel)'] || 'OPEN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: total ? ((value / total) * 100).toFixed(1) : 0
    }));
  }, [data]);

  // Calculate month-over-month trends
  const trends = React.useMemo(() => {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    const currentMonthData = data.filter(item => new Date(item['Date Reported']) > lastMonth);
    const lastMonthData = data.filter(item => {
      const date = new Date(item['Date Reported']);
      return date <= lastMonth && date > new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
    });

    const calculatePercentages = (items) => {
      const total = items.length;
      return {
        OPEN: ((items.filter(i => i['Status (Vessel)'] === 'OPEN').length / total) * 100).toFixed(1),
        CLOSED: ((items.filter(i => i['Status (Vessel)'] === 'CLOSED').length / total) * 100).toFixed(1),
        'IN PROGRESS': ((items.filter(i => i['Status (Vessel)'] === 'IN PROGRESS').length / total) * 100).toFixed(1)
      };
    };

    const currentPercentages = calculatePercentages(currentMonthData);
    const lastPercentages = calculatePercentages(lastMonthData);

    return Object.keys(currentPercentages).reduce((acc, key) => {
      acc[key] = {
        current: currentPercentages[key],
        trend: (currentPercentages[key] - (lastPercentages[key] || 0)).toFixed(1)
      };
      return acc;
    }, {});
  }, [data]);

  const STATUS_COLORS = {
    'OPEN': '#FF4D4F',
    'CLOSED': '#52C41A',
    'IN PROGRESS': '#FAAD14'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card className="bg-[#132337]/50">
        <CardContent className="p-4">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-3">
            Equipment Distribution
          </h3>
          <div className="h-[180px] w-full flex items-center justify-center">
            <div className="w-[95%] h-full">
              <ResponsiveContainer>
                <BarChart data={barChartData} margin={{ top: 10, right: 25, bottom: 35, left: 25 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(244, 244, 244, 0.1)"
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#f4f4f4', fontSize: 9 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    axisLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                    tickLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                  />
                  <YAxis 
                    tick={{ fill: '#f4f4f4', fontSize: 9 }}
                    axisLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                    tickLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#3BADE5"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    className="hover:brightness-110 transition-all"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#132337]/50">
        <CardContent className="p-4">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-3">
            Status Overview
          </h3>
          <div className="h-[180px] flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[250px]">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {statusCounts.map((entry) => (
                        <Cell 
                          key={entry.name} 
                          fill={STATUS_COLORS[entry.name]}
                          strokeWidth={1}
                          stroke="rgba(255, 255, 255, 0.1)"
                          className="hover:brightness-110 transition-all"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {statusCounts.map((status) => (
                <div key={status.name} className="flex items-center justify-between px-3 py-0.5 text-[10px]">
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
                      Number(trends[status.name]?.trend) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {Number(trends[status.name]?.trend) >= 0 ? '↑' : '↓'} 
                      {Math.abs(trends[status.name]?.trend || 0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
