import { ExternalLink, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "create";
  tokenSymbol: string;
  amount: number;
  price: number;
  status: "pending" | "success" | "failed";
  timestamp: string;
  signature: string;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

export default function TransactionHistory({
  transactions = [],
}: TransactionHistoryProps) {
  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-chart-5" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-chart-3" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "success":
        return <Badge className="bg-chart-3">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card
              key={tx.id}
              className="p-4 hover-elevate"
              data-testid={`transaction-${tx.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {tx.type === "buy" ? (
                      <ArrowDownRight className="w-5 h-5 text-chart-3" />
                    ) : tx.type === "sell" ? (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-white">+</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold capitalize">
                        {tx.type} {tx.tokenSymbol}
                      </span>
                      {getStatusBadge(tx.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{tx.amount.toLocaleString()} tokens</span>
                      <span>@${tx.price.toFixed(6)}</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs text-primary hover:underline mt-1 font-mono"
                      onClick={() =>
                        window.open(
                          `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`,
                          "_blank"
                        )
                      }
                      data-testid={`link-explorer-${tx.id}`}
                    >
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono font-semibold whitespace-nowrap">
                    {(tx.amount * tx.price).toFixed(4)} SOL
                  </span>
                  {getStatusIcon(tx.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
