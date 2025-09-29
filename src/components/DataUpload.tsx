import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataUploadProps {
  onDataUpload: (data: any[]) => void;
  onSectionChange: (section: string) => void;
}

const DataUpload = ({ onDataUpload, onSectionChange }: DataUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidData, setIsValidData] = useState(false);
  const { toast } = useToast();

  const requiredColumns = [
    'Sample_ID', 'Latitude', 'Longitude', 'Lead', 'Cadmium', 
    'Arsenic', 'Chromium', 'Mercury', 'Copper'
  ];

  const sampleData = [
    {
      Sample_ID: 'GW001',
      Latitude: 28.6139,
      Longitude: 77.2090,
      Lead: 0.05,
      Cadmium: 0.002,
      Arsenic: 0.008,
      Chromium: 0.025,
      Mercury: 0.001,
      Copper: 0.15
    },
    {
      Sample_ID: 'GW002', 
      Latitude: 28.6200,
      Longitude: 77.2150,
      Lead: 0.12,
      Cadmium: 0.008,
      Arsenic: 0.015,
      Chromium: 0.045,
      Mercury: 0.003,
      Copper: 0.28
    },
    {
      Sample_ID: 'GW003',
      Latitude: 28.6180,
      Longitude: 77.2120,
      Lead: 0.08,
      Cadmium: 0.005,
      Arsenic: 0.012,
      Chromium: 0.032,
      Mercury: 0.002,
      Copper: 0.19
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    validateFile(file);
  };

  const validateFile = (file: File) => {
    // Simulated validation for prototype
    const errors: string[] = [];
    
    // Simulate random validation scenarios
    const hasAllColumns = Math.random() > 0.2; // 80% chance of having all columns
    const hasValidData = Math.random() > 0.1; // 90% chance of valid data
    
    if (!hasAllColumns) {
      errors.push('Missing required columns: Lead, Arsenic');
    }
    
    if (!hasValidData) {
      errors.push('Invalid data format in rows 5, 8, 12');
    }

    setValidationErrors(errors);
    setIsValidData(errors.length === 0);

    if (errors.length === 0) {
      toast({
        title: "File validated successfully",
        description: "Data is ready for analysis",
        variant: "default",
      });
    }
  };

  const handleUseSampleData = () => {
    setUploadedFile(null);
    setValidationErrors([]);
    setIsValidData(true);
    onDataUpload(sampleData);
    
    toast({
      title: "Sample data loaded",
      description: "Ready to proceed with analysis",
      variant: "default",
    });
  };

  const handleProceedToAnalysis = () => {
    if (isValidData) {
      onDataUpload(sampleData); // Use sample data for prototype
      onSectionChange('results');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="scientific-heading text-2xl flex items-center space-x-2">
            <Upload className="h-6 w-6" />
            <span>Data Upload</span>
          </CardTitle>
          <CardDescription>
            Upload your groundwater sample data in CSV or Excel format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5 shadow-data'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-data rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">Drop your files here</p>
                <p className="text-muted-foreground">or click to browse</p>
              </div>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </div>

          {/* Sample Data Option */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Or try with sample data</p>
            <Button variant="scientific" onClick={handleUseSampleData}>
              Use Sample Dataset
            </Button>
          </div>

          {/* Uploaded File Info */}
          {uploadedFile && (
            <Card className="shadow-data">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setValidationErrors([]);
                      setIsValidData(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Results */}
          {(uploadedFile || isValidData) && (
            <div className="space-y-3">
              {validationErrors.length > 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Validation Errors:</p>
                      {validationErrors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-safe bg-safe/10">
                  <CheckCircle className="h-4 w-4 text-safe" />
                  <AlertDescription className="text-safe-foreground">
                    Data validation successful! Ready to proceed with analysis.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Proceed Button */}
          {isValidData && (
            <div className="text-center">
              <Button
                variant="water"
                size="lg"
                onClick={handleProceedToAnalysis}
                className="text-lg px-8"
              >
                Proceed to Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required Format Info */}
      <Card className="shadow-data">
        <CardHeader>
          <CardTitle className="scientific-heading">Required Data Format</CardTitle>
          <CardDescription>
            Your dataset should include the following columns:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {requiredColumns.map((column) => (
              <div key={column} className="data-value text-center">
                {column}
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Metal concentrations should be in mg/L. 
              Latitude and longitude should be in decimal degrees.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUpload;