import { ReactNode } from "react";
import { cn } from "./utils";

interface HoverButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function HoverButton({ 
  children, 
  className,
  onClick 
}: HoverButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-6 text-yellow-400/60 font-sofia tracking-widest overflow-hidden transition-all duration-500",
        " border border-yellow-400/40 hover:text-white",
        "group",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-yellow-400/40 
                  transform -translate-x-full group-hover:translate-x-0 
                  transition-transform duration-500 ease-in-out"
      />
    </button>
  );
}
export function HoverButton2({ 
    children, 
    className,
    onClick 
  }: HoverButtonProps) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative px-8 py-6 text-white font-sofia tracking-widest overflow-hidden transition-all duration-500",
          "bg-yellow-600/40 border border-yellow-400/40  hover:bg-transparent hover:border hover:border-yellow-400/40  ", 
          "group",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 bg-yellow-400/20 transform translate-x-0 group-hover:-translate-x-full transition-transform duration-500 ease-in-out"
        />
      </button>
    );
  }
  export function HoverButton3({ 
    children, 
    className,
    onClick 
  }: HoverButtonProps) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative px-8 py-2 text-white font-sofia tracking-widest overflow-hidden transition-all duration-500",
          "bg-yellow-600/30 border border-yellow-400/30  hover:bg-transparent hover:border hover:border-yellow-400/30 ", 
          "group",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 bg-yellow-400/20 transform translate-x-0 group-hover:-translate-x-full transition-transform duration-500 ease-in-out"
        />
      </button>
    );
  }
  export function HoverButton4({ 
    children, 
    className,
    onClick 
  }: HoverButtonProps) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative px-8 py-6 text-white font-sofia tracking-widest overflow-hidden transition-all duration-500",
          "bg-navy-blue-5/70 border border-navy-blue-5/60  hover:bg-transparent hover:border hover:border-navy-blue-5/60 hover:text-navy-blue-5/80 ", 
          "group",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 bg-navy-blue-5/20 transform translate-x-0 group-hover:-translate-x-full transition-transform duration-500 ease-in-out"
        />
      </button>
    );
  }  
  export function HoverButton5({ 
    children, 
    className,
    onClick 
  }: HoverButtonProps) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative px-8 py-6 text-navy-blue-5/60 font-sofia tracking-widest overflow-hidden transition-all duration-500",
          " border border-navy-blue-5/40 hover:text-white",
          "group",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        <span 
          className="absolute inset-0 bg-navy-blue-5/80
                    transform -translate-x-full group-hover:translate-x-0 
                    transition-transform duration-500 ease-in-out"
        />
      </button>
    );
  }
