import { useEffect } from "react";
import { initializeZodErrorMap } from "@/lib/zod/zodErrorMap";

/**
 * Custom hook to initialize the Zod error map.
 *
 * This hook ensures that the Zod error map is initialized once during the
 * lifecycle of the component using it. The `initializeZodErrorMap` function
 * should configure custom error messages or mappings for Zod validation errors.
 *
 * @example
 * // Use this hook in a component to initialize the Zod error map
 * const MyComponent = () => {
 *   useZodErrorMap();
 *   return <div>My Component</div>;
 * };
 */
export const useZodErrorMap = () => {
  useEffect(() => {
    // Initialize the Zod error map
    initializeZodErrorMap();
  }, []);
};
