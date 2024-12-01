import { ZodErrorMap, ZodIssueCode, ZodParsedType, util, z } from "zod";

const errorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "必須項目です";
      } else {
        message = `期待される値: ${issue.expected}、受け取った値: ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `無効な値です。期待される値: ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer,
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `認識されないキーが含まれています: ${util.joinValues(
        issue.keys,
        ", ",
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `無効な入力値です`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `無効な判別値です。期待される値: ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `無効な列挙型の値です。期待される値: ${util.joinValues(
        issue.options,
      )}、受け取った値: '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `無効な関数の引数です`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `無効な関数の戻り値です`;
      break;
    case ZodIssueCode.invalid_date:
      message = `無効な日付です`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `"${issue.validation.includes}" を含む必要があります`;

          if (typeof issue.validation.position === "number") {
            message += ` (位置: ${issue.validation.position}以降)`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `"${issue.validation.startsWith}" で始まる必要があります`;
        } else if ("endsWith" in issue.validation) {
          message = `"${issue.validation.endsWith}" で終わる必要があります`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `無効な${issue.validation}形式です`;
      } else {
        message = "無効な文字列です";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `配列には${
          issue.exact ? "ちょうど" : issue.inclusive ? "少なくとも" : "より多く"
        }${issue.minimum}個の要素が必要です`;
      else if (issue.type === "string")
        message = `文字列には${
          issue.exact ? "ちょうど" : issue.inclusive ? "少なくとも" : "より多く"
        }${issue.minimum}文字が必要です`;
      else if (issue.type === "number")
        message = `数値は${
          issue.exact ? "ちょうど" : issue.inclusive ? "以上" : "より大きい"
        }${issue.minimum}でなければなりません`;
      else if (issue.type === "date")
        message = `日付は${
          issue.exact ? "ちょうど" : issue.inclusive ? "以上" : "より後"
        }${new Date(Number(issue.minimum))}でなければなりません`;
      else message = "無効な入力です";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `配列には${
          issue.exact ? "ちょうど" : issue.inclusive ? "以下" : "未満"
        }${issue.maximum}個の要素までしか含められません`;
      else if (issue.type === "string")
        message = `文字列には${
          issue.exact ? "ちょうど" : issue.inclusive ? "以下" : "未満"
        }${issue.maximum}文字までしか含められません`;
      else if (issue.type === "number")
        message = `数値は${
          issue.exact ? "ちょうど" : issue.inclusive ? "以下" : "未満"
        }${issue.maximum}でなければなりません`;
      else if (issue.type === "bigint")
        message = `BigIntは${
          issue.exact ? "ちょうど" : issue.inclusive ? "以下" : "未満"
        }${issue.maximum}でなければなりません`;
      else if (issue.type === "date")
        message = `日付は${
          issue.exact ? "ちょうど" : issue.inclusive ? "以前" : "より前"
        }${new Date(Number(issue.maximum))}でなければなりません`;
      else message = "無効な入力です";
      break;
    case ZodIssueCode.custom:
      message = `無効な入力です`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `型をマージできませんでした`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `数値は${issue.multipleOf}の倍数でなければなりません`;
      break;
    case ZodIssueCode.not_finite:
      message = "数値は有限でなければなりません";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

// エラーマップの設定
export const initializeZodErrorMap = () => {
  z.setErrorMap(errorMap);
};
