import { Shield, BarChart3, Upload, FileDown, Home, FileText, Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-gradient-tricolor h-1"></div>
      
      {/* Official Header */}
      <header className="bg-card shadow-official border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Government Branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full shadow-card">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Government of India</span>
                  <span>•</span>
                  <span>Ministry of Jal Shakti</span>
                </div>
                <h1 className="text-2xl font-bold scientific-heading">Aqualyx</h1>
                <p className="text-sm text-muted-foreground">Heavy Metal Contamination Assessment Portal</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'official' : 'ghost'}
                    onClick={() => onSectionChange(item.id)}
                    className="flex items-center space-x-2 px-4 py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Menu */}
            <Button variant="ghost" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;