import { Droplets, BarChart3, Upload, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Data Upload', icon: Upload },
    { id: 'results', label: 'Results', icon: FileDown },
  ];

  return (
    <header className="bg-card shadow-scientific border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-data">
              <Droplets className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold scientific-heading">Aqualyx</h1>
              <p className="text-sm text-muted-foreground">Groundwater Contamination Analysis</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'scientific' : 'ghost'}
                  onClick={() => onSectionChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;