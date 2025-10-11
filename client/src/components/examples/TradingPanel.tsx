import TradingPanel from "../TradingPanel";

export default function TradingPanelExample() {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <TradingPanel userBalance={1500} />
    </div>
  );
}
