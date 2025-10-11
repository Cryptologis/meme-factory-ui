import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WalletConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectWallet: (wallet: string) => void;
}

export default function WalletConnectionModal({
  open,
  onClose,
  onSelectWallet,
}: WalletConnectionModalProps) {
  const wallets = [
    {
      name: "Phantom",
      icon: "👻",
      description: "The friendly Solana wallet",
    },
    {
      name: "Solflare",
      icon: "☀️",
      description: "Secure Solana wallet",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-testid="modal-wallet-connection">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Meme Factory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4 hover-elevate"
              onClick={() => {
                onSelectWallet(wallet.name);
                onClose();
              }}
              data-testid={`button-wallet-${wallet.name.toLowerCase()}`}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{wallet.name}</div>
                <div className="text-sm text-muted-foreground">
                  {wallet.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
