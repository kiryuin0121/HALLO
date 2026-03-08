import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locRes = await fetch("https://ipapi.co/json/");
    if (!locRes.ok) throw new Error("Location failed");
    const locData = await locRes.json();

    const city = locData.city;
    if (!city) throw new Error("No city");

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    if (!weatherRes.ok) throw new Error("Weather failed");

    const weatherData = await weatherRes.json();

    return NextResponse.json({
      city,
      icon: weatherData.weather?.[0]?.icon ?? null,
    });
  } catch {
    return NextResponse.json({ city: null, icon: null });
  }
}