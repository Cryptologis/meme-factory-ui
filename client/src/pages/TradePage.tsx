import TradingPanel from "@/components/TradingPanel";
import TransactionHistory from "@/components/TransactionHistory";

export default function TradePage() {
  const mockTransactions = [
    {
      id: "1",
      type: "buy" as const,
      tokenSymbol: "DOGE",
      amount: 1000,
      price: 0.000123,
      status: "success" as const,
      timestamp: new Date().toISOString(),
      signature: "5j7K8mN9pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA",
    },
    {
      id: "2",
      type: "sell" as const,
      tokenSymbol: "PEPE",
      amount: 500,
      price: 0.000089,
      status: "pending" as const,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      signature: "7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA5j7K8mN9pQ2rS3tU4vW5xY6z",
    },
    {
      id: "3",
      type: "create" as const,
      tokenSymbol: "MOON",
      amount: 1000000,
      price: 0.001,
      status: "success" as const,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      signature: "9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA5j7K8mN9pQ2rS3tU4vW5xY6z7bC8dE",
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Trade Tokens</h1>
          <p className="text-muted-foreground text-lg">
            Buy and sell tokens instantly on Solana devnet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TradingPanel
            userBalance={1500}
            onTrade={(type, amount) => {
              console.log(`${type} ${amount} tokens`);
              alert(`${type} order for ${amount} tokens placed!`);
            }}
          />
          <TransactionHistory transactions={mockTransactions} />
        </div>
      </div>
    </div>
  );
}
