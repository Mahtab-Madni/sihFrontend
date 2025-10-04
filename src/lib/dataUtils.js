// Data processing utilities for water quality analysis

// Calculate Heavy Metal Pollution Index (HPI)
export const calculateHPI = (data) => {
  // Use actual data if available, otherwise use sample value
  if (data && data.length > 0) {
    // Simple calculation based on average metal concentrations
    let sum = 0;
    let count = 0;
    
    data.forEach(sample => {
      // Sum up all metal values
      ['Lead', 'Cadmium', 'Arsenic', 'Chromium', 'Mercury', 'Copper'].forEach(metal => {
        if (sample[metal] !== undefined) {
          sum += parseFloat(sample[metal]);
          count++;
        }
      });
    });
    
    // Calculate HPI based on average concentration * scaling factor
    return count > 0 ? parseFloat((sum / count * 1000).toFixed(2)) : 97.21;
  }
  
  // Default value if no data
  return 97.21;
};

// Calculate Heavy Metal Evaluation Index (HEI)
export const calculateHEI = (data) => {
  // Use actual data if available, otherwise use sample value
  if (data && data.length > 0) {
    // Simple calculation based on metal concentrations
    let sum = 0;
    
    data.forEach(sample => {
      // Sum up specific metals with different weights
      if (sample['Lead']) sum += parseFloat(sample['Lead']) * 2;
      if (sample['Cadmium']) sum += parseFloat(sample['Cadmium']) * 3;
      if (sample['Mercury']) sum += parseFloat(sample['Mercury']) * 4;
    });
    
    return parseFloat((sum * 10).toFixed(2));
  }
  
  // Default value if no data
  return 5.99;
};

// Calculate Contamination Degree (CD)
export const calculateCD = (data) => {
  // Use actual data if available, otherwise use sample value
  if (data && data.length > 0) {
    // Simple calculation
    let sum = 0;
    let count = 0;
    
    data.forEach(sample => {
      ['Lead', 'Cadmium', 'Arsenic', 'Chromium', 'Mercury'].forEach(metal => {
        if (sample[metal] !== undefined) {
          // Calculate contamination factor (CF) as value - background value
          const cf = parseFloat(sample[metal]) - 0.01; // Assuming background value of 0.01
          sum += cf;
          count++;
        }
      });
    });
    
    return count > 0 ? parseFloat((sum / count).toFixed(2)) : -0.01;
  }
  
  // Default value if no data
  return -0.01;
};

// Process sample data to determine risk levels based on HPI
export const processSampleRisk = (data) => {
  if (!data || data.length === 0) {
    // Default values if no data
    return {
      safe: 32,
      moderate: 8,
      highRisk: 0
    };
  }
  
  // Calculate risk levels based on HPI values for each sample
  let safeCount = 0;
  let moderateCount = 0;
  let highRiskCount = 0;
  
  data.forEach(sample => {
    // Calculate individual sample HPI
    let metalSum = 0;
    let metalCount = 0;
    
    ['Lead', 'Cadmium', 'Arsenic', 'Chromium', 'Mercury', 'Copper'].forEach(metal => {
      if (sample[metal] !== undefined) {
        metalSum += parseFloat(sample[metal]);
        metalCount++;
      }
    });
    
    const sampleHPI = metalCount > 0 ? metalSum / metalCount * 1000 : 0;
    
    // Classify based on HPI value
    if (sampleHPI < 100) {
      safeCount++;
    } else if (sampleHPI === 100) {
      moderateCount++;
    } else {
      highRiskCount++;
    }
  });
  
  return {
    safe: safeCount,
    moderate: moderateCount,
    highRisk: highRiskCount
  };
};

// Generate monthly trend data for heavy metals
export const generateTrendData = (userData) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // If user data is available, use it to create more realistic trends
  if (userData && userData.length > 0) {
    // Get average values from user data
    const baseValues = {
      As: 0,
      Cd: 0,
      Cr: 0,
      Hg: 0,
      Pb: 0
    };
    
    let count = 0;
    userData.forEach(sample => {
      if (sample['Arsenic']) baseValues.As += parseFloat(sample['Arsenic']);
      if (sample['Cadmium']) baseValues.Cd += parseFloat(sample['Cadmium']);
      if (sample['Chromium']) baseValues.Cr += parseFloat(sample['Chromium']);
      if (sample['Mercury']) baseValues.Hg += parseFloat(sample['Mercury']);
      if (sample['Lead']) baseValues.Pb += parseFloat(sample['Lead']);
      count++;
    });
    
    // Calculate averages
    if (count > 0) {
      Object.keys(baseValues).forEach(key => {
        baseValues[key] = baseValues[key] / count;
      });
    } else {
      // Default values if no data
      baseValues.As = 0.008;
      baseValues.Cd = 0.012;
      baseValues.Cr = 0.018;
      baseValues.Hg = 0.015;
      baseValues.Pb = 0.025;
    }
    
    // Generate trend with slight variations based on real data
    return months.map((month, index) => {
      // Create slight variations for trend visualization
      const variation = 0.15; // 15% variation
      const trend = index / months.length; // Gradual trend factor
      
      return {
        name: month,
        As: parseFloat((baseValues.As * (1 + (Math.random() * variation * 2 - variation) + trend * 0.1)).toFixed(4)),
        Cd: parseFloat((baseValues.Cd * (1 + (Math.random() * variation * 2 - variation) - trend * 0.05)).toFixed(4)),
        Cr: parseFloat((baseValues.Cr * (1 + (Math.random() * variation * 2 - variation) + trend * 0.15)).toFixed(4)),
        Hg: parseFloat((baseValues.Hg * (1 + (Math.random() * variation * 2 - variation) - trend * 0.1)).toFixed(4)),
        Pb: parseFloat((baseValues.Pb * (1 + (Math.random() * variation * 2 - variation) + trend * 0.2)).toFixed(4))
      };
    });
  }
  
  // Fallback to sample data if no user data
  return months.map((month, index) => {
    // Create a more realistic trend with gradual changes
    const baseLine = index / months.length; // Creates a gradual increase
    
    return {
      name: month,
      As: parseFloat((0.008 + baseLine * 0.002 + Math.random() * 0.001).toFixed(4)),
      Cd: parseFloat((0.012 - baseLine * 0.001 + Math.random() * 0.002).toFixed(4)),
      Cr: parseFloat((0.018 + baseLine * 0.003 + Math.random() * 0.002).toFixed(4)),
      Hg: parseFloat((0.015 - baseLine * 0.002 + Math.random() * 0.001).toFixed(4)),
      Pb: parseFloat((0.025 + baseLine * 0.005 + Math.random() * 0.003).toFixed(4))
    };
  });
};

