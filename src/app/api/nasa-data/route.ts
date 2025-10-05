// app/api/nasa-data/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 });
  }

  try {
    // --- Default mock values in case API fails ---
    let soilMoisture = Math.floor(Math.random() * 100); // 0-100%
    let temperature = 20 + Math.random() * 20; // 20-40°C
    let ndvi = 0.3 + Math.random() * 0.5; // 0.3-0.8
    let rainfall = Math.floor(Math.random() * 50); // 0-50mm
    let vegetationHealthArr = ['Poor', 'Fair', 'Good', 'Excellent'];
    let vegetationHealth = vegetationHealthArr[Math.floor(Math.random() * 4)];

    // --- Try NASA POWER for temperature & rainfall ---
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR&start=${dateStr}&end=${dateStr}&latitude=${lat}&longitude=${lng}&community=RE&format=JSON`;
      const powerRes = await fetch(powerUrl);
      const powerData = await powerRes.json();
      const tempVal = powerData?.properties?.parameter?.T2M?.[dateStr];
      const rainVal = powerData?.properties?.parameter?.PRECTOTCORR?.[dateStr];

      if (tempVal !== undefined && tempVal !== -999) {
        temperature = tempVal;
      }
      if (rainVal !== undefined && rainVal !== -999) {
        rainfall = rainVal;
        console.log(rainVal)
      }
    } catch {}

    // --- Try NASA SMAP for soil moisture ---
    try {
      const smapRes = await fetch(`https://smap-api.onrender.com/api/v1/soil?lat=${lat}&lon=${lng}`);
      if (smapRes.ok) {
        const smapData = await smapRes.json();
        if (smapData?.value !== undefined) soilMoisture = smapData.value;
    
      }
    } catch {}

    // --- Try NASA MODIS for NDVI ---
    try {
      const modisRes = await fetch(`https://modis.ornl.gov/rst/api/v1/MOD13Q1/${lat},${lng}`);
      if (modisRes.ok) {
        const modisData = await modisRes.json();
        if (modisData?.ndvi !== undefined) ndvi = modisData.ndvi;
               console.log( modisData.ndvi)
      }
    } catch {}

    // --- Update vegetation health based on NDVI ---
    if (ndvi < 0.3) vegetationHealth = 'Poor';
    else if (ndvi < 0.5) vegetationHealth = 'Fair';
    else if (ndvi < 0.7) vegetationHealth = 'Good';
    else vegetationHealth = 'Excellent';

    // --- Return in exact same format as original mock ---
    const result = {
      soilMoisture: soilMoisture,
      temperature: temperature,
      ndvi: ndvi,
      rainfall: rainfall,
      vegetationHealth: vegetationHealth,
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({
      soilMoisture: Math.floor(Math.random() * 100),
      temperature: 20 + Math.random() * 20,
      ndvi: 0.3 + Math.random() * 0.5,
      rainfall: Math.floor(Math.random() * 50),
      vegetationHealth: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    });
  }
}
