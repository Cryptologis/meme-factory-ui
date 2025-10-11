import TransactionHistory from "../TransactionHistory";

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

export default function TransactionHistoryExample() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <TransactionHistory transactions={mockTransactions} />
    </div>
  );
}
