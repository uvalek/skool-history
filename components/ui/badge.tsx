import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "bg-ds-surface-container-highest text-ds-on-surface-variant",
        outline: "ring-1 ring-ds-on-surface-variant/20 text-ds-on-surface-variant",
        accent: "bg-ds-secondary-container text-ds-on-secondary-container",
        alerta: "bg-ds-tertiary-container text-ds-on-tertiary-container",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
