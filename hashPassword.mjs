/* eslint-disable no-undef */

import bcrypt from "bcrypt";

// ソルトのラウンド数（セキュリティレベルに応じて調整）
const saltRounds = 10;

/**
 * ハッシュ化されたパスワードを生成する関数
 * @param {string} plainPassword - ハッシュ化したいパスワード
 * @returns {Promise<string>} - ハッシュ化されたパスワード
 */
const hashPassword = async (plainPassword) => {
  try {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (_) {
    throw new Error("パスワードのハッシュ化に失敗しました。");
  }
};

// コマンドライン引数からパスワードを取得
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "エラー: ハッシュ化したいパスワードを引数として渡してください。",
  );
  console.error("使用方法: node hashPassword.mjs <password>");
  process.exit(1);
}

const plainPassword = args[0];

// パスワードをハッシュ化して出力
try {
  const hashedPassword = await hashPassword(plainPassword);

  // ハッシュ化されたパスワードを表示
  console.log(`ハッシュ化されたパスワード: ${hashedPassword}`);

  // '$' を '\' でエスケープ
  const escapedHash = hashedPassword.replace(/\$/g, "\\$");

  // エスケープされたハッシュ化パスワードを表示
  console.log(`エスケープされたハッシュ化パスワード: ${escapedHash}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
