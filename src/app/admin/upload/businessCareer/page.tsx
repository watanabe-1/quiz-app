import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BusinessCareerAnsForm from "@/features/quiz/upload/pdf/businessCareer/components/BusinessCareerAnsForm";
import BusinessCareerForm from "@/features/quiz/upload/pdf/businessCareer/components/BusinessCareerForm";

const BccExamUploadPage = () => {
  return (
    <div>
      <Header title="PDFから問題データを抽出" />
      <main className="p-6">
        <Breadcrumb />
        <div className="p-8">
          <h1 className="mb-4 text-2xl">PDFから問題データを抽出</h1>
          <BusinessCareerForm />
        </div>
        <div className="p-8">
          <h1 className="mb-4 text-2xl">PDFから解答データを抽出</h1>
          <BusinessCareerAnsForm />
        </div>
      </main>
    </div>
  );
};

export default BccExamUploadPage;
