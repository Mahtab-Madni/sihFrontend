import { BarChart3, Upload, Home, FileText, Phone, Menu, Command, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ activeSection, onSectionChange }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Set initial language on component mount
  useEffect(() => {
    const currentLang = i18n.language || localStorage.getItem('userLanguage') || 'en';
    setSelectedLanguage(currentLang);
  }, [i18n.language]);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
  ];

  const navItems = [
    { id: 'home', label: t('Home'), icon: Home },
    { id: 'upload', label: t('Upload Data'), icon: Upload },
    { id: 'connect', label: 'Connect Device', icon: Command }, // new item
    { id: 'results', label: t('Results'), icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const handleLanguageChange = (languageCode) => {
    try {
      // Update state
      setSelectedLanguage(languageCode);
      setIsLanguageDropdownOpen(false);
      
      // Save to localStorage
      localStorage.setItem('userLanguage', languageCode);
      
      // Update HTML lang attribute
      document.documentElement.lang = languageCode;
      
      // Change language in i18n
      i18n.changeLanguage(languageCode);
      
      // Log for debugging
      console.log('Language changed to:', languageCode);
      
      // Force reload to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error changing language:', error);
      alert('भाषा बदलने में समस्या हुई। कृपया पुनः प्रयास करें।');
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-gradient-tricolor h-1"></div>

      {/* Click outside handler for dropdown */}
      {isLanguageDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}

      {/* Official Header */}
      <header className="shadow-official border-b border-border/50 dark:bg-gray-900 dark:text-gray-100 relative z-50">
        {/* Branding Row */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between w-full">
            {/* Left Logo */}
            <div className="text-right">
              <h1 className="text-lg font-bold text-primary">{t('AquaLyx')}</h1>
              <p className="text-xs text-muted-foreground">
                Ministry of Jal Shakti
              </p>
              <p className="text-xs text-muted-foreground">
                Government of India
              </p>
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
           
             <div className="flex items-center space-x-3">
              <img
                src="logo-JalShakti.png"
                alt="Government Emblem"
                className="h-14 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-card dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className={`flex items-center space-x-1 ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Language Selector */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-accent"
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{getCurrentLanguage()?.nativeName}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  {/* Language Dropdown */}
                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                            selectedLanguage === language.code 
                              ? 'bg-accent text-accent-foreground font-medium' 
                              : 'text-foreground'
                          }`}
                          onClick={() => handleLanguageChange(language.code)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{language.nativeName}</span>
                            <span className="text-xs text-muted-foreground">{language.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;