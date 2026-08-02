"use client";

import { useState } from "react";

interface ConfiguratorOptionChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ConfiguratorOptionChip({ label, selected = false, onClick, className = "" }: ConfiguratorOptionChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-pill border transition-all duration-200 cursor-pointer select-none ${
        selected
          ? "bg-primary text-white border-primary"
          : "bg-surface-pearl text-ink border-hairline hover:border-ink-muted-48"
      } ${className}`}
    >
      {label}
    </button>
  );
}