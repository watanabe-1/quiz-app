"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { useData } from "@/hooks/useData";
import { client } from "@/lib/client";

const useQualifications = () => {
  const rpc = client.api.questions;

  return useData(() => rpc.$get(), rpc.$url().path);
};

const useGrades = (qualification: string) => {
  const rpc = client.api.questions._qualification(qualification);

  return useData(() => rpc.$get(), rpc.$url().path);
};

const useYears = (qualification: string, grade: string) => {
  const rpc = client.api.questions._qualification(qualification)._grade(grade);

  return useData(() => rpc.$get(), rpc.$url().path);
};

const ExportPage = () => {
  const [selectedQualification, setSelectedQualification] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // 資格一覧を取得
  const { data: qualifications, error: qualificationsError } =
    useQualifications();

  // 選択された資格の級一覧を取得
  const { data: grades, error: gradesError } = useGrades(selectedQualification);

  // 選択された資格と級の年度一覧を取得
  const { data: years, error: yearsError } = useYears(
    selectedQualification,
    selectedGrade,
  );

  const handleDownload = async () => {
    try {
      const response = await client.api.admin.exportQuestions.$get({
        query: {
          qualification: selectedQualification,
          grade: selectedGrade,
          year: selectedYear,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const fileName = selectedYear
        ? `${selectedQualification}_${selectedGrade}_${selectedYear}.zip`
        : `${selectedQualification}_${selectedGrade}.zip`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  if (qualificationsError)
    return <ErrorState msg="Error loading qualifications." />;
  if (!qualifications) return <LoadingState msg="Loading qualifications..." />;

  return (
    <div>
      <Header title="過去問データのエクスポート" />
      <main className="p-6">
        <Breadcrumb />
        <div>
          <label>
            資格を選択:
            <select
              value={selectedQualification}
              onChange={(e) => {
                setSelectedQualification(e.target.value);
                setSelectedGrade(""); // 資格が変わったら級をリセット
                setSelectedYear(""); // 年度もリセット
              }}
            >
              <option value="">選択してください</option>
              {qualifications.map((q: string) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedQualification && (
          <div>
            {gradesError && <ErrorState msg="Error loading grades." />}
            {!grades && <LoadingState msg="Loading grades..." />}
            {grades && (
              <label>
                級を選択:
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setSelectedYear(""); // 級が変わったら年度をリセット
                  }}
                >
                  <option value="">選択してください</option>
                  {grades.map((g: string) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {selectedQualification && selectedGrade && (
          <div>
            {yearsError && <ErrorState msg="Error loading years." />}
            {!years && <LoadingState msg="Loading years..." />}
            {years && (
              <label>
                年度を選択（オプション）:
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">すべての年度</option>
                  {years.map((y: string) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={!selectedQualification || !selectedGrade}
        >
          ZIPファイルをダウンロード
        </button>
      </main>
    </div>
  );
};

export default ExportPage;
