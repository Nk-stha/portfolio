import React from "react";

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number; // Size in pixels
}

export function Icon({ name, className = "", style, size }: IconProps) {
  const sizeStyle = size ? { fontSize: size, width: size, height: size } : {};
  return (
    <span 
      className={`material-icons ${className}`} 
      style={{ ...sizeStyle, ...style }}
    >
      {name}
    </span>
  );
}
