"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect and process your personal data (name, email, date of birth, gender) solely
            to provide and improve the service. Your data is never sold to third parties.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may request deletion of your account and associated data at any time from your
            account settings.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By registering you confirm you are at least 13 years of age and consent to these terms.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-primary hover:bg-primary/90">
          Close
        </Button>
      </div>
    </div>
  );
}
