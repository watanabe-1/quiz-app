# 資格学習支援サイト

このサイトは資格試験の勉強を支援するための問題解答サイトです。

## 目次

1. [環境変数の設定 - ローカル](#環境変数の設定---ローカル)
   - [必要な環境変数](#必要な環境変数)
   - [`.env.local` ファイルの例](#envlocal-ファイルの例)
   - [`.env` ファイルの例](#env-ファイルの例)
   - [`.env.test` ファイルの例](#envtest-ファイルの例)
2. [環境変数の設定 - Vercel](#環境変数の設定---vercel)
   - [Vercel 環境変数の例](#vercel-環境変数の例)
3. [パスワードのハッシュ化](#パスワードのハッシュ化)
   - [ハッシュ化スクリプトの実行方法](#ハッシュ化スクリプトの実行方法)
4. [シークレットキーの生成](#シークレットキーの生成)
   - [シークレットキーの生成方法](#シークレットキーの生成方法)
5. [パス定義の作成](#パス定義の作成)
6. [Git差分からプロンプトを生成するスクリプト](#git差分からプロンプトを生成するスクリプト)
   - [スクリプトの説明](#スクリプトの説明)
   - [使用方法](#使用方法)
7. [利用可能なスクリプト](#利用可能なスクリプト)
   - [開発関連](#開発関連)
   - [コードチェック](#コードチェック)
   - [テスト関連](#テスト関連)
   - [データベースマイグレーション](#データベースマイグレーション)
   - [その他のスクリプト](#その他のスクリプト)

---

## 環境変数の設定 - ローカル

ローカルで実行するには、プロジェクトのルートに `.env.local`、`.env`、`.env.test` ファイルを作成し、必要な環境変数を設定してください。

### 必要な環境変数

- `ADMIN_USERNAME`: 管理者のユーザー名（例: admin）。
- `ADMIN_PASSWORD_HASH`: 管理者のパスワードの bcrypt ハッシュ。
- `USER_USERNAME`: 通常ユーザのユーザー名（例: user）。
- `USER_PASSWORD_HASH`: 通常ユーザのパスワードの bcrypt ハッシュ。
- `LOG_IN_PAGE`: ログインページのパス。
- `USER_PROTECTED_PATHS`: 認証が必要なパスのリスト（カンマ区切り）。
- `NEXTAUTH_URL`: Auth.js の URL。
- `NEXTAUTH_SECRET`: Auth.js のシークレットキー。
- `AUTH_TRUST_HOST`:Auth.js の"trust host"設定。reverse proxy からの X-Forwarded-Host header の値を "trust" する。self-hosted な環境では、"trust host" を有効化させる必要あり。
- `NEXT_PUBLIC_PROTOCOL`: URL 作成に使用するプロトコル。

- `POSTGRES_～`: DB 接続用 URL。

### `.env.local` ファイルの例

以下は、`.env.local` ファイルのサンプルです。実際の値に置き換えて使用してください。

```env
# 管理者のユーザー名
ADMIN_USERNAME=admin

# 管理者のパスワードのハッシュ（bcryptでハッシュ化されたもの、$を\でエスケープした値を設定）
ADMIN_PASSWORD_HASH=\$2b\$10\$6LjoTU3W7NIIdfVlUCr5X.dnSacabEHoYcgBxoYbU5LtsMcyHRPFO

# 通常ユーザのユーザー名
USER_USERNAME=user

# 通常ユーザのパスワードのハッシュ（bcryptでハッシュ化されたもの、$を\でエスケープした値を設定）
USER_PASSWORD_HASH=\$2b\$10\$rIyGkgOR4haBw3q3engi4uy7q.U1gbHfFx/Hj9C2BqodjJ7PV6JIW

# ログインページのパス
LOG_IN_PAGE=/auth/login

# 認証が必要なパス（カンマ区切り）
USER_PROTECTED_PATHS=/,/quiz,/api

# Auth.js の URL
NEXTAUTH_URL=http://localhost:3000

# Auth.js のシークレットキー（''で囲んで設定）
NEXTAUTH_SECRET='your-very-secure-secret-key'

# Auth.js の"trust host"設定
AUTH_TRUST_HOST=true

# URL 作成に使用するプロトコル
NEXT_PUBLIC_PROTOCOL=http
```

### `.env` ファイルの例

以下は、`.env` ファイルのサンプルです。実際の値に置き換えて使用してください。

```env
# DB接続用URL
POSTGRES_PRISMA_URL="postgresql://${username}:${password}@localhost:${port}/${database}"
POSTGRES_URL_NO_SSL="postgresql://${username}:${password}@localhost:${port}/${database}"
POSTGRES_URL_NON_POOLING="postgresql://${username}:${password}@localhost:${port}/${database}"
```

### `.env.test` ファイルの例

以下は、`.env.test` ファイルのサンプルです。実際の値に置き換えて使用してください。

```env
# テスト環境DB接続用URL
POSTGRES_PRISMA_URL="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
POSTGRES_URL_NO_SSL="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
POSTGRES_URL_NON_POOLING="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
```

## 環境変数の設定 - Vercel

Vercel にデプロイする場合のサンプルです。実際の値に置き換えて環境変数を設定してください。

### Vercel 環境変数の例

```env
# 管理者のユーザー名
ADMIN_USERNAME=admin

# 管理者のパスワードのハッシュ（bcryptでハッシュ化されたもの、エスケープしていない値を設定）
ADMIN_PASSWORD_HASH=$2b$10$6LjoTU3W7NIIdfVlUCr5X.dnSacabEHoYcgBxoYbU5LtsMcyHRPFO

# 通常ユーザのユーザー名
USER_USERNAME=user

# 通常ユーザのパスワードのハッシュ（bcryptでハッシュ化されたもの、エスケープしていない値を設定）
USER_PASSWORD_HASH=$2b$10$eA9N4hUuKS1NPjoOi1Mn2e2A0wjHaxVwc6UmJhwcniHc5oIH.23wC

# ログインページのパス
LOG_IN_PAGE=/auth/login

# 認証が必要なパス（カンマ区切り）
USER_PROTECTED_PATHS=/,/quiz,/api

# Auth.js のシークレットキー
NEXTAUTH_SECRET=your-very-secure-secret-key

# URL 作成に使用するプロトコル
NEXT_PUBLIC_PROTOCOL=https
```

## パスワードのハッシュ化

ハッシュ化スクリプトをコマンドラインから実行しパスワードをハッシュ化します。エスケープした値を設定してください。（Vercel にはエスケープしていない値を設定）

### ハッシュ化スクリプトの実行方法

```cmd
node hashPassword.mjs <your-plain-password>
```

## シークレットキーの生成

`openssl` などを利用してシークレットキーを生成します。`openssl` がインストールされていない場合は別途インストールしてください。

### シークレットキーの生成方法

```cmd
openssl rand -base64 32
```

## パス定義の作成

### パス定義の作成方法

`generateRoutes.mjs` スクリプトは、[pathpida](https://github.com/aspida/pathpida) を参考に作成しています。アプリディレクトリの構造からページパスを生成するためのツールです。このスクリプトを使用して、指定したディレクトリ内のページに対応する TypeScript オブジェクトを生成できます。

#### コマンドの実行

次のコマンドでスクリプトを実行し、ページパスを生成します。

```cmd
node generateRoutes.mjs <baseDir> <outputPath> <methodOption(all|one|both)> <printPathname(true|false)>
```

- `<baseDir>`: ページの探索を開始するベースディレクトリのパス。
- `<outputPath>`: 生成されたページパスを出力するファイルのパス。
- `<methodOption>`: 生成するメソッドのオプション。`all`、`one`、`both` のいずれかを指定します。
- `<printPathname>`: `true` または `false` で、pathname を生成するかどうかを指定します。

##### `methodOption` の説明

- `all`: すべてのページに共通のメソッドを生成します。
- `one`: 各ページに個別のメソッドを生成します。
- `both`: 共通の URL メソッドと個別のメソッドの両方を生成します。

##### `printPathname` の説明

- `true`: pathname を生成します。
- `false`: pathname を生成しません。

#### 使用例 - パス定義

例えば、`src/app` ディレクトリ内のページパスを生成し、結果を `pagesPath.ts` ファイルに出力するには、次のコマンドを使用します。

```cmd
node generateRoutes.mjs ./src/app ./src/lib/path.ts one false
```

このコマンドにより、指定したディレクトリ内のページに対応するすべてのパスとメソッドが `pagesPath.ts` に出力されます。

#### 出力ファイル

出力ファイルには、ページ構造に対応する TypeScript オブジェクトとメソッドが含まれています。生成されたコードを利用することにより、アプリ内の各ページやルートにアクセスするための一貫した方法を提供します。

#### 注意事項 - パス定義

- ベースディレクトリに `node_modules` や、ファイル名が `_` で始まるディレクトリ・ファイルは無視されます。
- 出力ファイルのメソッドは `page.tsx`、`page.jsx`、`route.ts`、`route.js` ファイルに基づいて生成されます。

## Git差分からプロンプトを生成するスクリプト

### スクリプトの説明

`generatePromptFromGitDiff.mjs` スクリプトは、Git の差分を取得し、その内容に基づいて ChatGPT 用のプロンプトを自動生成するためのツールです。このスクリプトは、ステージされていない変更、ステージされた変更、そして新規ファイルの内容を含めてプロンプトを作成します。生成されたプロンプトはコンソールに出力され、一部は `generated_prompt.txt` ファイルにも保存されます。

### 使用方法

1. スクリプトファイル `generatePromptFromGitDiff.mjs` をプロジェクトのルートディレクトリに配置します。
2. コマンドラインから次のコマンドを実行して、プロンプトを生成します。

```cmd
node generatePromptFromGitDiff.mjs
```

このコマンドにより、現在の Git リポジトリ内の差分が取得され、それに基づいてプロンプトが生成されます。生成されたプロンプトの一部はコンソールに表示され、全文は `generated_prompt.txt` に出力されます。

### 注意事項

- Git がインストールされている環境で実行してください。
- 差分を正しく取得するため、リポジトリ内で実行してください。
- 新規ファイルの内容もプロンプトに含めるため、未追跡ファイルがある場合はそれらの内容も読み取られます。

## 利用可能なスクリプト

このプロジェクトでは、開発、テスト、データベース操作を管理するためにいくつかの npm スクリプトが用意されています。以下は、それぞれのコマンドとその説明です。

### 開発関連

#### `npm run dev`

Next.js の開発サーバーをデバッグモード (`--inspect`) で起動します。Node.js プロセスのデバッグが可能で、開発時にはホットリロードや簡単なデバッグができます。

#### `npm run build`

Prisma クライアントを生成し、`prisma db push` を使ってデータベーススキーマを同期します。この際、`--accept-data-loss` フラグが使用されます（データ損失の可能性があるため、注意が必要です）。その後、Next.js アプリケーションを本番用にビルドします。

#### `npm run start`

Next.js アプリケーションを本番モードで起動します。このコマンドを実行する前に、`npm run build` を実行してアプリケーションをビルドする必要があります。

### コードチェック

#### `npm run lint`

Next.js のリントツールを使用して、コードのリントチェックを実行します。このコマンドを使用して、コードの品質と一貫性を保つことができます。

#### `npm run lint:fix`

Next.js のリントツールを使用して、プロジェクト全体のコードの自動整形を行います。

#### `npm run inspect`

`npx eslint --inspect-config` を実行して ESLint の設定を検査します。現在のプロジェクトの ESLint 設定の詳細を確認するのに役立ちます。[ここ](http://localhost:7777/) から確認できます。

### テスト関連

#### `npm run test`

テストスイートを実行する前に、`migrate:test` コマンドを実行してテスト環境のデータベースマイグレーションをリセットし、最新のマイグレーションを適用します。環境変数には `.env.test` ファイルを使用します。マイグレーションが完了した後、Jest を使用してテストを実行します。

**注意**: 別途テスト用のデータベースを設定し、必要な環境変数を `.env.test` ファイルに記載しておいてください。

### データベースマイグレーション

#### `npm run migrate`

Prisma クライアントを生成し、`prisma db push` を使用してデータベースに最新のスキーマ変更を適用します。`--accept-data-loss` フラグは破壊的なスキーマ変更がある場合、データ損失の可能性があるため、使用には注意が必要です。

#### `npm run migrate:test`

`migrate` コマンドと似ていますが、テスト環境用です。`.env.test` ファイルを使用して環境変数を読み込み、`prisma migrate reset` でテストデータベースをリセットします。このコマンドは、テストを実行する前に使用し、クリーンなデータベース状態を確保します。

### その他のスクリプト

#### `npm run hash:password <your-plain-password>`

`node hashPassword.mjs` を実行してパスワードをハッシュ化します。指定されたパスワードを bcrypt でハッシュ化し、環境変数に設定する際に使用します。引数にハッシュ化したいパスワードを設定してください。

#### `npm run generate:paths`

`node generateRoutes.mjs ./src/app ./src/lib/path.ts one false` を実行して、ページパスの TypeScript オブジェクトを生成します。これにより、アプリ内でルーティングに使用する便利なパスオブジェクトを作成できます。

#### `npm run generate:diff-prompt`

`node generatePromptFromGitDiff.mjs` を実行して、Git の差分からプロンプトを生成します。現在の差分をもとに ChatGPT 用のプロンプトを作成するために使用します。