// Generate metal concentration data for donut chart
export const generateMetalConcentrationData = (userData) => {
  // Define colors for each metal
  const metalColors = {
    'Iron': '#3b82f6',
    'Manganese': '#8b5cf6',
    'Copper': '#10b981',
    'Mercury': '#6b7280',
    'Nickel': '#6366f1',
    'Cadmium': '#ec4899',
    'Chromium': '#f97316',
    'Arsenic': '#eab308',
    'Lead': '#14b8a6',
    'Zinc': '#ef4444',
    'Aluminum': '#22c55e'
  };
  
  // If user data is available, use it to create metal concentration data
  if (userData && userData.length > 0) {
    // Calculate average values for each metal from user data
    const metalValues = {};
    let count = 0;
    
    // Map from full names to short names for processing
    const metalMapping = {
      'Iron': 'Iron',
      'Manganese': 'Manganese',
      'Copper': 'Copper',
      'Mercury': 'Mercury',
      'Nickel': 'Nickel',
      'Cadmium': 'Cadmium',
      'Chromium': 'Chromium',
      'Arsenic': 'Arsenic',
      'Lead': 'Lead',
      'Zinc': 'Zinc',
      'Aluminum': 'Aluminum'
    };
    
    // Initialize metal values
    Object.keys(metalMapping).forEach(metal => {
      metalValues[metal] = 0;
    });
    
    // Sum up values from all samples
    userData.forEach(sample => {
      Object.keys(metalMapping).forEach(metal => {
        if (sample[metal] !== undefined) {
          metalValues[metal] += parseFloat(sample[metal]);
        }
      });
      count++;
    });
    
    // Calculate averages
    if (count > 0) {
      Object.keys(metalValues).forEach(metal => {
        metalValues[metal] = metalValues[metal] / count;
      });
    }
    
    // Calculate total for percentage
    const total = Object.values(metalValues).reduce((sum, value) => sum + value, 0);
    
    // Create data array with calculated values
    const result = Object.keys(metalValues)
      .filter(metal => metalValues[metal] > 0) // Only include metals with values
      .map(metal => {
        const value = parseFloat(metalValues[metal].toFixed(4));
        const percentage = parseFloat(((value / total) * 100).toFixed(1));
        return {
          name: `${metal} (${metal.substring(0, 2)})`,
          value,
          percentage,
          color: metalColors[metal] || '#888888' // Use defined color or default
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by value descending
    
    return result.length > 0 ? result : defaultMetalData;
  }
  
  // Default data if no user data is available
  const defaultMetalData = [
    { name: 'Iron (Fe)', value: 0.5800, percentage: 15.6, color: '#3b82f6' },
    { name: 'Manganese (Mn)', value: 0.2700, percentage: 7.3, color: '#8b5cf6' },
    { name: 'Copper (Cu)', value: 0.2700, percentage: 7.3, color: '#10b981' },
    { name: 'Mercury (Hg)', value: 0.2300, percentage: 6.2, color: '#6b7280' },
    { name: 'Nickel (Ni)', value: 0.0780, percentage: 2.1, color: '#6366f1' },
    { name: 'Cadmium (Cd)', value: 0.0400, percentage: 1.1, color: '#ec4899' },
    { name: 'Chromium (Cr)', value: 0.0300, percentage: 0.8, color: '#f97316' },
    { name: 'Arsenic (As)', value: 0.0200, percentage: 0.5, color: '#eab308' },
    { name: 'Lead (Pb)', value: 0.0180, percentage: 0.5, color: '#14b8a6' },
    { name: 'Zinc (Zn)', value: 0.0150, percentage: 0.4, color: '#ef4444' },
    { name: 'Aluminum (Al)', value: 1.8140, percentage: 58.2, color: '#22c55e' }
  ];
  
  return defaultMetalData;
};

// Get highest and lowest metal concentrations
export const getExtremeConcentrations = (data) => {
  if (!data || data.length === 0) {
    return { highest: null, lowest: null };
  }
  
  const sorted = [...data].sort((a, b) => b.value - a.value);
  return {
    highest: sorted[0],
    lowest: sorted[sorted.length - 1]
  };
};