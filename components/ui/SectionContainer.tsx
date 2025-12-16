import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  backgroundColor?:
    | "light"
    | "dark"
    | "secondary-dark"
    | "surface-dark"
    | "gray";
}

export function SectionContainer({
  children,
  id,
  className = "",
  backgroundColor = "light",
}: SectionContainerProps) {
  const bgStyles = {
    light: "bg-background-light dark:bg-background-dark",
    dark: "bg-background-dark text-white",
    "secondary-dark": "bg-secondary-dark text-white rounded-3xl mx-2 md:mx-4",
    "surface-dark": "bg-surface-dark text-white",
    gray: "bg-gray-50 dark:bg-[#1A1A1A]",
  };

  return (
    <section
      id={id}
      className={`py-24 ${bgStyles[backgroundColor]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
    </section>
  );
}
