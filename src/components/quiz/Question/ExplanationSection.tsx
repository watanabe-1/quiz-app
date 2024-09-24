import React, { forwardRef } from "react";
import Image from "next/image";
import { numberToKatakanaMap } from "@/lib/constants";
import { QuestionData } from "@/@types/quizType";

interface ExplanationSectionProps {
  question: QuestionData;
}

const ExplanationSection = forwardRef<HTMLDivElement, ExplanationSectionProps>(
  ({ question }, ref) => {
    return (
      <div ref={ref} className="mt-6 p-4 border-t">
        {/* 正答の表示 */}
        <div className="mt-4">
          <strong>答え:</strong>{" "}
          {`${numberToKatakanaMap.get(question.answer)} ${
            question.options[question.answer].text
          }`}
        </div>
        {/* 問題の解説 */}
        {question.explanation && (
          <>
            <h3 className="text-lg font-semibold mb-2 mt-4">問題の解説</h3>
            {question.explanation.text && (
              <div className="mb-2">
                <strong>説明:</strong> {question.explanation.text}
              </div>
            )}
            {question.explanation.image && (
              <Image
                src={question.explanation.image}
                alt={`問題の解説画像`}
                className="mt-2"
                width={600}
                height={400}
                priority
              />
            )}
          </>
        )}

        {/* 選択肢の解説 */}
        {question.options.some(
          (option) => option.explanation?.text || option.explanation?.image
        ) && <h3 className="text-lg font-semibold mb-2 mt-4">選択肢の解説</h3>}
        {question.options.map((option, index) =>
          option.explanation ? (
            <div key={index} className="mb-4">
              <strong>選択肢 {numberToKatakanaMap.get(index)}:</strong>
              {option.explanation.text && (
                <div className="mt-2">
                  <strong>説明:</strong> {option.explanation.text}
                </div>
              )}
              {option.explanation.image && (
                <Image
                  src={option.explanation.image}
                  alt={`選択肢${numberToKatakanaMap.get(index)}の解説画像`}
                  className="mt-2"
                  width={600}
                  height={400}
                  priority
                />
              )}
            </div>
          ) : null
        )}
      </div>
    );
  }
);

ExplanationSection.displayName = "ExplanationSection";
export default ExplanationSection;
