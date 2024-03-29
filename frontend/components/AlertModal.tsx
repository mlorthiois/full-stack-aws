import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import { ReactNode, useRef } from "react";
import { Transition } from "@headlessui/react";

interface AlertModalProps {
  isOpen: boolean;
  close: () => void;
  action: () => void;
  label: string;
  description: string;
  color: string;
  svg: ReactNode;
}

export default function AlertModal({
  isOpen,
  close,
  action,
  label,
  description,
  color,
  svg,
}: AlertModalProps) {
  const cancelRef = useRef();

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <AlertDialog
        className="bg-black absolute inset-0 h-screen bg-opacity-20"
        leastDestructiveRef={cancelRef}
      >
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${color}-100 sm:mx-0 sm:h-10 sm:w-10 text-${color}-600`}
                  >
                    {svg}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <AlertDialogLabel className="text-lg leading-6 font-medium text-gray-900">
                      {label}
                    </AlertDialogLabel>
                    <AlertDialogDescription className="mt-2 text-sm text-gray-500">
                      {description}
                    </AlertDialogDescription>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={action}
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-${color}-600 text-base font-medium text-white hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {label}
                </button>
                <button
                  onClick={close}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlertDialog>
    </Transition>
  );
}
