import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  calculateHPI, 
  calculateHEI, 
  calculateCD, 
  processSampleRisk,
  generateTrendData,
  generateMetalConcentrationData,
  getExtremeConcentrations
} from '@/lib/dataUtils';

const Analytics = ({ userData }) => {
  const [metrics, setMetrics] = useState({
    hpi: 0,
    hei: 0,
    cd: 0
  });
  const [sampleStats, setSampleStats] = useState({
    safe: 0,
    moderate: 0,
    highRisk: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [extremeValues, setExtremeValues] = useState({ highest: null, lowest: null });

  useEffect(() => {
    // Process data when component mounts or userData changes
    const processData = () => {
      // Calculate metrics
      const hpi = calculateHPI(userData);
      const hei = calculateHEI(userData);
      const cd = calculateCD(userData);
      setMetrics({ hpi, hei, cd });

      // Process sample risk statistics
      const riskStats = processSampleRisk(userData);
      setSampleStats(riskStats);

      // Generate trend data for line chart
      const trends = generateTrendData(userData);
      setTrendData(trends);

      // Generate metal concentration data for donut chart
      const metals = generateMetalConcentrationData(userData);
      setMetalData(metals);
      
      // Set default selected metal
      if (metals && metals.length > 0) {
        setSelectedMetal(metals[0]);
      }

      // Get highest and lowest concentrations
      const extremes = getExtremeConcentrations(metals);
      setExtremeValues(extremes);
    };

    processData();
  }, [userData]);

  const handleMetalSelect = (metal) => {
    setSelectedMetal(metal);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Analytics and Predictions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Sample Statistics Cards */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm text-green-700">Safe Samples</span>
              <span className="text-3xl font-bold">{sampleStats.safe}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm text-yellow-700">Moderate Risk Samples</span>
              <span className="text-3xl font-bold">{sampleStats.moderate}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm text-red-700">High Risk Samples</span>
              <span className="text-3xl font-bold">{sampleStats.highRisk}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Pollution Indices */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Heavy Metal Pollution Index (HPI)</span>
            </div>
            <span className="text-3xl font-bold">{metrics.hpi}</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
              <span className="text-sm">Heavy Metal Evaluation Index (HEI)</span>
            </div>
            <span className="text-3xl font-bold">{metrics.hei}</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <span className="text-sm">Contamination Degree (CD)</span>
            </div>
            <span className="text-3xl font-bold">{metrics.cd}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heavy Metal Concentration Trends */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Heavy Metal Concentration Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* Line Chart Visualization */}
              <div className="relative h-full w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border rounded p-4">
                    {/* X-axis labels (months) */}
                    <div className="flex justify-between mb-2">
                      {trendData.map((item, index) => (
                        <div key={index} className="text-xs">{item.name}</div>
                      ))}
                    </div>
                    
                    {/* Chart area */}
                    <div className="relative h-[220px] w-full">
                      {/* Axes */}
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
                      <div className="absolute top-0 left-0 h-full w-[1px] bg-gray-300"></div>
                      
                      {/* Y-axis labels */}
                      <div className="absolute top-0 left-2 text-xs text-gray-500">0.028</div>
                      <div className="absolute top-1/4 left-2 text-xs text-gray-500">0.019</div>
                      <div className="absolute top-1/2 left-2 text-xs text-gray-500">0.010</div>
                      <div className="absolute bottom-0 left-2 text-xs text-gray-500">0</div>
                      
                      {/* Dynamic lines for each metal */}
                      {trendData.length > 0 && (
                        <>
                          {/* Find max value for scaling */}
                          {(() => {
                            const maxValue = Math.max(
                              ...trendData.map(item => Math.max(
                                item.As || 0, 
                                item.Cd || 0, 
                                item.Cr || 0, 
                                item.Hg || 0, 
                                item.Pb || 0
                              ))
                            );
                            
                            // Metal colors
                            const colors = {
                              As: '#eab308', // yellow
                              Cd: '#ec4899', // pink
                              Cr: '#ef4444', // red
                              Hg: '#8b5cf6', // purple
                              Pb: '#3b82f6'  // blue
                            };
                            
                            // Generate SVG paths for each metal
                            return Object.entries(colors).map(([metal, color]) => {
                              // Create path points
                              const points = trendData.map((item, index) => {
                                const value = item[metal] || 0;
                                const x = (index / (trendData.length - 1)) * 100;
                                const y = 100 - ((value / maxValue) * 100);
                                return `${x}% ${y}%`;
                              }).join(' L ');