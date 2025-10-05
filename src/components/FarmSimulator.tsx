// components/EnhancedFarmSimulator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types
interface FarmArea {
  id: string;
  name: string;
  area: number;
  center: {
    lat: number;
    lng: number;
  };
  northEast: {
    lat: number;
    lng: number;
  };
  southWest: {
    lat: number;
    lng: number;
  };
  address: string;
}

interface NasaData {
  soilMoisture: number;
  temperature: number;
  ndvi: number;
  rainfall: number;
  vegetationHealth: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface Crop {
  id: string;
  name: string;
  type: string;
  area: number;
  plantingDate: string;
  harvestDate: string;
  status: 'planted' | 'growing' | 'ready' | 'harvested';
  health: number;
  yield: number;
  coordinates: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  color: string;
  growthStage: number;
  waterRequirement: number;
  fertilizerRequirement: number;
  fertilizerApplied?: FertilizerApplication[];
  growthData?: GrowthDataPoint[];
}

interface FertilizerApplication {
  id: string;
  date: string;
  type: string;
  amount: number;
  npk: { n: number; p: number; k: number };
  notes: string;
}

interface GrowthDataPoint {
  date: string;
  growthStage: number;
  health: number;
  height?: number;
  leafCount?: number;
  soilMoisture: number;
  temperature: number;
  rainfall: number;
}

interface FertilizerRecommendation {
  type: string;
  amount: number;
  npk: { n: number; p: number; k: number };
  timing: string;
  method: string;
  notes: string;
  confidence: number;
}

interface GrowthAnalysis {
  summary: string;
  recommendations: string[];
  risks: string[];
  predictedYield: number;
  growthTimeline: GrowthDataPoint[];
  keyMetrics: {
    avgGrowthRate: number;
    healthScore: number;
    waterEfficiency: number;
    fertilizerEfficiency: number;
  };
}

interface FarmSimulatorProps {
  farmData: FarmArea;
}

// Crop Configuration
const CROP_TYPES = {
  wheat: {
    name: 'Wheat',
    color: '#FFD700',
    growthDays: 120,
    idealTemp: { min: 15, max: 25 },
    waterRequirement: 500,
    fertilizerRequirement: 120,
    baseYield: 3.5,
    fertilizerSchedule: [
      { stage: 'planting', npk: { n: 60, p: 40, k: 20 }, type: 'Basal' },
      { stage: 'tillering', npk: { n: 40, p: 20, k: 30 }, type: 'Top Dress' },
      { stage: 'heading', npk: { n: 20, p: 10, k: 10 }, type: 'Top Dress' }
    ],
    soilRequirements: {
      pH: { min: 6.0, max: 7.5 },
      organicMatter: { min: 2.0, max: 5.0 }
    }
  },
  corn: {
    name: 'Corn',
    color: '#FFA500',
    growthDays: 90,
    idealTemp: { min: 18, max: 30 },
    waterRequirement: 600,
    fertilizerRequirement: 180,
    baseYield: 8.0,
    fertilizerSchedule: [
      { stage: 'planting', npk: { n: 80, p: 50, k: 40 }, type: 'Basal' },
      { stage: 'v6', npk: { n: 60, p: 30, k: 50 }, type: 'Side Dress' },
      { stage: 'tasseling', npk: { n: 40, p: 20, k: 30 }, type: 'Foliar' }
    ],
    soilRequirements: {
      pH: { min: 5.8, max: 7.0 },
      organicMatter: { min: 2.5, max: 6.0 }
    }
  },
  rice: {
    name: 'Rice',
    color: '#87CEEB',
    growthDays: 150,
    idealTemp: { min: 20, max: 35 },
    waterRequirement: 900,
    fertilizerRequirement: 150,
    baseYield: 4.5,
    fertilizerSchedule: [
      { stage: 'transplanting', npk: { n: 50, p: 30, k: 20 }, type: 'Basal' },
      { stage: 'tillering', npk: { n: 40, p: 20, k: 30 }, type: 'Top Dress' },
      { stage: 'panicle', npk: { n: 30, p: 10, k: 20 }, type: 'Top Dress' }
    ],
    soilRequirements: {
      pH: { min: 5.5, max: 6.5 },
      organicMatter: { min: 3.0, max: 8.0 }
    }
  },
  soybean: {
    name: 'Soybean',
    color: '#32CD32',
    growthDays: 100,
    idealTemp: { min: 15, max: 28 },
    waterRequirement: 450,
    fertilizerRequirement: 80,
    baseYield: 2.8,
    fertilizerSchedule: [
      { stage: 'planting', npk: { n: 20, p: 60, k: 40 }, type: 'Inoculant' },
      { stage: 'flowering', npk: { n: 10, p: 20, k: 30 }, type: 'Foliar' }
    ],
    soilRequirements: {
      pH: { min: 6.0, max: 7.0 },
      organicMatter: { min: 2.0, max: 5.0 }
    }
  },
  cotton: {
    name: 'Cotton',
    color: '#FFFFFF',
    growthDays: 160,
    idealTemp: { min: 20, max: 32 },
    waterRequirement: 700,
    fertilizerRequirement: 200,
    baseYield: 1.2,
    fertilizerSchedule: [
      { stage: 'planting', npk: { n: 40, p: 50, k: 30 }, type: 'Basal' },
      { stage: 'squaring', npk: { n: 60, p: 30, k: 40 }, type: 'Side Dress' },
      { stage: 'boll', npk: { n: 30, p: 20, k: 30 }, type: 'Foliar' }
    ],
    soilRequirements: {
      pH: { min: 5.8, max: 7.0 },
      organicMatter: { min: 1.5, max: 4.0 }
    }
  }
};

// AI Analysis Service with Real Gemini API
class AIGrowthAnalysis {
  static async analyzeCropGrowth(
    crop: Crop,
    nasaData: NasaData,
    targetDate: string
  ): Promise<GrowthAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(crop, nasaData, targetDate);
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          cropType: crop.type,
          cropData: {
            growthStage: crop.growthStage,
            health: crop.health,
            plantingDate: crop.plantingDate,
            area: crop.area
          },
          environmentalData: nasaData
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return this.parseAIResponse(data, crop, targetDate);
    } catch (error) {
      console.error('AI Analysis error:', error);
      // Fallback to intelligent simulation based on real data
      return this.getIntelligentFallbackAnalysis(crop, nasaData, targetDate);
    }
  }

  static async getFertilizerRecommendation(
    crop: Crop,
    nasaData: NasaData,
    growthStage: number
  ): Promise<FertilizerRecommendation> {
    try {
      const prompt = this.buildFertilizerPrompt(crop, nasaData, growthStage);
      
      const response = await fetch('/api/gemini/fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          cropType: crop.type,
          growthStage: growthStage,
          soilData: {
            moisture: nasaData.soilMoisture,
            temperature: nasaData.temperature,
            health: nasaData.vegetationHealth
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return this.parseFertilizerResponse(data);
    } catch (error) {
      console.error('Fertilizer recommendation error:', error);
      return this.getIntelligentFertilizerRecommendation(crop, nasaData, growthStage);
    }
  }

  private static buildAnalysisPrompt(crop: Crop, nasaData: NasaData, targetDate: string): string {
    const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
    
    return `As an agricultural expert, analyze the growth of ${crop.name} (${cropConfig.name}) with the following parameters:

CROP DETAILS:
- Current Growth Stage: ${crop.growthStage}%
- Health Status: ${crop.health}%
- Planting Date: ${new Date(crop.plantingDate).toLocaleDateString()}
- Target Analysis Date: ${new Date(targetDate).toLocaleDateString()}
- Crop Area: ${(crop.area / 10000).toFixed(2)} hectares
- Crop Type: ${cropConfig.name}
- Expected Growth Duration: ${cropConfig.growthDays} days

ENVIRONMENTAL CONDITIONS:
- Soil Moisture: ${nasaData.soilMoisture}%
- Temperature: ${nasaData.temperature}°C
- Rainfall: ${nasaData.rainfall}mm
- Vegetation Health Index: ${nasaData.vegetationHealth}
- NDVI: ${nasaData.ndvi}

CROP REQUIREMENTS:
- Ideal Temperature: ${cropConfig.idealTemp.min}°C - ${cropConfig.idealTemp.max}°C
- Water Requirement: ${cropConfig.waterRequirement}mm per season
- Fertilizer Requirement: ${cropConfig.fertilizerRequirement}kg/ha

Please provide a comprehensive growth analysis including:
1. Growth summary and predictions until target date
2. Specific recommendations for optimal growth
3. Potential risks and mitigation strategies
4. Predicted yield based on current trajectory
5. Growth timeline projections

Format the response as JSON with this exact structure:
{
  "summary": "string (comprehensive analysis)",
  "recommendations": ["string array with specific actions"],
  "risks": ["string array with potential issues"],
  "predictedYield": number (in tons),
  "growthTimeline": [
    {
      "date": "YYYY-MM-DD",
      "growthStage": number,
      "health": number,
      "soilMoisture": number,
      "temperature": number,
      "rainfall": number
    }
  ],
  "keyMetrics": {
    "avgGrowthRate": number,
    "healthScore": number,
    "waterEfficiency": number,
    "fertilizerEfficiency": number
  }
}`;
  }

  private static buildFertilizerPrompt(crop: Crop, nasaData: NasaData, growthStage: number): string {
    const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
    const growthStageName = growthStage < 30 ? 'early vegetative' : 
                           growthStage < 60 ? 'mid vegetative' : 
                           growthStage < 90 ? 'reproductive' : 'maturity';
    
    return `As an agricultural expert, provide precise fertilizer recommendations for ${crop.name} (${cropConfig.name}):

CROP STATUS:
- Growth Stage: ${growthStage}% (${growthStageName})
- Current Health: ${crop.health}%
- Crop Type: ${cropConfig.name}

SOIL CONDITIONS:
- Soil Moisture: ${nasaData.soilMoisture}%
- Temperature: ${nasaData.temperature}°C
- Soil Health: ${nasaData.vegetationHealth}

CROP FERTILIZER SCHEDULE:
${cropConfig.fertilizerSchedule.map(s => `- ${s.stage}: ${s.type} (N${s.npk.n}-P${s.npk.p}-K${s.npk.k})`).join('\n')}

Provide a detailed fertilizer recommendation including:
- Exact NPK ratio needed
- Application amount per hectare
- Optimal timing
- Application method
- Specific notes for current conditions

Format the response as JSON:
{
  "type": "string (fertilizer type)",
  "amount": number (kg/ha),
  "npk": {"n": number, "p": number, "k": number},
  "timing": "string",
  "method": "string",
  "notes": "string",
  "confidence": number (0-1)
}`;
  }

  private static parseAIResponse(data: any, crop: Crop, targetDate: string): GrowthAnalysis {
    // Validate and parse the AI response
    if (data && typeof data === 'object') {
      return {
        summary: data.summary || "Analysis completed based on current crop conditions.",
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
        risks: Array.isArray(data.risks) ? data.risks : [],
        predictedYield: typeof data.predictedYield === 'number' ? data.predictedYield : crop.yield,
        growthTimeline: Array.isArray(data.growthTimeline) ? data.growthTimeline : this.generateRealisticTimeline(crop, targetDate, data),
        keyMetrics: data.keyMetrics && typeof data.keyMetrics === 'object' ? data.keyMetrics : {
          avgGrowthRate: 0.7,
          healthScore: 75,
          waterEfficiency: 0.8,
          fertilizerEfficiency: 0.75
        }
      };
    }
    
    throw new Error('Invalid AI response format');
  }

  private static parseFertilizerResponse(data: any): FertilizerRecommendation {
    if (data && typeof data === 'object') {
      return {
        type: data.type || "NPK 20-20-20",
        amount: typeof data.amount === 'number' ? data.amount : 150,
        npk: data.npk && typeof data.npk === 'object' ? data.npk : { n: 20, p: 20, k: 20 },
        timing: data.timing || "Within 7 days",
        method: data.method || "Broadcast",
        notes: data.notes || "Standard application for current growth stage",
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.85
      };
    }
    
    throw new Error('Invalid fertilizer response format');
  }

  private static generateRealisticTimeline(crop: Crop, targetDate: string, analysisData: any): GrowthDataPoint[] {
    const timeline = [];
    const startDate = new Date(crop.plantingDate);
    const endDate = new Date(targetDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
    
    for (let i = 0; i <= totalDays; i += 7) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const progress = Math.min(100, (i / cropConfig.growthDays) * 100);
      
      timeline.push({
        date: currentDate.toISOString().split('T')[0],
        growthStage: progress,
        health: Math.max(60, crop.health - (Math.random() * 10)),
        soilMoisture: 50 + (Math.random() * 30),
        temperature: 20 + (Math.random() * 15),
        rainfall: Math.random() * 40
      });
    }
    
    return timeline;
  }

  private static getIntelligentFallbackAnalysis(crop: Crop, nasaData: NasaData, targetDate: string): GrowthAnalysis {
    const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
    const daysPlanted = Math.floor((new Date().getTime() - new Date(crop.plantingDate).getTime()) / (1000 * 3600 * 24));
    const progress = Math.min(100, (daysPlanted / cropConfig.growthDays) * 100);
    
    // Intelligent analysis based on real data
    const tempScore = nasaData.temperature >= cropConfig.idealTemp.min && nasaData.temperature <= cropConfig.idealTemp.max ? 0.9 : 0.6;
    const moistureScore = nasaData.soilMoisture > 40 && nasaData.soilMoisture < 80 ? 0.85 : 0.5;
    const overallScore = (tempScore + moistureScore) / 2;
    
    return {
      summary: `Based on real-time environmental data, your ${crop.name} is ${progress >= 70 ? 'progressing well' : 'in development'}. Current conditions are ${overallScore > 0.7 ? 'favorable' : 'suboptimal'} for growth.`,
      recommendations: [
        nasaData.soilMoisture < 40 ? "Immediate irrigation recommended" : "Soil moisture levels adequate",
        `Monitor temperature fluctuations around ${nasaData.temperature}°C`,
        "Schedule soil nutrient testing for next week"
      ],
      risks: [
        nasaData.temperature > cropConfig.idealTemp.max + 5 ? "Heat stress possible" : "Temperature within safe range",
        nasaData.soilMoisture < 30 ? "Water deficit detected" : "Hydration levels acceptable"
      ],
      predictedYield: crop.yield * overallScore,
      growthTimeline: this.generateRealisticTimeline(crop, targetDate, {}),
      keyMetrics: {
        avgGrowthRate: 0.1 * overallScore,
        healthScore: crop.health * overallScore,
        waterEfficiency: moistureScore,
        fertilizerEfficiency: 0.7
      }
    };
  }

  private static getIntelligentFertilizerRecommendation(crop: Crop, nasaData: NasaData, growthStage: number): FertilizerRecommendation {
    const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
    const currentSchedule = cropConfig.fertilizerSchedule.find(s => 
      (growthStage < 30 && s.stage.includes('planting')) ||
      (growthStage >= 30 && growthStage < 70 && (s.stage.includes('tillering') || s.stage.includes('v6'))) ||
      (growthStage >= 70 && (s.stage.includes('heading') || s.stage.includes('tasseling')))
    );

    return {
      type: currentSchedule?.type || "Balanced NPK",
      amount: currentSchedule ? currentSchedule.npk.n + currentSchedule.npk.p + currentSchedule.npk.k : 150,
      npk: currentSchedule?.npk || { n: 20, p: 20, k: 20 },
      timing: "Based on current growth stage requirements",
      method: "Soil application",
      notes: `Recommended for ${cropConfig.name} at ${growthStage}% growth stage. Adjust based on soil conditions.`,
      confidence: 0.8
    };
  }
}

// Custom hook to fetch real NASA data
const useNasaData = (lat: number, lng: number) => {
  const [nasaData, setNasaData] = useState<NasaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using NASA POWER API for real agricultural data
        const response = await fetch(`/api/nasa-data?lat=${lat}&lng=${lng}`);
        
        if (!response.ok) {
          throw new Error(`NASA API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setNasaData(data);
      } catch (error) {
        console.error('Error fetching NASA data:', error);
        // Fallback to realistic simulated data based on location
        setNasaData({
          soilMoisture: 60 + (Math.random() * 25),
          temperature: 20 + (Math.random() * 15),
          ndvi: 0.5 + (Math.random() * 0.4),
          rainfall: Math.random() * 50,
          vegetationHealth: ['Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString(),
          location: { lat, lng }
        });
        setError('Using simulated environmental data');
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchNasaData();
      
      // Refresh data every 5 minutes
      const interval = setInterval(fetchNasaData, 300000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
      setError('Invalid coordinates provided');
    }
  }, [lat, lng]);

  return { nasaData, loading, error };
};

// Enhanced Crop Management Hook
const useCropManagement = (farmData: FarmArea, nasaData: NasaData | null) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  useEffect(() => {
    const savedCrops = localStorage.getItem(`farm-${farmData.id}-crops`);
    if (savedCrops) {
      try {
        setCrops(JSON.parse(savedCrops));
      } catch (error) {
        console.error('Error loading saved crops:', error);
      }
    }
  }, [farmData.id]);

  useEffect(() => {
    localStorage.setItem(`farm-${farmData.id}-crops`, JSON.stringify(crops));
  }, [crops, farmData.id]);

  // Real-time growth simulation based on environmental data
  useEffect(() => {
    if (crops.length === 0 || !nasaData) return;

    const interval = setInterval(() => {
      setCrops(prevCrops => 
        prevCrops.map(crop => {
          if (crop.status === 'harvested') return crop;

          const cropConfig = CROP_TYPES[crop.type as keyof typeof CROP_TYPES];
          const growthRate = calculateGrowthRate(crop, nasaData, cropConfig);
          const newGrowthStage = Math.min(100, crop.growthStage + growthRate);
          
          const healthImpact = calculateHealthImpact(crop, nasaData, cropConfig);
          const newHealth = Math.max(0, Math.min(100, crop.health + healthImpact));

          let newStatus = crop.status;
          if (newGrowthStage >= 95) newStatus = 'ready';
          else if (newGrowthStage >= 30) newStatus = 'growing';

          return {
            ...crop,
            growthStage: newGrowthStage,
            health: newHealth,
            status: newStatus,
            yield: calculateYield(crop, cropConfig, newHealth)
          };
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [crops, nasaData]);

  const calculateGrowthRate = (crop: Crop, nasaData: NasaData, cropConfig: any) => {
    let growthRate = 0.05; // Base growth rate
    
    // Temperature effect (real impact based on crop preferences)
    const temp = nasaData.temperature;
    const tempOptimal = temp >= cropConfig.idealTemp.min && temp <= cropConfig.idealTemp.max;
    growthRate += tempOptimal ? 0.15 : -0.05;

    // Soil moisture effect
    const moistureOptimal = nasaData.soilMoisture > 40 && nasaData.soilMoisture < 80;
    growthRate += moistureOptimal ? 0.1 : -0.03;

    // NDVI effect (vegetation health)
    growthRate += (nasaData.ndvi - 0.5) * 0.1;

    return Math.max(0.01, growthRate);
  };

  const calculateHealthImpact = (crop: Crop, nasaData: NasaData, cropConfig: any) => {
    let healthImpact = 0;

    // Temperature stress
    const temp = nasaData.temperature;
    if (temp < cropConfig.idealTemp.min - 5 || temp > cropConfig.idealTemp.max + 5) {
      healthImpact -= 0.8;
    }

    // Water stress
    if (nasaData.soilMoisture < 30) {
      healthImpact -= 0.5;
    } else if (nasaData.soilMoisture > 85) {
      healthImpact -= 0.3;
    }

    // Positive factors
    if (nasaData.vegetationHealth === 'Excellent') healthImpact += 0.2;
    if (nasaData.ndvi > 0.7) healthImpact += 0.1;

    return healthImpact;
  };

  const calculateYield = (crop: Crop, cropConfig: any, health: number) => {
    const baseYield = cropConfig.baseYield;
    const healthMultiplier = health / 100;
    const growthMultiplier = crop.growthStage / 100;
    const areaInHectares = crop.area / 10000;
    return baseYield * areaInHectares * healthMultiplier * growthMultiplier;
  };

  const addCrop = (cropData: Omit<Crop, 'id' | 'health' | 'status' | 'yield' | 'growthStage'>) => {
    const cropConfig = CROP_TYPES[cropData.type as keyof typeof CROP_TYPES];
    const newCrop: Crop = {
      ...cropData,
      id: `crop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      health: 100,
      status: 'planted',
      yield: 0,
      growthStage: 0,
      waterRequirement: cropConfig.waterRequirement,
      fertilizerRequirement: cropConfig.fertilizerRequirement
    };
    setCrops(prev => [...prev, newCrop]);
    return newCrop;
  };

  const removeCrop = (cropId: string) => {
    setCrops(prev => prev.filter(crop => crop.id !== cropId));
    if (selectedCrop?.id === cropId) {
      setSelectedCrop(null);
    }
  };

  const harvestCrop = (cropId: string) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? { ...crop, status: 'harvested', health: 0, growthStage: 100 }
        : crop
    ));
  };

  const irrigateCrop = (cropId: string) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? { ...crop, health: Math.min(100, crop.health + 15) }
        : crop
    ));
  };

  const fertilizeCrop = (cropId: string) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? { 
            ...crop, 
            health: Math.min(100, crop.health + 20), 
            growthStage: Math.min(100, crop.growthStage + 8) 
          }
        : crop
    ));
  };

  return {
    crops,
    selectedCrop,
    setSelectedCrop,
    addCrop,
    removeCrop,
    harvestCrop,
    irrigateCrop,
    fertilizeCrop
  };
};

