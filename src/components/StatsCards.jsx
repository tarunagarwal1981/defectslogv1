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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card>
        <CardContent className="p-3">
          <h3 className="text-xs font-medium text-[#f4f4f4] opacity-80 mb-2">Equipment Distribution</h3>
          <div className="h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="94%" height="100%">
              <BarChart 
                data={barChartData} 
                margin={{ top: 5, right: 5, bottom: 15, left: 5 }}
                barSize={20}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#f4f4f4', fontSize: 9 }}
                  axisLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  tickLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  height={30}
                  tickMargin={5}
                />
                <YAxis 
                  tick={{ fill: '#f4f4f4', fontSize: 9 }}
                  axisLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  tickLine={{ stroke: '#f4f4f4', opacity: 0.2 }}
                  width={25}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(59, 173, 229, 0.1)' }}
                />
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
        <CardContent className="p-3">
          <h3 className="text-xs font-medium text-[#f4f4f4] opacity-80 mb-2">Status Overview</h3>
          <div className="h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
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
                      strokeWidth={1}
                      stroke="rgba(255, 255, 255, 0.1)"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(59, 173, 229, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[10px] text-[#f4f4f4] opacity-80">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
