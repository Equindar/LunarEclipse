import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
declare const buttonVariants: (
  props?: {
    variant?: 'default' | 'outline' | 'link' | 'destructive' | 'secondary' | 'ghost';
    size?: 'default' | 'icon' | 'sm' | 'lg';
  } & import('class-variance-authority/dist/types').ClassProp,
) => string;
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;
export { Button, buttonVariants };
