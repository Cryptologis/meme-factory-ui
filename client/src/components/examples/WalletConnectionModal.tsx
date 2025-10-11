import { useState } from "react";
import WalletConnectionModal from "../WalletConnectionModal";
import { Button } from "@/components/ui/button";

export default function WalletConnectionModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Wallet Modal</Button>
      <WalletConnectionModal
        open={open}
        onClose={() => setOpen(false)}
        onSelectWallet={(wallet) => console.log("Selected:", wallet)}
      />
    </div>
  );
}
