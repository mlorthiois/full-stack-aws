import { useForm } from "@/lib/useForm";
import { useAuth } from "@/lib/auth";
import { MainButton } from "../Button";
import { updateFetch } from "@/lib/updateFetch";
import AlertModal from "@/components/AlertModal";
import { Dispatch, useState } from "react";
import { ErrorPanel } from "../ErrorPannel";

export const ProfileForm = () => {
  const { user, signOut } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError]: [string, Dispatch<any>] = useState(null);

  const { inputs, handleInputChange, handleSubmit } = useForm(user, () =>
    setShowDialog(true)
  );

  const updateProfile = async () => {
    const response = await updateFetch("/user/", inputs);
    if (response.detail) {
      return setError("An error has occured");
    }
    localStorage.removeItem("access_token");
Out();
      
      
  return (

ection className="mt-14">
<div className="md:grid md:grid-cols-3 md:gap-6">
<div className="md:col-span-1">
        <div classNam e ="px-4 sm:px-0" > 

              <h3 className="text-lg font-medium leading-6 text-gray-900">
        Profi le
        </h3>
        <p className="mt-1 text-sm text-gray-600">
                T h is informations will be displayed to you and your group
      owners.    
      </p>
       </div>   
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-6 gap-6 mb-2">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        value={inputs?.first_name}
                        type="text"
                        name="first_name"
                        id="first_name"
                        autoComplete="given-name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md capitalize placeholder-gray-400"
                        onChange={handleInputChange}
                        required={true}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        value={inputs?.last_name}
                        type="text"
                        name="last_name"
                        id="last_name"
                        autoComplete="family-name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase placeholder-gray-400"
                        onChange={handleInputChange}
              required={true}
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="image_url"
                        className="block text-sm font-medium text-gray-700"
                      >
                  e url{" "}
                        <span className="text-gray-500">(optional)</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="image_url"
                          id="image_url"
                          className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 placeholder-gray-400"
                        nputs?.image_url}
                          onChange={handleInputChange}
                          required={false}
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
      </section>
      {showDialog && (
                  
          isOpen={showDialog}
          close={() => setShowDialog(false)}
          action={() => {
                  
            setShowDialog(false);
          }}
          label="Update your profile"
          description={`Are you sure you want to update your profile? You will be logged out and will need to log in again.`}
          color="yellow"
          svg={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
          
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          
        />
      )}

      {error && ( 
        <ErrorP anel
          isOpen={err or !== null}
          content={error}
 
     close={() => setError(null)}
    />
      
      
      
    
  
