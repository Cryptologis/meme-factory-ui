import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";
import { Card } from "@/components/ui/card";

interface PriceChartProps {
  tokenData: {
    virtualSolReserves: any;
    virtualTokenReserves: any;
    totalSupply: any;
    name: string;
    symbol: string;
  };
}

export default function PriceChart({ tokenData }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
        horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Create area series for bonding curve
    const areaSeries = chart.addAreaSeries({
      lineColor: '#10b981',
      topColor: 'rgba(16, 185, 129, 0.4)',
      bottomColor: 'rgba(16, 185, 129, 0.0)',
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    // Generate bonding curve data
    const currentTime = Math.floor(Date.now() / 1000);
    const data = generateBondingCurveData(tokenData, currentTime);
    areaSeries.setData(data);

    // Fit content to chart
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [tokenData]);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">Bonding Curve Price</h3>
        <p className="text-sm text-muted-foreground">
          {tokenData.name} ({tokenData.symbol}) - Simulated Price Movement
        </p>
      </div>
      <div ref={chartContainerRef} className="w-full" />
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Current Price</p>
          <p className="font-mono font-semibold">
            {calculatePrice(tokenData).toFixed(9)} SOL
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">SOL Reserves</p>
          <p className="font-mono font-semibold">
            {(Number(tokenData.virtualSolReserves.toString()) / 1e9).toFixed(2)} SOL
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Token Reserves</p>
          <p className="font-mono font-semibold">
            {(Number(tokenData.virtualTokenReserves.toString()) / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>
    </Card>
  );
}

// Helper function to calculate current price
function calculatePrice(tokenData: any): number {
  const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
  const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
  return solReserves / tokenReserves;
}

// Generate simulated bonding curve data
function generateBondingCurveData(tokenData: any, currentTime: number) {
  const currentPrice = calculatePrice(tokenData);
  const solReserves = Number(tokenData.virtualSolReserves.toString()) / 1e9;
  const tokenReserves = Number(tokenData.virtualTokenReserves.toString()) / 1e6;
  const k = solReserves * tokenReserves; // Constant product

  // Generate 100 data points showing the bonding curve progression
  const numPoints = 100;
  const data = [];

  // Calculate price at different points of token supply depletion
  for (let i = 0; i < numPoints; i++) {
    // Simulate selling tokens back into the pool (going back in time)
    const progress = i / numPoints;
    const simulatedTokenReserves = tokenReserves + (tokenReserves * progress * 2);
    const simulatedSolReserves = k / simulatedTokenReserves;
    const price = simulatedSolReserves / simulatedTokenReserves;

    // Create timestamps going backwards from current time
    const timestamp = currentTime - (numPoints - i) * 3600; // 1 hour intervals

    data.push({
      time: timestamp,
      value: price,
    });
  }

  return data;
}
