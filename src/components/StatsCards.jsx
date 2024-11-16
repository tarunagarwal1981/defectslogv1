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
    return Object.entries(equipmentCounts).map(([name, count]) => ({
      name,
      count
    }));
  }, [equipmentCounts]);

  // Status data for pie chart
  const statusCounts = React.useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item['Status (Vessel)']] = (acc[item['Status (Vessel)']] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const pieChartData = React.useMemo(() => {
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [statusCounts]);

  const COLORS = ['#3BADE5', '#172A33'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      {/* Equipment Distribution Card */}
      <Card className="bg-[#132337]/50">
        <CardContent className="p-2">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-2 px-1">
            Equipment Distribution
          </h3>
          <div className="relative h-[140px] w-full flex items-center justify-center">
            <div className="absolute inset-0 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={barChartData}
                  margin={{ top: 5, right: 25, bottom: 15, left: 25 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(244, 244, 244, 0.1)"
                  />
                  <XAxis 
                    dataKey="name"
                    tick={{ fill: '#f4f4f4', fontSize: 9 }}
                    axisLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                    tickLine={false}
                    dy={5}
                  />
                  <YAxis 
                    tick={{ fill: '#f4f4f4', fontSize: 9 }}
                    axisLine={{ stroke: '#f4f4f4', opacity: 0.1 }}
                    tickLine={false}
                    dx={-5}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(59, 173, 229, 0.1)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3BADE5"
                    radius={[2, 2, 0, 0]}
                    barSize={20}
                    className="hover:brightness-110 transition-all"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview Card */}
      <Card className="bg-[#132337]/50">
        <CardContent className="p-2">
          <h3 className="text-[11px] font-medium text-[#f4f4f4] opacity-80 mb-2 px-1">
            Status Overview
          </h3>
          <div className="h-[140px] w-full flex flex-col items-center justify-center">
            <div className="w-[180px] h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:brightness-110 transition-all"
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3">
              {pieChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[10px] text-[#f4f4f4] opacity-80">
                    {entry.name}
                  </span>
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
