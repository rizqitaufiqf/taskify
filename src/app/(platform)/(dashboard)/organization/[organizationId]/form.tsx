"use client";

import { createBoard } from "@/actions/create-board";
import { FormButton } from "@/app/(platform)/(dashboard)/organization/[organizationId]/form-button";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";

export const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log("SUCCESS!", data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    void execute({ title });
  };

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput id="title" label="Board title" errors={fieldErrors} />
      </div>
      <FormButton />
    </form>
  );
};
