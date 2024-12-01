"use client";

import React, { Suspense } from "react";
import LoadingState from "@/components/ui/LoadingState";
import LogInForm from "@/features/auth/login/components/LogInForm";

const LogInPage = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <LogInForm />
    </Suspense>
  );
};

export default LogInPage;
