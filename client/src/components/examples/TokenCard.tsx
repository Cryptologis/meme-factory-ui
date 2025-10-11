import TokenCard from "../TokenCard";

export default function TokenCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <TokenCard
        symbol="DOGE"
        name="Doge Coin"
        price={0.000123}
        change24h={15.42}
        liquidity={125000}
        marketCap={580000}
      />
    </div>
  );
}
