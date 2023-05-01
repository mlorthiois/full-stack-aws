import { Dispatch, useState } from "react";

import { useOwnedGroup } from "@/lib/customSwr";
import { useForm } from "@/lib/useForm";
import { MainButton } from "@/components/Button";
import { updateFetch } from "@/lib/updateFetch";
import AlertModal from "@/components/AlertModal";
import { ErrorPanel } from "../ErrorPannel";

export const OwnedGroupForm = () => {
  const { ownedGroup, mutate } = useOwnedGroup();
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError]: [string, Dispatch<any>] = useState(null);

  const { inputs, handleInputChange, handleSubmit } = useForm(ownedGroup, () =>
    setShowDialog(true)
  );
  const updateGroup = async () => {
    const response = await updateFetch("/admin/group/", {
      ...inputs,
      hour_limit:
        inputs.hour_limit.length === 8
          ? inputs.hour_limit
          : `${inputs.hour_limit}:00`,
    });
    if (response.detail) {
      return setError("An error has occured");
    }
    mutate({ ...ownedGroup, inputs });
    setShowDialog(false);
  };

  return (
    <>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-10">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="mt-10 sm:mt-0 mb-24">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Group Informations
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Informations and settings about your group.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Group name
                      </label>
                      <input
                        type="text"
                        name="name"
                        maxLength={30}
                        autoComplete="given-name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 placeholder-gray-400 capitalize rounded-md"
                        defaultValue={ownedGroup?.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="number"
                          min="0"
                          step="0.05"
                          name="price"
                          id="price"
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 placeholder-gray-400"
                          defaultValue={ownedGroup?.price}
                          onChange={handleInputChange}
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          €
                        </span>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Max Capacity
                      </label>
                      <input
                        defaultValue={ownedGroup?.capacity}
                        type="number"
                        min="0"
                        name="capacity"
                        id="capacity"
                        autoComplete="family-name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase placeholder-gray-400"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="hour_limit"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hour
                      </label>
                      <input
                        type="time"
                        min="00:00"
                        max="23:59"
                        required
                        defaultValue={ownedGroup?.hour_limit.slice(0, 5)}
                        name="hour_limit"
                        id="hour_limit"
                        autoComplete="family-name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase placeholder-gray-400"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <MainButton type="submit" color="blue-500">
                    Save
                  </MainButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showDialog && (
        <AlertModal
          isOpen={showDialog}
          close={() => setShowDialog(false)}
          action={() => {
            updateGroup();
            setShowDialog(false);
          }}
          label="Save settings"
          description={`Are you sure you want to update your group settings? Updates can take some time to be applied.`}
          color="green"
          svg={
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
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
};
