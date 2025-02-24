import Image from "next/image";
import React, { FC } from "react";
import { tv } from "tailwind-variants";
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

const optionClass = tv({
  base: "w-full cursor-pointer rounded-sm border p-4 text-left", // 共通部分
  variants: {
    isAnswered: {
      true: "",
      false: "hover:bg-gray-100",
    },
    isCorrect: {
      true: "",
      false: "",
    },
    isSelected: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      isAnswered: true,
      isCorrect: true,
      class: "bg-green-200", // 回答済みかつ正解
    },
    {
      isAnswered: true,
      isCorrect: false,
      isSelected: true,
      class: "bg-red-200", // 回答済みかつ不正解かつ選択済み
    },
  ],
  defaultVariants: {
    isAnswered: false,
    isCorrect: false,
    isSelected: false,
  },
});

const AnswerOption: FC<AnswerOptionProps> = ({
  option,
  index,
  isCorrect,
  isSelected,
  isAnswered,
  handleOptionClick,
}) => {
  return (
    <li>
      <button
        onClick={() => handleOptionClick(index)}
        className={optionClass({ isAnswered, isCorrect, isSelected })}
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
