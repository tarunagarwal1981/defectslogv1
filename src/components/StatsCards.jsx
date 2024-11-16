import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

const StatsCards = ({ data }) => {
  const equipmentCounts = data.reduce((acc, item) => {
    acc[item.Equipments] = (acc[item.Equipments] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(equipmentCounts).map(([name, count]) => ({
    name,
    count
  }));

  const statusCounts = data.reduce((acc, item) => {
    acc[item['Status (Vessel)']] = (acc[item['Status (Vessel)']] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3BADE5', '#172A33'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-gray-300 mb-2">Equipment Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#172A33',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3BADE5"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-gray-300 mb-2">Status Overview</h3>
          <div className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
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
                <Tooltip 
                  contentStyle={{ 
                    background: '#172A33',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
