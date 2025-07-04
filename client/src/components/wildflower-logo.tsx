import logoImage from "@assets/WF Logo main_1751647532999.jpeg";

interface WildflowerLogoProps {
  className?: string;
}

export function WildflowerLogo({ className = "" }: WildflowerLogoProps) {
  return (
    <img
      src={logoImage}
      alt="Wildflower Schools"
      className={className}
    />
  );
}