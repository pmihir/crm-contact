import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
};

export type TagProps = {
  children: string;
  tone?: "blue" | "green" | "gray";
};

export type ButtonVariant = "ghost" | "icon" | "smallAdd";
export type ButtonTone = "default" | "success";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
};

export type SectionCardProps = {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};
