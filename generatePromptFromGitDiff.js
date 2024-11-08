const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const MAX_CONSOLE_LINES = 10;

// 差分を取得してプロンプトを生成する関数
function generatePromptFromGitDiff() {
  // ステージされていない変更とステージされた変更を取得
  exec("git diff && git diff --cached", (error, stdout, stderr) => {
    if (error) {
      console.error(`git diff 実行エラー: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    let patchContent = stdout;

    // 差分がない場合の処理
    if (!patchContent.trim()) {
      console.log(
        "差分がありません。コミットメッセージを生成する必要がありません。",
      );
      return;
    }

    // 未追跡ファイルのリストを取得
    exec(
      "git ls-files --others --exclude-standard",
      (err, filesStdout, filesStderr) => {
        if (err) {
          console.error(`未追跡ファイル取得エラー: ${err.message}`);
          return;
        }
        if (filesStderr) {
          console.error(`stderr: ${filesStderr}`);
          return;
        }

        const files = filesStdout
          .split("\n")
          .filter((file) => file.trim() !== "");

        // 未追跡ファイルがない場合の処理
        if (files.length === 0 && !patchContent.trim()) {
          console.log("変更されたファイルや新規ファイルがありません。");
          return;
        }

        // 未追跡ファイルの内容を取得して追加
        if (files.length > 0) {
          patchContent += "\n\n--- 新規ファイルの内容 ---\n";
          files.forEach((file) => {
            try {
              const fileContent = fs.readFileSync(file, "utf8");
              patchContent += `\nファイル: ${file}\n${fileContent}\n`;
            } catch (readError) {
              console.error(
                `ファイル読み込みエラー: ${file} - ${readError.message}`,
              );
            }
          });
        }

        const prompt = generatePrompt(patchContent);

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
        const outputPath = path.join(__dirname, "generated-prompt.txt");
        fs.writeFileSync(outputPath, prompt, "utf8");
        console.log(`\nプロンプトがファイルに出力されました: ${outputPath}`);
      },
    );
  });
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

// 実行
generatePromptFromGitDiff();
