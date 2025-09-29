import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DataUpload from '@/components/DataUpload';
import Results from '@/components/Results';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleDataUpload = (data: any[]) => {
    setUploadedData(data);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <DataUpload 
            onDataUpload={handleDataUpload} 
            onSectionChange={setActiveSection}
          />
        );
      case 'results':
        return <Results data={uploadedData} />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
