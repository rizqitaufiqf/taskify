import { FormErrors } from "@/components/form/form-errors";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { forwardRef, KeyboardEventHandler } from "react";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      onBlur,
      onClick,
      onKeyDown,
      defaultValue,
    },
    ref,
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {label ?? (
            <Label
              htmlFor={id}
              className="text-sm font-medium text-neutral-600"
            >
              {label}
            </Label>
          )}
          <Textarea
            ref={ref}
            id={id}
            name={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            disabled={pending || disabled}
            onBlur={onBlur}
            onClick={onClick}
            onKeyDown={onKeyDown}
            className={cn(
              "resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className,
            )}
            aria-describedby={`${id}-error`}
          ></Textarea>
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
