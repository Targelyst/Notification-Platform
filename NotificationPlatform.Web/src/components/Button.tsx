import type React from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonType = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType;
}

const Button: React.FC<ButtonProps> = ({
  children,
  buttonType = "primary",
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) => {
  const baseClasses = "m-2 px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2";

  const getButtonTypeClasses = (type: ButtonType) => {
    switch (type) {
      case "primary":
        return "bg-impolar-primary text-white hover:bg-opacity-90 focus:ring-impolar-primary/50";
      case "secondary":
        return "bg-impolar-secondary text-impolar-primary hover:bg-opacity-80 focus:ring-impolar-secondary/50";
      default:
        return "";
    }
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${getButtonTypeClasses(buttonType)}
        ${disabled ? disabledClasses : ""}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;