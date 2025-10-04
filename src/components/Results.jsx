import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Results = ({ data }) => {
  const { toast } = useToast();

  // Calculate indices
  const calculateIndices = (sample) => {
    const hpi = (sample.Lead * 0.5 + sample.Cadmium * 2.0 + sample.Arsenic * 1.5 + sample.Chromium * 0.8) * 10;
    const mi = (sample.Lead + sample.Cadmium + sample.Arsenic + sample.Chromium) / 4;
    const cd = Math.max(
      sample.Lead / 0.05,
      sample.Cadmium / 0.005,
      sample.Arsenic / 0.01,
      sample.Chromium / 0.05
    );
    return { hpi: Math.round(hpi), mi: Math.round(mi * 100) / 100, cd: Math.round(cd * 100) / 100 };
  };

  const getContaminationLevel = (hpi) => {
    if (hpi < 100) return { level: 'Safe', variant: 'safe' };
    if (hpi ==100) return { level: 'Moderate', variant: 'moderate' };
    return { level: 'Unsafe', variant: 'unsafe' };
  };

  const resultsData = data.map((sample) => {
    const indices = calculateIndices(sample);
    const contamination = getContaminationLevel(indices.hpi);
    return {
      ...sample,
      ...indices,
      contaminationLevel: contamination.level,
      contaminationVariant: contamination.variant,
    };
  });

  const safeCount = resultsData.filter((item) => item.contaminationLevel === 'Safe').length;
  const moderateCount = resultsData.filter((item) => item.contaminationLevel === 'Moderate').length;
  const unsafeCount = resultsData.filter((item) => item.contaminationLevel === 'Unsafe').length;

  const pieData = [
    { name: 'Safe', value: safeCount, color: '#22c55e' },
    { name: 'Moderate', value: moderateCount, color: '#f59e0b' },
    { name: 'Unsafe', value: unsafeCount, color: '#ef4444' },
  ];

  const barData = resultsData.slice(0, 10).map((item) => ({
    name: item.Sample_ID,
    HPI: item.hpi,
    MI: item.mi * 10,
    CD: item.cd * 5,
  }));

  const downloadCSV = () => {
    const headers = ['Sample_ID', 'Latitude', 'Longitude', 'Lead', 'Cadmium', 'Arsenic', 'Chromium', 'HPI', 'MI', 'CD', 'Contamination Level'];
    const csvRows = [
      headers.join(','),
      ...resultsData.map((row) => [
        row.Sample_ID,
        row.Latitude,
        row.Longitude,
        row.Lead,
        row.Cadmium,
        row.Arsenic,
        row.Chromium,
        row.hpi,
        row.mi,
        row.cd,
        row.contaminationLevel,
      ].join(',')),
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'water_quality_analysis.csv');
    a.click();
    toast({ title: 'Report Downloaded', description: 'CSV report downloaded successfully' });
  };

  const getBadgeColor = (variant) => {
    switch (variant) {
      case 'safe': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'unsafe': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Water Quality Analysis Results</h1>
          <p className="text-muted-foreground">Analysis of {resultsData.length} water samples</p>
        </div>
        <Button onClick={downloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Contamination Summary</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                >
                  {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Indices Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="HPI" fill="#3b82f6" />
                <Bar dataKey="MI" fill="#8b5cf6" />
                <Bar dataKey="CD" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Risk Assessment</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} samples</span>
                </div>
              ))}
              {unsafeCount > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Warning</p>
                    <p className="text-xs text-red-700">
                      {unsafeCount} water samples exceed safe contamination limits and need attention.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Geospatial Map</CardTitle>
          <CardDescription>Map visualization placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
            Map Placeholder
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis Results</CardTitle>
          <CardDescription>Heavy metal contamination indices and risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>HPI</TableHead>
                  <TableHead>MI</TableHead>
                  <TableHead>CD</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultsData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{row.Sample_ID}</TableCell>
                    <TableCell>{row.Latitude.toFixed(4)}, {row.Longitude.toFixed(4)}</TableCell>
                    <TableCell>{row.hpi}</TableCell>
                    <TableCell>{row.mi}</TableCell>
                    <TableCell>{row.cd}</TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(row.contaminationVariant)}>
                        {row.contaminationLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
