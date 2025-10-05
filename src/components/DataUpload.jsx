import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle, X, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { getTypeParameterOwner } from 'typescript';

const DataUpload = ({ onDataUpload, onSectionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidData, setIsValidData] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const requiredColumns = [
    "Location",
    "Latitude",
    "Longitude",
    "F (mg/L)",
    "pH",
    "NO3 (mg/L)",
    "As (ppb)",
    "U (ppb)",
    "Fe (ppm)",
    "EC (µS/cm at 25 °C)",
    "Total Hardness (mg/L)",
  ];

  const sampleData = [
    {
      Location: "Sample Location 1",
      Latitude: 34.0522,
      Longitude: -118.2437,
      "F (mg/L)": 0.7,
      pH: 7.5,
      "NO3 (mg/L)": 10,
      "As (ppb)": 5,
      "U (ppb)": 15,
      "Fe (ppm)": 0.3,
      "EC (µS/cm at 25 °C)": 500,
      "Total Hardness (mg/L)": 150,
    },
    {
      Location: "Sample Location 1",
      Latitude: 34.0522,
      Longitude: -118.2437,
      "F (mg/L)": 0.7,
      pH: 7.5,
      "NO3 (mg/L)": 10,
      "As (ppb)": 5,
      "U (ppb)": 15,
      "Fe (ppm)": 0.3,
      "EC (µS/cm at 25 °C)": 500,
      "Total Hardness (mg/L)": 150,
    },
    {
      Location: "Sample Location 1",
      Latitude: 34.0522,
      Longitude: -118.2437,
      "F (mg/L)": 0.7,
      pH: 7.5,
      "NO3 (mg/L)": 10,
      "As (ppb)": 5,
      "U (ppb)": 15,
      "Fe (ppm)": 0.3,
      "EC (µS/cm at 25 °C)": 500,
      "Total Hardness (mg/L)": 150,
    },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    validatefile(file);
  };

  const validatefile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n");
      const headers = rows[0].split(",").map((h) => h.trim());

      const errors = [];

      // Simulate validation scenarios
      const hasAllColumns = Math.random() > 0.2; // 80% chance
      const hasValidData = Math.random() > 0.1; // 90% chance

      if (!hasAllColumns) {
        errors.push("Missing required columns in the uploaded file.");
      }

      if (!hasValidData) {
        errors.push("Data format is invalid.");
      }

      // Real validation fallback (optional)
      if (hasAllColumns && hasValidData) {
        requiredColumns.forEach((col) => {
          if (!headers.includes(col)) {
            errors.push(`Missing required column: ${col}`);
          }
        });

        if (rows.length < 2) {
          errors.push("CSV file must contain at least one data row");
        }

        if (rows.length > 1 && errors.length === 0) {
          const firstDataRow = rows[1].split(",");

          const latIndex = headers.indexOf("Latitude");
          const lngIndex = headers.indexOf("Longitude");

          if (isNaN(parseFloat(firstDataRow[latIndex]))) {
            errors.push("Latitude must be a number");
          }

          if (isNaN(parseFloat(firstDataRow[lngIndex]))) {
            errors.push("Longitude must be a number");
          }
        }
      }

      setValidationErrors(errors);
      setIsValidData(errors.length === 0);

      if (errors.length === 0) {
        toast({
          title: "File validated successfully",
          description: `Ready for analysis`,
          variant: "success",
        });
      }
    };

    reader.readAsText(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValidationErrors([]);
    setIsValidData(false);
  };

  const downloadSampleCSV = () => {
    const headers = requiredColumns.join(',');
    const rows = sampleData.map(row => 
      requiredColumns.map(col => row[col]).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'water_quality_sample.csv');
    a.click();
  };

  const proceedToAnalysis = async () => {
    if (!isValidData || !uploadedFile) return;
    const formData = new FormData();
    formData.append("file", uploadedFile); // 'file' must match backend field name

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData, // No need to set Content-Type manually
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Upload successful",
          description: `${result.count} samples processed`,
          variant: "default",
        });
        onSectionChange("results");
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Server error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not reach the server",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    }
  };

  const loadSampleData = () => {
    // Create a mock file object
    const csvContent = [
      requiredColumns.join(','),
      ...sampleData.map(row => requiredColumns.map(col => row[col]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const file = new File([blob], 'sample_data.csv', { type: 'text/csv' });
    
    // Process the sample data
    setUploadedFile(file);
    
    // Directly process the sample data
    onDataUpload(sampleData);
    setIsValidData(true);
    
    toast({
      title: "Sample data loaded",
      description: `${sampleData.length} sample records ready for analysis`,
      variant: "success"
    });
  };

return (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Water Quality Data</h1>

      <div className="flex flex-row gap-6">
        {/* Upload Area - Left Side (Larger) */}
        <div className="flex-grow-[4]" style={{ flexGrow: 4 }}>
          <Card className="h-full shadow-lg border-2 border-blue-300">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold" style={{color:'Black'}}>📂 {t('Upload Data File')}</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Drag and drop your CSV file</h3>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <div className="flex gap-3">
                      <Button asChild>
                        <label htmlFor="file-upload">Select CSV File</label>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={loadSampleData}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Use Sample Dataset
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {validationErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="mt-2">
                          <p className="font-medium">Please fix the following errors:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isValidData && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        File validated successfully. Ready for analysis.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <Button onClick={proceedToAnalysis} disabled={!isValidData}>
                      Proceed to Analysis
                    </Button>
                    <Button variant="outline" onClick={removeFile}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card - Right Side (Smaller) */}
        <div className="flex-grow-[2]" style={{width:'30vw'}}>
          <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-bold tracking-wide">
                <h1 style={{color:'black'}}>📋Data Upload Instructions</h1>
              </CardTitle>
              <CardDescription className="text-blue-100 font-medium">
                <h5 style={{color:'black'}}>Please upload a CSV file with water quality parameters</h5>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Required Columns Section */}
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <p className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-base">
                    <span className="text-blue-600">📊</span>
                    Required Columns:
                  </p>
                  {/* Side by side grid (2 or 3 columns) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {requiredColumns.map((col, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-2 rounded-md border border-blue-200 
                                   hover:from-blue-200 hover:to-indigo-200 transition-colors duration-200 cursor-default"
                      >
                        <span className="text-sm font-semibold text-blue-900">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Start Section */}
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <p className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span className="text-green-600">💡</span>
                    Quick Start:
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSampleCSV}
                    className="w-full flex items-center h-7 justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 
                               text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-400 transition-all duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    Download Sample CSV
                  </Button>
                </div>

                {/* Warning Section */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-900 font-medium flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">⚠️</span>
                    Make sure your CSV file contains all required columns with correct data types
                    (numbers for coordinates and metal concentrations).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
};

export default DataUpload;