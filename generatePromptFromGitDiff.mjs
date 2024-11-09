/* eslint-disable no-undef */
import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MAX_CONSOLE_LINES = 10;
const __dirname = dirname(fileURLToPath(import.meta.url));

// 差分を取得してプロンプトを生成する関数
async function generatePromptFromGitDiff() {
  try {
    // ステージされていない変更とステージされた変更を取得
    const patchContent = await execCommand("git diff && git diff --cached");

    // 未追跡ファイルのリストを取得
    const filesStdout = await execCommand(
      "git ls-files --others --exclude-standard",
    );
    const files = filesStdout.split("\n").filter((file) => file.trim() !== "");

    // 差分と新規ファイルの両方がない場合の処理
    if (!patchContent.trim() && files.length === 0) {
      throw new Error("変更されたファイルや新規ファイルがありません。");
    }

    let fullPatchContent = patchContent;

    // 未追跡ファイルの内容を取得して追加
    if (files.length > 0) {
      fullPatchContent += "\n\n--- 新規ファイルの内容 ---\n";
      for (const file of files) {
        try {
          const fileContent = readFileSync(file, "utf8");
          fullPatchContent += `\nファイル: ${file}\n${fileContent}\n`;
        } catch (readError) {
          console.error(
            `ファイル読み込みエラー: ${file} - ${readError.message}`,
          );
        }
      }
    }

    const prompt = generatePrompt(fullPatchContent);

    // コンソールへの出力（最初の10行のみ）
    console.log("\n--- ChatGPT用プロンプト (一部表示) ---\n");
    const promptLines = prompt.split("\n");
    promptLines
      .slice(0, MAX_CONSOLE_LINES)
      .forEach((line) => console.log(line));
    if (promptLines.length > MAX_CONSOLE_LINES) {
      console.log("... (省略) ...");
    }

    // ファイルへの出力
    const outputPath = join(__dirname, "generated-prompt.txt");
    writeFileSync(outputPath, prompt, "utf8");
    console.log(`\nプロンプトがファイルに出力されました: ${outputPath}`);
  } catch (error) {
    console.error(`エラー: ${error.message}`);
    process.exit(1); // エラー時に終了コード1でプロセスを終了
  }
}

// ChatGPT用のプロンプトを生成する関数（コミットメッセージテンプレート対応）
function generatePrompt(patchContent) {
  return `
以下のコードに変更を加えました。変更内容のdiffは次の通りです：

${patchContent}

上記の変更に基づいて、以下のテンプレートのいずれかに従って、簡潔でわかりやすいコミットメッセージを生成してください。適切なテンプレートを選んでください。

- feat: 新しい機能の追加
- fix: バグ修正
- refactor: コードのリファクタリング
- update: 既存機能の改善や更新
- docs: ドキュメントの変更
- chore: ビルド関連、ツールの設定変更
- test: テストの追加・修正

<type>: <メッセージ>

変更の目的が明確に伝わるメッセージにしてください。
  `.trim();
}

// 非同期でコマンドを実行する関数
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`コマンド実行エラー: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`stderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// 実行
generatePromptFromGitDiff();
