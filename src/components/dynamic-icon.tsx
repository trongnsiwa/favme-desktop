import * as Icons from "react-icons/fa";

type DynamicFaIconProps = {
  name: keyof typeof Icons;
  color: string;
  size?: number;
  className?: string;
};

export const DynamicFaIcon = ({ name, color, size, className }: DynamicFaIconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Return a default one
    return <Icons.FaStar />;
  }

  return <IconComponent color={color} size={size} className={className} />;
};
