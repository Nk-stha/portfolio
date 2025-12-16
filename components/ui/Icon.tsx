import React from "react";

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, className = "", style }: IconProps) {
  return <span className={`material-icons ${className}`} style={style}>{name}</span>;
}
