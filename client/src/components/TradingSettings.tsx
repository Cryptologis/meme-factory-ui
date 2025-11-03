import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TradingSettingsProps {
  slippageTolerance: number;
  onSlippageChange: (value: number) => void;
  priorityFee?: number;
  onPriorityFeeChange?: (value: number) => void;
}

export default function TradingSettings({
  slippageTolerance,
  onSlippageChange,
  priorityFee = 0,
  onPriorityFeeChange,
}: TradingSettingsProps) {
  const [open, setOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState(slippageTolerance.toString());
  const [customPriorityFee, setCustomPriorityFee] = useState(priorityFee.toString());

  const presetSlippages = [0.1, 0.5, 1.0, 3.0];

  const handleSlippageChange = (value: number) => {
    if (value < 0 || value > 50) {
      toast({
        title: "Invalid Slippage",
        description: "Slippage must be between 0% and 50%",
        variant: "destructive",
      });
      return;
    }
    onSlippageChange(value);
    setCustomSlippage(value.toString());
  };

  const handlePriorityFeeChange = (value: number) => {
    if (value < 0) {
      toast({
        title: "Invalid Priority Fee",
        description: "Priority fee must be a positive number",
        variant: "destructive",
      });
      return;
    }
    if (onPriorityFeeChange) {
      onPriorityFeeChange(value);
    }
    setCustomPriorityFee(value.toString());
  };

  const handleSave = () => {
    const slippage = parseFloat(customSlippage);
    const fee = parseFloat(customPriorityFee);

    if (!isNaN(slippage)) {
      handleSlippageChange(slippage);
    }

    if (!isNaN(fee) && onPriorityFeeChange) {
      handlePriorityFeeChange(fee);
    }

    toast({
      title: "Settings Saved",
      description: "Your trading settings have been updated",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trading Settings</DialogTitle>
          <DialogDescription>
            Configure your trading preferences and risk parameters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Slippage Tolerance */}
          <div className="space-y-3">
            <Label>Slippage Tolerance</Label>
            <p className="text-sm text-muted-foreground">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>

            {/* Preset Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {presetSlippages.map((preset) => (
                <Button
                  key={preset}
                  variant={slippageTolerance === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSlippageChange(preset)}
                  className="h-9"
                >
                  {preset}%
                </Button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => setCustomSlippage(e.target.value)}
                className="flex-1"
                step="0.1"
                min="0"
                max="50"
              />
              <span className="text-muted-foreground">%</span>
            </div>

            {slippageTolerance > 5 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ High slippage tolerance may result in unfavorable trades
                </p>
              </div>
            )}
          </div>

          {/* Priority Fee (Optional) */}
          {onPriorityFeeChange && (
            <div className="space-y-3">
              <Label>Priority Fee (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Add a priority fee to speed up transaction processing (in microlamports).
              </p>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={customPriorityFee}
                  onChange={(e) => setCustomPriorityFee(e.target.value)}
                  className="flex-1"
                  step="1000"
                  min="0"
                />
                <span className="text-muted-foreground text-sm">μLamports</span>
              </div>
            </div>
          )}

          {/* Transaction Deadline */}
          <div className="space-y-3">
            <Label>Transaction Deadline</Label>
            <p className="text-sm text-muted-foreground">
              Transactions will be confirmed within the standard timeout period.
            </p>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm">60 seconds (default)</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
