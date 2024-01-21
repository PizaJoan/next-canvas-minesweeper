import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  customClassNames?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  customClassNames = "",
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        "mb-2 me-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
        customClassNames,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
