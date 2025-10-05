import axios from 'axios';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, MapPin, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SampleDetails from './SampleReport';

const Results = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalSamples, setTotalSamples] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const visibleData = showAll
    ? [...data].sort((a, b) => parseInt(a.sampleId) - parseInt(b.sampleId))
    : [...data]
        .sort((a, b) => parseInt(a.sampleId) - parseInt(b.sampleId))
        .slice(0, 15);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/charts/pollution-indices")
      .then((res) => {
        const formatted = res.data.map((entry) => ({
          name: entry._id,
          HPI: entry.avgHPI,
          MI: entry.avgMI * 10,
          Cd: entry.avgCD * 5,
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch chart data:", err);
        toast({
          title: "Chart data error",
          description: "Unable to load pollution indices.",
        });
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/samples")
      .then((res) => {
        setData(res.data); // no need for type casting
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching samples:", err);
        toast({
          title: "Sample fetch error",
          description: "Unable to load sample data.",
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/summary")
      .then((res) => {
        const categories = res.data.categories;
        const total = res.data.totalSamples;

        const formatted = categories.map((cat) => ({
          name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
          value: cat.count,
          color:
            cat._id === "safe"
              ? "#22c55e"
              : cat._id === "moderate"
              ? "#f59e0b"
              : "#ef4444",
        }));

        setPieData(formatted);
        setTotalSamples(total);
      })
      .catch((err) => {
        console.error("Failed to fetch category summary:", err);
        toast({
          title: "Summary error",
          description: "Unable to load summary data.",
        });
      });
  }, []);

  const unsafeCount = pieData
    .filter((item) => item.name === "Unsafe")
    .reduce((sum, item) => sum + item.value, 0);


  const downloadCSV = async () => {
      try {
      toast({
        title: 'Exporting Data',
        description: 'Preparing CSV file...',
        variant: 'default',
      });

      const response = await axios.get('http://localhost:5000/api/export/csv', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'Water_Analysis_Data.csv');

          toast({
            title: 'CSV Exported',
            description: 'Your data has been saved as CSV.',
          });
    } catch (error) {
      console.error('CSV export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Unable to export CSV data.',
        variant: 'destructive',
      });
    }
  };

  const downloadPdf = async () => { 
    try {
      toast({
        title: "Generating Report",
        description: "Preparing your PDF report with charts and map...",
        variant: "default",
      });

      // Capture chart and map images by ID
      const captureImage = async (id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const canvas = await html2canvas(el);
        return canvas.toDataURL("image/png");
      };

      const pollutionChart = await captureImage("pollution-chart");
      const pieChart = await captureImage("pie-chart");
      const mapSnapshot = await captureImage("map-visual");

      // Send request to backend with chart images
      const response = await axios.post(
        "http://localhost:5000/api/export/pdf",
        {
          samples: data, // your sample array
          charts: {
            pollutionChart,
            pieChart,
            mapSnapshot,
          },
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "Water_Analysis_Report.pdf");

      toast({
        title: "Report Ready",
        description: "Your PDF report has been downloaded.",
        variant: "default",
      });
    } catch (error) {
      console.error("PDF download failed:", error);
      toast({
        title: "Download Failed",
        description: "Something went wrong while generating the report.",
        variant: "destructive",
      });
    }
  }

  const getBadgeColor = (variant) => {
    switch (variant) {
      case 'safe': return 'bg-green-600 hover:bg-green-700';
      case 'moderate': return 'bg-yellow-600  hover:bg-yellow-700';
      case 'unsafe': return 'bg-red-600 hover:bg-red-700';
      default: return '';
    }
  };

  const handleRowClick = (sample) => {
    setSelectedSample(sample);
  };

  const handleBack = () => {
    setSelectedSample(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Water Quality Analysis Results</h1>
          <p className="text-muted-foreground">
            Analysis of {totalSamples !== null ? totalSamples : "Loading..."}{" "}
            water samples
          </p>
        </div>
        <Button onClick={downloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download CSV
        </Button>
        <Button onClick={downloadPdf} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          id="pie-chart"
          className="bg-white/5 border border-border/40 rounded-xl shadow-sm"
        >
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">
              Contamination Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Pie Chart */}
            <div className="w-full md:w-2/3">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center">
                  No data available
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="w-full md:w-1/3 space-y-3">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="text-sm font-medium">{entry.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          id="pollution-chart"
          className="bg-white/5 border border-border/40 rounded-xl shadow-sm"
        >
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">
              Indices Comparison
            </CardTitle>
          </CardHeader>

          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="HPI"
                    fill="#3b82f6"
                    name="HPI (Health Pollution Index)"
                  />
                  <Bar dataKey="MI" fill="#8b5cf6" name="MI (Metal Index)" />
                  <Bar
                    dataKey="Cd"
                    fill="#ef4444"
                    name="Cd (Contamination Degree)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">
                No chart data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">
              Risk Assessment
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="font-medium text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {item.value} samples
                  </span>
                </div>
              ))}

              {unsafeCount > 0 && (
                <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-3">
                      Warning
                    </p>
                    <p className="text-xs text-red-700">
                      {unsafeCount} water samples exceed safe contamination
                      limits and need attention.
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
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Click a sample to view detailed report
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSample ? (
            <SampleDetails sample={selectedSample} onBack={handleBack} />
          ) : (
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
                  {[...visibleData]
                    .sort((a, b) => {
                      const idA = parseInt(a.sampleId.replace(/\D/g, "")) || 0;
                      const idB = parseInt(b.sampleId.replace(/\D/g, "")) || 0;
                      return idA - idB;
                    })
                    .slice(0, showAll ? visibleData.length : 15)
                    .map((sample) => (
                      <TableRow
                        key={sample.sampleId}
                        onClick={() => handleRowClick(sample)}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <TableCell className="px-10">
                          {sample.sampleId}
                        </TableCell>
                        <TableCell className="translate-x-[-30px]">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {sample.latitude.toFixed(4)},{" "}
                              {sample.longitude.toFixed(4)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{sample.indices.hpi}</TableCell>
                        <TableCell>{sample.indices.mi}</TableCell>
                        <TableCell>{sample.indices.cd}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white rounded w-17 h-5 ${getBadgeColor(
                              sample.category
                            )}`}
                          >
                            {sample.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
          {data.length > 15 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition"
              >
                {showAll ? "Show Less" : `Show All (${data.length})`}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;