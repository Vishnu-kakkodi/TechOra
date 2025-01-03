import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InstitutionPieChart = () => {
    const data = [
        { name: 'Total Institutions', value: 1, color: '#0D47A1' }, 
        { name: 'Pending Approvals', value: 0, color: '#FFA000' },
        { name: 'Active Institutions', value: 1, color: '#2E7D32' }, 
        { name: 'Under Verification', value: 0, color: '#6A1B9A' }, 
        { name: 'Rejected', value: 0, color: '#D32F2F' } 
    ];

  return (
    <div className="w-[600px] h-[400px] bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Institution Overview</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InstitutionPieChart;