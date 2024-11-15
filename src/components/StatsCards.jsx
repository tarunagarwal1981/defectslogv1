// src/components/StatsCards.jsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const StatsCards = ({ data }) => {
  const stats = useMemo(() => {
    const totalDefects = data.length;
    const openDefects = data.filter(d => d['Status (Vessel)'] === 'Open').length;
    const inProgressDefects = data.filter(d => d['Status (Vessel)'] === 'In Progress').length;
    const completedDefects = data.filter(d => d['Status (Vessel)'] === 'Completed').length;
    const criticalDefects = data.filter(d => d.Criticality === 'High').length;

    return {
      totalDefects,
      openDefects,
      inProgressDefects,
      completedDefects,
      criticalDefects
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Defects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDefects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Defects</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.openDefects}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.openDefects / stats.totalDefects) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgressDefects}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.inProgressDefects / stats.totalDefects) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Defects</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.criticalDefects}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.criticalDefects / stats.totalDefects) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
