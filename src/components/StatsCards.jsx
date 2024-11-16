import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatsCards = ({ data }) => {
  // Equipment data for bar chart
  const equipmentCounts = data.reduce((acc, item) => {
    acc[item.Equipments] = (acc[item.Equipments] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(equipmentCounts).map(([name, count]) => ({
    name,
    count
  }));

  // Status data for pie chart
  const statusCounts = data.reduce((acc, item) => {
    acc[item['Status (Vessel)']] = (acc[item['Status (Vessel)']] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Equipment Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Bar
                  dataKey="count"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Status Overview</h3>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
