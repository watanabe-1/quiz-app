import React from "react";

interface ErrorMessageProps {
  errors?: string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-2 rounded-md border border-red-300 bg-red-100 p-2 text-red-600">
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;
