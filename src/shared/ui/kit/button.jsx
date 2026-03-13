import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/utils';

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
  variants: {
    variant: {
      default: 'bg-[#dd2b1c] text-white shadow-xs hover:bg-[#c1271a] focus-visible:ring-[#dd2b1c]/50',
      destructive: 'bg-[#b22216] text-white shadow-xs hover:bg-[#991c14] focus-visible:ring-[#b22216]/50 dark:bg-[#b22216]/60 dark:focus-visible:ring-[#b22216]/40',
      outline: 'border border-[#dd2b1c] text-[#dd2b1c] bg-white shadow-xs hover:bg-[#dd2b1c]/10 hover:text-[#dd2b1c]',
      secondary: 'bg-[#e2584f] text-white shadow-xs hover:bg-[#dd2b1c]/80',
      ghost: 'text-[#dd2b1c] hover:bg-[#dd2b1c]/10 dark:hover:bg-[#dd2b1c]/20',
      link: 'text-[#dd2b1c] underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2 has-[>svg]:px-3',
      sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
      lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
