import { ChangeEvent, FormEvent, useState } from "react";

export const useForm = (data: any, callback: () => void) => {
  const [inputs, setInputs] = useState(data);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setInputs((inputs: any) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs,
  };
};
