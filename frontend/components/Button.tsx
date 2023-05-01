import React from "react";

const smallClass = "py-0.5 px-1.5 text-sm";
const mediumClass = "py-2 px-4";
const largeClass = "py-2.5 px-8";

const commonClass =
  "border font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
  color?: string;
}

export function MainButton({
  size = "medium",
  color = "black",
  ...props
}: ButtonProps) {
  var sizeClass = "";

  switch (size) {
    case "small": {
      sizeClass = smallClass;
      break;
    }
    case "medium": {
      sizeClass = mediumClass;
      break;
    }
    case "large": {
      sizeClass = largeClass;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <button
      className={`${sizeClass} ${commonClass} bg-${color} text-sm  hover:bg-white hover:text-${color} border-transparent hover:border-${color} text-white focus:ring-${color}`}
      {...props}
    />
  );
}

export function SecondaryButton({ size = "medium", ...props }: ButtonProps) {
  var sizeClass = "";

  switch (size) {
    case "small": {
      sizeClass = smallClass;
      break;
    }
    case "medium": {
      sizeClass = mediumClass;
      break;
    }
    case "large": {
      sizeClass = largeClass;
      break;
    }
    default: {
      break;
    }
  }

  return (
    <button
      className={`${sizeClass} ${commonClass} ${
        props.disabled
          ? "bg-gray-50 cursor-not-allowed border-gray-200 text-gray-400"
          : "hover:border-black hover:text-black border-gray-200 text-gray-500 focus:ring-black"
      }`}
      {...props}
    />
  );
}
