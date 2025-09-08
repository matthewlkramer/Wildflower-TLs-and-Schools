import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  onConfirm: (value: string) => void;
}

export function PromptModal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  placeholder, 
  defaultValue = "", 
  multiline = false,
  onConfirm 
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
    }
  }, [open, defaultValue]);

  const handleConfirm = () => {
    onConfirm(value.trim());
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="input" className="sr-only">
              Input
            </Label>
            <InputComponent
              id="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !multiline) {
                  e.preventDefault();
                  handleConfirm();
                } else if (e.key === "Enter" && e.metaKey && multiline) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              rows={multiline ? 4 : undefined}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}