import { SecondaryButton } from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import { mutate } from "swr";
import { updateFetch } from "@/lib/updateFetch";
import { ErrorPanel } from "@/components/ErrorPannel";

export default function JoinGroup() {
  const [groupId, setGroupId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const cancelRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => setGroupId(null), [showModal]);

  const joinGroupSubmit = async () => {
    const response = await updateFetch(`/user/join/${groupId}/`, {}, "POST");
    if (response.detail) {
      setError(response.detail);
    }
    mutate("/user/groups");
    setGroupId("");
    setShowModal(false);
  };

  return (
    <>
      <SecondaryButton size="large" onClick={() => setShowModal(true)}>
        Join Group
      </SecondaryButton>
      {showModal && (
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
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-baseline space-x-3">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10 text-blue-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <AlertDialogLabel className="text-2xl leading-6 font-semibold text-gray-900">
                      Join a Group
                    </AlertDialogLabel>
                  </div>
                  <div className="mt-5 text-center text-base sm:text-left">
                    <AlertDialogDescription className="mt-2">
                      <div className="text-gray-600 space-y-4 py-3">
                        <p>To join a group, 3 steps:</p>
                        <ol className="list-decimal ml-4">
                          <li className="ml-5 pl-1 mb-1">
                            Ask its admin for the ID (a number) of the group.
                          </li>
                          <li className="ml-5 pl-1 mb-1">
                            <form>
                              <div className="space-x-3 flex items-baseline space-x-1">
                                <label
                                  className="inline-block"
                                  htmlFor="group_id"
                                >
                                  Enter the Group ID here:
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                  <span className="inline-flex items-center px-1.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                    #
                                  </span>
                                  <input
                                    value={groupId}
                                    onChange={(e) => setGroupId(e.target.value)}
                                    type="text"
                                    name="group_id"
                                    id="group_id"
                                    className="focus:ring-gray-500 focus:border-gray-500 rounded-none rounded-r-md border-gray-300 text-gray-800"
                                  />
                                </div>
                              </div>
                            </form>
                          </li>
                          <li className="ml-5 pl-1 mb-3">
                            Submit your request. Your status will be set to
                            {` "Pending"`}.
                          </li>
                          <li className="ml-5 pl-1">
                            An admin will have to validate your request.
                          </li>
                        </ol>
                      </div>
                      <div></div>
                    </AlertDialogDescription>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={joinGroupSubmit}
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  >
                    Join the Group
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
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
      )}
      {error && (
        <ErrorPanel
          isOpen={error !== null}
          content={error}
          close={() => setError(null)}
        />
      )}
    </>
  );
}
