import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  customClassNames?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  customClassNames = '',
  ...rest
}) => {
  return (
    <button
      className={twMerge(
        'mb-2 me-2 rounded-lg border  border-gray-600 bg-gray-800 px-5 py-2.5  text-sm font-medium  text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700',
        customClassNames,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
