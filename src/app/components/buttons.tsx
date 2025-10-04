"use client";
import Link from "next/link";

function cx(...cls: Array<string | undefined | false>) {
  return cls.filter(Boolean).join(" ");
}

type ButtonProps = {
  href?: string;
  className?: string;
  children?: any;
} & any;

export function PrimaryButton({ href, className, children, ...rest }: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-white font-semibold shadow-sm hover-glow transition",
    "bg-[var(--brand-green-500)] hover:bg-[var(--brand-green-400)]",
    className
  );
  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as any)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as any)}>
      {children}
    </button>
  );
}

export function SecondaryButton({ href, className, children, ...rest }: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition",
    "border border-[var(--brand-green-300)] text-[var(--brand-green-500)] bg-white hover-glow",
    className
  );
  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as any)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as any)}>
      {children}
    </button>
  );
}

