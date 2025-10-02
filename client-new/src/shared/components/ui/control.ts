import { cva, type VariantProps } from "class-variance-authority";

// Shared sizing helper for inputs/selects/triggers to match Button sizes
export const controlVariants = cva("rounded-md text-sm", {
  variants: {
    size: {
      sm: "h-8 px-3",
      md: "h-10 px-4",
      lg: "h-11 px-4",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export type ControlSize = NonNullable<VariantProps<typeof controlVariants>["size"]>;
