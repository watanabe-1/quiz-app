"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UploadQuizForm from "@/features/quiz/upload/json/components/UploadQuizForm";

const UploadPage = () => {
  return (
    <div>
      <Header title="過去問データのアップロード3" />
      <main className="p-6">
        <Breadcrumb />
        <div className="min-h-screen bg-gray-100 p-6">
          <UploadQuizForm />
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
