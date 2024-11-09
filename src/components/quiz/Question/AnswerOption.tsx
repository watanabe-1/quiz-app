import Image from "next/image";
import React, { FC } from "react";
import { numberToKatakanaMap } from "@/lib/constants";
import { QuestionOption } from "@/types/quizType";

interface AnswerOptionProps {
  option: QuestionOption;
  index: number;
  isCorrect: boolean;
  isSelected: boolean;
  isAnswered: boolean;
  handleOptionClick: (index: number) => void;
}

const AnswerOption: FC<AnswerOptionProps> = ({
  option,
  index,
  isCorrect,
  isSelected,
  isAnswered,
  handleOptionClick,
}) => {
  const optionClass = isAnswered
    ? isCorrect
      ? "bg-green-200"
      : isSelected
        ? "bg-red-200"
        : ""
    : "hover:bg-gray-100";

  return (
    <li>
      <button
        onClick={() => handleOptionClick(index)}
        className={`w-full cursor-pointer rounded border p-4 text-left ${optionClass}`}
        aria-pressed={isSelected}
      >
        <div>
          {option.text && (
            <span>{`${numberToKatakanaMap.get(index)} ${option.text}`}</span>
          )}
          {option.image && (
            <Image
              src={option.image}
              alt={`選択肢${numberToKatakanaMap.get(index)}の画像`}
              layout="responsive"
              width={300}
              height={200}
              priority
            />
          )}
        </div>
      </button>
    </li>
  );
};

export default AnswerOption;
