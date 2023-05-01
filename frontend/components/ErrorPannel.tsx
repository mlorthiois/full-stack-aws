import { useEffect } from "react";
import { Transition } from "@headlessui/react";

interface ErrorPannelProps {
  isOpen: boolean;
  close: () => void;
  content: string;
}

export const ErrorPanel = ({ content, isOpen, close }: ErrorPannelProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, 7000);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <Transition
      show={isOpen}
      enter="transition ease-in-out duration-300 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <div className="z-50 text-white max-w-md px-7 py-5 bg-red-600 absolute bottom-4 right-4 rounded-md text-sm shadow-xl ">
        <p className="capitalize font-bold">{content}</p>{" "}
        <p>
          Please retry later... If the problem persists, please open an issue on
          the{" "}
          <a href="https://github.com/mlorthiois/repo" className="underline">
            GitHub repo
          </a>
          .
        </p>
      </div>
    </Transition>
  );
};
