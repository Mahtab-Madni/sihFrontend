import { BarChart3, Upload, Home, FileText, Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command } from 'lucide-react';


interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const navItems = [
      { id: 'home', label: 'Home', icon: Home },
  { id: 'upload', label: 'Upload Data', icon: Upload },
  { id: 'connect', label: 'Connect Device', icon:Command }, // new item
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-gradient-tricolor h-1"></div>

      {/* Official Header */}
      <header className="shadow-official border-b border-border/50 dark:bg-gray-900 dark:text-gray-100">
        {/* Branding Row */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between w-full">
            {/* Left Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="logo-JalShakti.png"
                alt="Government Emblem"
                className="h-14 w-auto"
              />
            </div>

            {/* Center Swachh Bharat Logo */}
            <div className="hidden md:block">
              <img
                src="Swach-Bharat_Preview.png"
                alt="Swachh Bharat"
                style={{ height: "6rem", width: "auto" }}
  className="object-contain"
              />
            </div>

            {/* Right Government of India Branding */}
            <div className="flex flex-col items-end">
              
            </div>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="bg-green-600">
          <div className="container mx-auto px-2 flex items-center justify-between">
            <nav className="container mx-auto flex items-center justify-center space-x-4 py-2"> 


              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'official' : 'ghost'}
                    onClick={() => onSectionChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 text-white hover:bg-green-700 hover:text-white ${
                      activeSection === item.id ? 'bg-green-700' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              className="lg:hidden text-white hover:bg-green-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
