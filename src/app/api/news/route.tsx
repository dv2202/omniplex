import { NextRequest, NextResponse } from "next/server";




const API_URL =
  "https://real-time-news-data.p.rapidapi.com/topic-news-by-section?topic=TECHNOLOGY&section=CAQiW0NCQVNQZ29JTDIwdk1EZGpNWFlTQW1WdUdnSlZVeUlQQ0FRYUN3b0pMMjB2TURKdFpqRnVLaGtLRndvVFIwRkVSMFZVWDFORlExUkpUMDVmVGtGTlJTQUJLQUEqKggAKiYICiIgQ0JBU0Vnb0lMMjB2TURkak1YWVNBbVZ1R2dKVlV5Z0FQAVAB&limit=500&country=US&lang=en";

const API_OPTIONS = {
  method: "GET",
  headers: {
    'x-rapidapi-key': 'd46ee30da7mshf8eb702c9b10e8cp1ce6dejsnfed979b4f72b',
    'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
    }
};

export async function GET() {
  try {
    const response = await fetch(API_URL, API_OPTIONS);

    if (!response.ok) {
      throw new Error(`Failed to fetch news. Status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    return NextResponse.json(
      { error: "Unable to fetch news data" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

