import logo from "@/assets/shub-life-logo.png.asset.json";

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = "h-12 w-auto", alt = "SHUB LIFE" }: LogoProps) {
  return <img src={logo.url} alt={alt} className={className} loading="eager" decoding="async" />;
}
