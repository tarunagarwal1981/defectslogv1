import React from 'react';
import { Card } from "./ui/card"; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatsCards = ({ data }) => {
  const equipmentData = data.reduce((acc, item) => {
    acc[item.Equipments] = (acc[item.Equipments] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(equipmentData).map(([name, value]) => ({
    name,
    count: value
  }));

  const criticalityData = data.reduce((acc, item) => {
    acc[item.Criticality] = (acc[item.Criticality] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(criticalityData).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Equipment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Criticality Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