// Data Panel Component
const DataPanel = ({ nasaData, loading, error, farmData }: { 
  nasaData: NasaData | null; 
  loading: boolean; 
  error: string | null;
  farmData: FarmArea;
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Farm Data - {farmData.name}</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading real-time satellite data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 capitalize">Farm Data - {farmData.name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold">Farm Information</h4>
          <p>Area: {(farmData.area / 10000).toFixed(2)} hectares</p>
          <p>Location: {farmData.address}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold">Coordinates</h4>
          <p>Lat: {farmData.center.lat.toFixed(6)}</p>
          <p>Lng: {farmData.center.lng.toFixed(6)}</p>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-700 font-semibold">Note: Using simulated data</p>
          <p className="text-yellow-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {nasaData && (
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">🌍 Real-time Environmental Data</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">Soil Moisture</p>
              <p className="text-lg font-bold text-blue-600">
                {nasaData.soilMoisture.toFixed(1)}%
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-lg font-bold text-orange-600">
                {nasaData.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">NDVI</p>
              <p className="text-lg font-bold text-green-600">
                {nasaData.ndvi.toFixed(3)}
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">Rainfall</p>
              <p className="text-lg font-bold text-cyan-600">
                {nasaData.rainfall.toFixed(1)}mm
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">Health</p>
              <p className="text-lg font-bold text-purple-600">
                {nasaData.vegetationHealth}
              </p>
            </div>
            <div className="text-center bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="text-xs font-bold text-gray-600">
                {new Date(nasaData.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Action Menu Component
const ActionMenu = ({ onAction }: { onAction: (action: string) => void }) => {
  const actions = [
    { id: 'irrigate', label: '💧 Irrigate', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'fertilize', label: '🌱 Fertilize', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'plant', label: '🌾 Plant Crops', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'harvest', label: '🔄 Harvest', color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'analyze', label: '📊 Analyze Soil', color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Farm Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`${action.color} text-white py-3 px-4 rounded-lg transition-colors font-medium text-sm`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// AI Analysis Panel Component
const AIAnalysisPanel = ({
  selectedCrop,
  analysisDate,
  onAnalysisDateChange,
  onAnalyze,
  onFertilizerRecommend,
  isAnalyzing
}: {
  selectedCrop: Crop | null;
  analysisDate: string;
  onAnalysisDateChange: (date: string) => void;
  onAnalyze: (crop: Crop) => void;
  onFertilizerRecommend: (crop: Crop) => void;
  isAnalyzing: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">🤖 AI Growth Analysis</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Target Date
          </label>
          <input
            type="date"
            value={analysisDate}
            onChange={(e) => onAnalysisDateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={selectedCrop?.plantingDate}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => selectedCrop && onAnalyze(selectedCrop)}
            disabled={!selectedCrop || isAnalyzing}
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </span>
            ) : (
              '📊 Analyze Growth'
            )}
          </button>
          
          <button
            onClick={() => selectedCrop && onFertilizerRecommend(selectedCrop)}
            disabled={!selectedCrop || isAnalyzing}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              '🌱 Get Fertilizer Tips'
            )}
          </button>
        </div>

        {!selectedCrop && (
          <p className="text-sm text-gray-500 text-center">
            Select a crop to enable AI analysis
          </p>
        )}
      </div>
    </div>
  );
};

// Analysis Results Modal with Charts
const AnalysisResultsModal = ({ analysis, crop, onClose }: {
  analysis: GrowthAnalysis;
  crop: Crop;
  onClose: () => void;
}) => {
  const growthChartData = analysis.growthTimeline.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    growth: point.growthStage,
    health: point.health
  }));

  const metricsData = [
    { name: 'Growth Rate', value: analysis.keyMetrics.avgGrowthRate * 100 },
    { name: 'Health Score', value: analysis.keyMetrics.healthScore },
    { name: 'Water Efficiency', value: analysis.keyMetrics.waterEfficiency * 100 },
    { name: 'Fertilizer Efficiency', value: analysis.keyMetrics.fertilizerEfficiency * 100 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">AI Growth Analysis - {crop.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Analysis Summary</h4>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-4">Growth Timeline</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="growth" stroke="#8884d8" name="Growth %" strokeWidth={2} />
                <Line type="monotone" dataKey="health" stroke="#82ca9d" name="Health %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Chart */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-4">Key Metrics</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Value']} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">✅ Recommendations</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">⚠️ Potential Risks</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysis.risks.map((risk, index) => (
                <li key={index} className="text-sm text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          {/* Yield Prediction */}
          <div className="lg:col-span-2 bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📈 Yield Prediction</h4>
            <p className="text-lg">
              Predicted Yield: <strong>{analysis.predictedYield.toFixed(2)} tons</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Based on current growth trajectory and environmental conditions
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
};

// Fertilizer Recommendation Modal
const FertilizerRecommendationModal = ({ recommendation, crop, onClose }: {
  recommendation: FertilizerRecommendation;
  crop: Crop;
  onClose: () => void;
}) => {
  const npkData = [
    { name: 'Nitrogen (N)', value: recommendation.npk.n, color: '#0088FE' },
    { name: 'Phosphorus (P)', value: recommendation.npk.p, color: '#00C49F' },
    { name: 'Potassium (K)', value: recommendation.npk.k, color: '#FFBB28' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Fertilizer Recommendation - {crop.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Recommendation Summary */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🌱 Recommended Fertilizer</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold">{recommendation.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold">{recommendation.amount} kg/ha</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timing</p>
                <p className="font-semibold">{recommendation.timing}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-semibold">{recommendation.method}</p>
              </div>
            </div>
          </div>

          {/* NPK Breakdown */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-4">NPK Composition</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={npkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {npkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📝 Application Notes</h4>
            <p className="text-sm text-gray-700">{recommendation.notes}</p>
          </div>

          {/* Confidence Level */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Confidence Level</h4>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${recommendation.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{(recommendation.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Close Recommendation
        </button>
      </div>
    </div>
  );
};

// Crop Creation Modal
const CropCreationModal = ({ 
  isOpen, 
  onClose, 
  onAddCrop, 
  coordinates 
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddCrop: (crop: any) => void;
  coordinates: { north: number; south: number; east: number; west: number } | null;
}) => {
  const [cropName, setCropName] = useState('');
  const [cropType, setCropType] = useState('wheat');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) return;

    const cropArea = calculateArea(
      coordinates.north, 
      coordinates.south, 
      coordinates.east, 
      coordinates.west
    );

    const cropConfig = CROP_TYPES[cropType as keyof typeof CROP_TYPES];
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + cropConfig.growthDays);

    onAddCrop({
      name: cropName || cropConfig.name,
      type: cropType,
      area: cropArea,
      plantingDate,
      harvestDate: harvestDate.toISOString().split('T')[0],
      coordinates,
      color: cropConfig.color
    });

    setCropName('');
    setCropType('wheat');
    setPlantingDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const calculateArea = (north: number, south: number, east: number, west: number) => {
    const latDistance = (north - south) * 111320;
    const lngDistance = (east - west) * 111320 * Math.cos((north + south) / 2 * Math.PI / 180);
    return Math.abs(latDistance * lngDistance);
  };

  if (!isOpen) return null;

  const cropConfig = CROP_TYPES[cropType as keyof typeof CROP_TYPES];
  const harvestDate = new Date(plantingDate);
  harvestDate.setDate(harvestDate.getDate() + cropConfig.growthDays);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Add New Crop</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Name
            </label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Enter crop name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {Object.entries(CROP_TYPES).map(([key, crop]) => (
                <option key={key} value={key}>
                  {crop.name} ({crop.growthDays} days)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planting Date
            </label>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {coordinates && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                Selected Area: {(calculateArea(
                  coordinates.north, 
                  coordinates.south, 
                  coordinates.east, 
                  coordinates.west
                ) / 10000).toFixed(4)} hectares
              </p>
              <p className="text-sm text-gray-600">
                Estimated Harvest: {harvestDate.toLocaleDateString()}
              </p>
            </div>
          )}

          {cropConfig.fertilizerSchedule && (
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-2">Fertilizer Schedule</h4>
              {cropConfig.fertilizerSchedule.map((schedule, index) => (
                <p key={index} className="text-xs text-gray-600">
                  {schedule.stage}: {schedule.type} (N:{schedule.npk.n}-P:{schedule.npk.p}-K:{schedule.npk.k})
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              Plant Crop
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Crop Management Panel
const CropManagementPanel = ({ 
  crops, 
  selectedCrop, 
  onCropSelect, 
  onRemoveCrop,
  onHarvestCrop,
  onIrrigateCrop,
  onFertilizeCrop
}: {
  crops: Crop[];
  selectedCrop: Crop | null;
  onCropSelect: (crop: Crop) => void;
  onRemoveCrop: (cropId: string) => void;
  onHarvestCrop: (cropId: string) => void;
  onIrrigateCrop: (cropId: string) => void;
  onFertilizeCrop: (cropId: string) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Crop Management</h3>
      
      <div className="space-y-3">
        {crops.map(crop => (
          <div
            key={crop.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedCrop?.id === crop.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => onCropSelect(crop)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{crop.name}</h4>
                <p className="text-sm text-gray-600">
                  {CROP_TYPES[crop.type as keyof typeof CROP_TYPES]?.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                  <span className="text-xs text-gray-500">
                    {(crop.area / 10000).toFixed(4)} ha • {crop.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-1">
                {crop.status !== 'harvested' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIrrigateCrop(crop.id);
                      }}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      title="Irrigate"
                    >
                      💧
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFertilizeCrop(crop.id);
                      }}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      title="Fertilize"
                    >
                      🌱
                    </button>
                  </>
                )}
                {crop.status === 'ready' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHarvestCrop(crop.id);
                    }}
                    className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                  >
                    Harvest
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCrop(crop.id);
                  }}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Growth</span>
                  <span>{crop.growthStage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${crop.growthStage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Health</span>
                  <span>{crop.health.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      crop.health > 70 ? 'bg-green-500' :
                      crop.health > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${crop.health}%` }}
                  />
                </div>
              </div>

              {crop.yield > 0 && (
                <div className="text-xs text-gray-600">
                  Estimated Yield: {crop.yield.toFixed(2)} tons
                </div>
              )}
            </div>
          </div>
        ))}
        
        {crops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No crops added yet</p>
            <p className="text-sm">Draw a rectangle on the map to add crops</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Real Google Maps Component
const GoogleFarmMap = ({ 
  farmData, 
  crops, 
  selectedCrop, 
  onCropSelect,
  onAreaSelected 
}: { 
  farmData: FarmArea;
  crops: Crop[];
  selectedCrop: Crop | null;
  onCropSelect: (crop: Crop) => void;
  onAreaSelected: (coordinates: { north: number; south: number; east: number; west: number }) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }

        // Load Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=drawing&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Define the global callback function
        (window as any).initMap = initializeMap;
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: farmData.center.lat, lng: farmData.center.lng },
        zoom: 14,
        mapTypeId: 'satellite',
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      setMap(googleMap);

      // Add farm boundary
      const farmBoundary = new google.maps.Rectangle({
        map: googleMap,
        bounds: {
          north: farmData.northEast.lat,
          south: farmData.southWest.lat,
          east: farmData.northEast.lng,
          west: farmData.southWest.lng
        },
        fillColor: '#00FF00',
        fillOpacity: 0.1,
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 2
      });

      // Setup drawing manager for crop areas
      const manager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.RECTANGLE]
        },
        rectangleOptions: {
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          strokeWeight: 2,
          editable: true,
          draggable: true
        }
      });

      manager.setMap(googleMap);
      setDrawingManager(manager);

      // Listen for rectangle completion
      google.maps.event.addListener(manager, 'rectanglecomplete', (rectangle: google.maps.Rectangle) => {
        const bounds = rectangle.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          
          onAreaSelected({
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng()
          });

          // Remove the rectangle after capturing coordinates
          rectangle.setMap(null);
          
          // Reset drawing mode
          manager.setDrawingMode(null);
        }
      });

      // Fit map to farm boundary
      googleMap.fitBounds(farmBoundary.getBounds()!);
    };

    loadGoogleMaps();

    return () => {
      if (drawingManager) {
        drawingManager.setMap(null);
      }
    };
  }, [farmData, onAreaSelected]);

  // Add crop markers to map
  useEffect(() => {
    if (!map) return;

    // Clear existing crop markers (in a real implementation, you'd manage markers properly)
    crops.forEach(crop => {
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(crop.coordinates.south, crop.coordinates.west),
        new google.maps.LatLng(crop.coordinates.north, crop.coordinates.east)
      );

      const rectangle = new google.maps.Rectangle({
        map: map,
        bounds: bounds,
        fillColor: crop.color,
        fillOpacity: 0.6,
        strokeColor: selectedCrop?.id === crop.id ? '#FFFFFF' : crop.color,
        strokeOpacity: 0.8,
        strokeWeight: selectedCrop?.id === crop.id ? 4 : 2,
        zIndex: selectedCrop?.id === crop.id ? 1000 : 1
      });

      rectangle.addListener('click', () => {
        onCropSelect(crop);
      });
    });
  }, [map, crops, selectedCrop, onCropSelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 md:h-[500px] rounded-lg border border-gray-300"
    />
  );
};

// Enhanced Farm Simulator Component
export default function EnhancedFarmSimulator({ farmData }: FarmSimulatorProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<any>(null);
  const [growthAnalysis, setGrowthAnalysis] = useState<GrowthAnalysis | null>(null);
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState<FertilizerRecommendation | null>(null);
  const [analysisDate, setAnalysisDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cropCreationModal, setCropCreationModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const { nasaData, loading, error } = useNasaData(farmData.center.lat, farmData.center.lng);
  const { 
    crops, 
    selectedCrop, 
    setSelectedCrop, 
    addCrop, 
    removeCrop, 
    harvestCrop,
    irrigateCrop,
    fertilizeCrop 
  } = useCropManagement(farmData, nasaData);

  const handleAction = async (action: string) => {
    setSelectedAction(action);
    
    const dataToUse = nasaData || {
      soilMoisture: 65,
      temperature: 28,
      ndvi: 0.72,
      rainfall: 15,
      vegetationHealth: 'Good'
    };
    
    const result = await processFarmAction(action, farmData, dataToUse, crops, selectedCrop);
    setActionResult(result);
    
    // Apply action effects to crops
    if (result.success && selectedCrop) {
      if (action === 'irrigate') {
        irrigateCrop(selectedCrop.id);
      } else if (action === 'fertilize') {
        fertilizeCrop(selectedCrop.id);
      } else if (action === 'harvest' && selectedCrop.status === 'ready') {
        harvestCrop(selectedCrop.id);
      } else if (action === 'plant') {
        // This will be handled by the map drawing
      }
    }
    
    setTimeout(() => {
      setSelectedAction(null);
      setActionResult(null);
    }, 5000);
  };

  const handleAreaSelected = (coordinates: { north: number; south: number; east: number; west: number }) => {
    setSelectedCoordinates(coordinates);
    setCropCreationModal(true);
  };

  const handleAddCrop = (cropData: any) => {
    addCrop(cropData);
  };

  const handleAIAnalysis = async (crop: Crop) => {
    if (!nasaData) {
      setActionResult({
        success: false,
        message: 'Environmental data required for analysis'
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysis = await AIGrowthAnalysis.analyzeCropGrowth(crop, nasaData, analysisDate);
      setGrowthAnalysis(analysis);
      setSelectedAction('analysis_result');
    } catch (error) {
      console.error('Analysis failed:', error);
      setActionResult({
        success: false,
        message: 'AI analysis failed. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFertilizerRecommendation = async (crop: Crop) => {
    if (!nasaData) {
      setActionResult({
        success: false,
        message: 'Environmental data required for fertilizer recommendation'
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const recommendation = await AIGrowthAnalysis.getFertilizerRecommendation(
        crop, 
        nasaData, 
        crop.growthStage
      );
      setFertilizerRecommendation(recommendation);
      setSelectedAction('fertilizer_recommendation');
    } catch (error) {
      console.error('Fertilizer recommendation failed:', error);
      setActionResult({
        success: false,
        message: 'Fertilizer recommendation failed. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold capitalize">Farm Simulator - {farmData.name}</h2>
              <p className="text-gray-600">{farmData.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                Click the rectangle drawing tool above the map, then draw an area for your crop
              </p>
            </div>
            
            {mapError ? (
              <div className="h-96 md:h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Google Maps failed to load</p>
                  <p className="text-sm text-gray-400">Please check your API key and try again</p>
                </div>
              </div>
            ) : (
              <GoogleFarmMap 
                farmData={farmData}
                crops={crops}
                selectedCrop={selectedCrop}
                onCropSelect={setSelectedCrop}
                onAreaSelected={handleAreaSelected}
              />
            )}
          </div>
        </div>

        {/* Right Column - Panels */}
        <div className="space-y-6">
          <DataPanel 
            nasaData={nasaData} 
            loading={loading} 
            error={error}
            farmData={farmData} 
          />
          
          <CropManagementPanel
            crops={crops}
            selectedCrop={selectedCrop}
            onCropSelect={setSelectedCrop}
            onRemoveCrop={removeCrop}
            onHarvestCrop={harvestCrop}
            onIrrigateCrop={irrigateCrop}
            onFertilizeCrop={fertilizeCrop}
          />
          
          <AIAnalysisPanel
            selectedCrop={selectedCrop}
            analysisDate={analysisDate}
            onAnalysisDateChange={setAnalysisDate}
            onAnalyze={handleAIAnalysis}
            onFertilizerRecommend={handleFertilizerRecommendation}
            isAnalyzing={isAnalyzing}
          />
          
          <ActionMenu onAction={handleAction} />
        </div>
      </div>

      {/* Modals */}
      <CropCreationModal
        isOpen={cropCreationModal}
        onClose={() => setCropCreationModal(false)}
        onAddCrop={handleAddCrop}
        coordinates={selectedCoordinates}
      />

      {growthAnalysis && selectedAction === 'analysis_result' && (
        <AnalysisResultsModal
          analysis={growthAnalysis}
          crop={selectedCrop!}
          onClose={() => {
            setGrowthAnalysis(null);
            setSelectedAction(null);
          }}
        />
      )}

      {fertilizerRecommendation && selectedAction === 'fertilizer_recommendation' && (
        <FertilizerRecommendationModal
          recommendation={fertilizerRecommendation}
          crop={selectedCrop!}
          onClose={() => {
            setFertilizerRecommendation(null);
            setSelectedAction(null);
          }}
        />
      )}

      {actionResult && selectedAction && !['analysis_result', 'fertilizer_recommendation'].includes(selectedAction) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {actionResult.success ? '✅ Action Successful' : '❌ Action Failed'}
            </h3>
            <p className="mb-4">{actionResult.message}</p>
            {actionResult.data && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <pre>{JSON.stringify(actionResult.data, null, 2)}</pre>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedAction(null);
                setActionResult(null);
              }}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Farm action processor
async function processFarmAction(
  action: string, 
  farmData: FarmArea, 
  nasaData: any, 
  crops: Crop[] = [],
  selectedCrop: Crop | null = null
) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const actions: { [key: string]: any } = {
    irrigate: {
      success: selectedCrop !== null,
      message: selectedCrop 
        ? `Irrigation applied to ${selectedCrop.name}. Water absorption improved.` 
        : 'Please select a crop to irrigate first.',
      data: selectedCrop ? {
        crop: selectedCrop.name,
        waterApplied: '50mm',
        soilMoistureIncrease: '15%'
      } : null
    },
    fertilize: {
      success: selectedCrop !== null,
      message: selectedCrop 
        ? `Fertilizer applied to ${selectedCrop.name}. Nutrient levels improved.` 
        : 'Please select a crop to fertilize first.',
      data: selectedCrop ? {
        crop: selectedCrop.name,
        fertilizerType: 'NPK 20-20-20',
        applicationRate: '150 kg/ha'
      } : null
    },
    plant: {
      success: true,
      message: 'Ready to plant new crops. Draw an area on the map to plant.',
      data: { action: 'draw_on_map' }
    },
    harvest: {
      success: selectedCrop !== null && selectedCrop.status === 'ready',
      message: selectedCrop 
        ? selectedCrop.status === 'ready'
          ? `Harvested ${selectedCrop.name}! Yield: ${selectedCrop.yield.toFixed(2)} tons`
          : `${selectedCrop.name} is not ready for harvest (${selectedCrop.growthStage.toFixed(1)}% grown)`
        : 'Please select a crop to harvest first.',
      data: selectedCrop ? {
        crop: selectedCrop.name,
        yield: selectedCrop.yield.toFixed(2),
        status: selectedCrop.status
      } : null
    },
    analyze: {
      success: true,
      message: 'Farm analysis complete. Check crop health and growth progress.',
      data: {
        totalCrops: crops.length,
        readyToHarvest: crops.filter(c => c.status === 'ready').length,
        averageHealth: crops.length > 0 
          ? (crops.reduce((sum, c) => sum + c.health, 0) / crops.length).toFixed(1)
          : 0,
        totalArea: (crops.reduce((sum, c) => sum + c.area, 0) / 10000).toFixed(2)
      }
    }
  };

  return actions[action] || { success: false, message: 'Unknown action' };
}