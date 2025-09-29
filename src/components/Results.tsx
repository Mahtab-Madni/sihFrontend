import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, MapPin, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResultsProps {
  data: any[];
}

const Results = ({ data }: ResultsProps) => {
  const { toast } = useToast();
  
  // Calculate pollution indices (simplified for prototype)
  const calculateIndices = (sample: any) => {
    const hpi = (sample.Lead * 0.5 + sample.Cadmium * 2.0 + sample.Arsenic * 1.5 + sample.Chromium * 0.8) * 10;
    const mi = (sample.Lead + sample.Cadmium + sample.Arsenic + sample.Chromium) / 4;
    const cd = Math.max(sample.Lead / 0.05, sample.Cadmium / 0.005, sample.Arsenic / 0.01, sample.Chromium / 0.05);
    
    return { hpi: Math.round(hpi), mi: Math.round(mi * 100) / 100, cd: Math.round(cd * 100) / 100 };
  };

  const getContaminationLevel = (hpi: number) => {
    if (hpi < 25) return { level: 'Safe', variant: 'safe' as const };
    if (hpi < 50) return { level: 'Moderate', variant: 'moderate' as const };
    return { level: 'Unsafe', variant: 'unsafe' as const };
  };

  const resultsData = data.map(sample => {
    const indices = calculateIndices(sample);
    const contamination = getContaminationLevel(indices.hpi);
    return {
      ...sample,
      ...indices,
      contamination: contamination.level,
      variant: contamination.variant
    };
  });

  // Chart data
  const chartData = resultsData.map(sample => ({
    name: sample.Sample_ID,
    HPI: sample.hpi,
    MI: sample.mi,
    Cd: sample.cd,
    contamination: sample.contamination
  }));

  const pieData = [
    { name: 'Safe', value: resultsData.filter(r => r.contamination === 'Safe').length, color: 'hsl(var(--safe))' },
    { name: 'Moderate', value: resultsData.filter(r => r.contamination === 'Moderate').length, color: 'hsl(var(--moderate))' },
    { name: 'Unsafe', value: resultsData.filter(r => r.contamination === 'Unsafe').length, color: 'hsl(var(--unsafe))' },
  ];

  const handleDownloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Downloading comprehensive analysis report...",
      variant: "default",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "Data Exported",
      description: "Results exported to CSV format",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-data">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Samples</p>
                <p className="text-2xl font-bold scientific-heading">{resultsData.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-data">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safe Areas</p>
                <p className="text-2xl font-bold text-safe">{pieData[0].value}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-safe"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-data">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moderate Risk</p>
                <p className="text-2xl font-bold text-moderate">{pieData[1].value}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-moderate"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-data">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-unsafe">{pieData[2].value}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-unsafe" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="scientific-heading">Analysis Results</CardTitle>
              <CardDescription>
                Pollution indices calculated for all groundwater samples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>HPI</TableHead>
                      <TableHead>MI</TableHead>
                      <TableHead>Cd</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsData.map((sample) => (
                      <TableRow key={sample.Sample_ID}>
                        <TableCell className="font-medium">{sample.Sample_ID}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{sample.Latitude.toFixed(4)}, {sample.Longitude.toFixed(4)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="data-value">{sample.hpi}</div>
                        </TableCell>
                        <TableCell>
                          <div className="data-value">{sample.mi}</div>
                        </TableCell>
                        <TableCell>
                          <div className="data-value">{sample.cd}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sample.variant}>{sample.contamination}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="scientific-heading flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Pollution Indices Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="HPI" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="scientific-heading flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Contamination Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="scientific-heading flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Geospatial Visualization</span>
              </CardTitle>
              <CardDescription>
                Interactive map showing contamination levels by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-data rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold scientific-heading mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground mb-4">
                    Map visualization will display sample locations with color-coded contamination levels
                  </p>
                  <Button variant="scientific">
                    Load Map Visualization
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="scientific-heading flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Results</span>
              </CardTitle>
              <CardDescription>
                Download your analysis results in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="scientific" onClick={handleDownloadReport} className="h-auto p-6">
                  <div className="text-center">
                    <Download className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">PDF Report</h3>
                    <p className="text-sm opacity-90">Comprehensive analysis report</p>
                  </div>
                </Button>
                
                <Button variant="outline" onClick={handleExportCSV} className="h-auto p-6">
                  <div className="text-center">
                    <Download className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">CSV Data</h3>
                    <p className="text-sm text-muted-foreground">Raw data with calculated indices</p>
                  </div>
                </Button>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sample location coordinates</li>
                  <li>• Heavy metal concentration data</li>
                  <li>• Calculated pollution indices (HPI, MI, Cd)</li>
                  <li>• Contamination level classifications</li>
                  <li>• Statistical summary and recommendations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;