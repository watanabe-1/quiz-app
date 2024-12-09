import React from "react";
import { tv } from "tailwind-variants";
import LoadingState from "@/components/ui/LoadingState";

interface SubmitButtonProps {
  loading: boolean;
  text: string;
  fullWidth?: boolean;
}

const buttonClass = tv({
  base: "rounded bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50",
  variants: {
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  text,
  fullWidth = false,
}) => {
  return (
    <button
      type="submit"
      className={buttonClass({ fullWidth })}
      disabled={loading}
      aria-busy={loading}
      aria-label={loading ? "Submitting..." : text}
      data-testid="submit-button"
    >
      {loading ? <LoadingState msg={`${text}中...`} /> : text}
    </button>
  );
};

export default SubmitButton;
