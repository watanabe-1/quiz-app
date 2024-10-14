# 資格問題解答サイト

このサイトは資格勉強用に問題を解くためのサイトです。

## 目次

1. [環境変数の設定-ローカル](#環境変数の設定-ローカル)
   - [必要な環境変数](#必要な環境変数)
   - [`.env.local` ファイルの例](#envlocal-ファイルの例)
   - [`.env` ファイルの例](#env-ファイルの例)
   - [`.env.test` ファイルの例](#envtest-ファイルの例)
2. [環境変数の設定-vercel](#環境変数の設定-vercel)
   - [`vercel` 環境変数の例](#vercel-環境変数の例)
3. [パスワードのハッシュ化](#パスワードのハッシュ化)
   - [ハッシュ化スクリプトの実行方法](#ハッシュ化スクリプトの実行方法)
4. [`path定義` の作成方法](#path定義-の作成方法)
5. [シークレットキーの生成](#シークレットキーの生成)
   - [シークレットキーの生成方法](#シークレットキーの生成方法)
6. [利用可能なスクリプト](#利用可能なスクリプト)

---

## 環境変数の設定-ローカル

ローカルマシン上で実行する場合は、プロジェクトのルートディレクトリに `.env.local` `.env` `.env.test` ファイルを作成し、以下の環境変数を設定してください。
これらの環境変数は、認証システムの動作に必要な情報を提供します。

### 必要な環境変数

- `ADMIN_USERNAME`: 管理者のユーザー名。
- `ADMIN_PASSWORD_HASH`: 管理者のパスワードの bcrypt ハッシュ。
- `SIGN_IN_PAGE`: サインインページのパス。
- `PROTECTED_PATHS`: 認証が必要なパスのリスト（カンマ区切り）。
- `NEXTAUTH_URL`: NextAuth.js の URL。
- `NEXTAUTH_SECRET`: NextAuth.js のシークレットキー。
- `NEXT_PUBLIC_PROTOCOL`: URL 作成に使用する PROTOCOL。
- `POSTGRES_～`: DB 接続用 URL。

### `.env.local` ファイルの例

以下は、`.env.local` ファイルのサンプルです。実際の値に置き換えて使用してください。

```.env.local
# 管理者のユーザー名
ADMIN_USERNAME=admin

# 管理者のパスワードのハッシュ（bcryptでハッシュ化されたもの、$を\でエスケープした値を設定）
ADMIN_PASSWORD_HASH=\$2b\$10\$6LjoTU3W7NIIdfVlUCr5X.dnSacabEHoYcgBxoYbU5LtsMcyHRPFO

# サインインページのパス
SIGN_IN_PAGE=/auth/signin

# 認証が必要なパス（カンマ区切り）
PROTECTED_PATHS=/admin,/api/admin

# NextAuth.js の URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth.js のシークレットキー（''で囲んで設定）
NEXTAUTH_SECRET='your-very-secure-secret-key'

# URL 作成に使用する PROTOCOL
NEXT_PUBLIC_PROTOCOL=http
```

### `.env` ファイルの例

以下は、`.env` ファイルのサンプルです。実際の値に置き換えて使用してください。

```.env
# DB接続用URL
POSTGRES_PRISMA_URL="postgresql://${username}:${password}@localhost:${port}/${database}"
POSTGRES_URL_NO_SSL="postgresql://${username}:${password}@localhost:${port}/${database}"
POSTGRES_URL_NON_POOLING="postgresql://${username}:${password}@localhost:${port}/${database}"
```

### `.env.test` ファイルの例

以下は、`.env.test` ファイルのサンプルです。実際の値に置き換えて使用してください。

```.env.test
# テスト環境DB接続用URL
POSTGRES_PRISMA_URL="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
POSTGRES_URL_NO_SSL="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
POSTGRES_URL_NON_POOLING="postgresql://${username}:${password}@localhost:${port}/${testdatabase}"
```

## 環境変数の設定-vercel

vercel にデプロイする場合は、以下の環境変数を設定してください。

### `vercel` 環境変数の例

```vercel-environment-variables
# 管理者のユーザー名
ADMIN_USERNAME=admin

# 管理者のパスワードのハッシュ（bcryptでハッシュ化されたもの、エスケープしていない値を設定）
ADMIN_PASSWORD_HASH=\$2b\$10\$6LjoTU3W7NIIdfVlUCr5X.dnSacabEHoYcgBxoYbU5LtsMcyHRPFO

# サインインページのパス
SIGN_IN_PAGE=/auth/signin

# 認証が必要なパス（カンマ区切り）
PROTECTED_PATHS=/admin,/api/admin

# NextAuth.js のシークレットキー
NEXTAUTH_SECRET=your-very-secure-secret-key

# URL 作成に使用する PROTOCOL
NEXT_PUBLIC_PROTOCOL=https
```

## パスワードのハッシュ化

ハッシュ化スクリプトをコマンドラインから実行しパスワードをハッシュ化します。エスケープされた値を設定してください。(vercel にはエスケープしていない値を設定)

### ハッシュ化スクリプトの実行方法

```cmd
node hashPassword.js your-plain-password
```

## シークレットキーの生成

openssl などを利用して生成可能です。openssl がインストールされていない場合は別途インストールしてください。

### シークレットキーの生成方法

```cmd
openssl rand -base64 32
```

### `path定義` の作成方法

`generateRoutes.js` スクリプトは、[pathpida](https://github.com/aspida/pathpida)を参考に作成しています。これはアプリディレクトリの構造からページパスを生成するためのツールです。このスクリプトを使用して、指定したディレクトリ内のページに対応する TypeScript オブジェクトを生成できます。また、Queryパラメータをurlに設定したい場合は、設定したいパスに紐づくファイル内で、Query or OptionalQuery 型で型を定義しexportしてください。

#### コマンドの実行

次のコマンドでスクリプトを実行し、ページパスを生成します。

```cmd
node generateRoutes.js <baseDir> <outputPath> <methodOption(all|one|both)> <printPathname(true|false)>
```

- `<baseDir>`: ページの探索を開始するベースディレクトリのパス。
- `<outputPath>`: 生成されたページパスを出力するファイルのパス。
- `<methodOption>`: 生成するメソッドのオプションです。`all`、`one`、`both` のいずれかを指定します。
- `<printPathname>`: 生成するメソッドのオプションです。`true`、`false` のいずれかを指定します。

##### `methodOption` の説明

- `all`: すべてのページに対して共通のメソッドを生成します。
- `one`: 各ページに個別のメソッドを生成します。
- `both`: 共通の URL メソッドと個別のメソッドの両方を生成します。

##### `printPathname` の説明

- `true`: pathnameを生成します。
- `false`: pathnameを生成しません。

#### 使用例

例えば、`src/app` ディレクトリ内のページパスを生成し、結果を `pagesPath.ts` ファイルに出力するには、次のコマンドを使用します。

```cmd
node generateRoutes.js ./src/app ./src/lib/pagesPath.ts one false
```

このコマンドにより、指定したディレクトリ内のページに対応するすべてのパスとメソッドが `pagesPath.ts` に出力されます。

#### 出力ファイル

出力ファイルには、ページ構造に対応する TypeScript オブジェクトとメソッドが含まれています。生成されたコードは、アプリ内のさまざまなページやルートにアクセスするための便利な方法を提供します。

#### 注意事項

- ベースディレクトリに `node_modules` や、ファイル名が `_` で始まるディレクトリ・ファイルは無視されます。
- 出力ファイルのメソッドは `page.tsx`、`page.jsx`、`route.ts`、`route.js` ファイルに基づいて生成されます。

## 利用可能なスクリプト

このプロジェクトでは、開発、テスト、データベース操作を管理するためにいくつかの npm スクリプトが用意されています。以下は、それぞれのコマンドとその説明です。

### 開発関連

#### `npm run dev`

Next.js の開発サーバーをデバッグモード (`--inspect`) で起動します。Node.js プロセスのデバッグが可能で、開発時にはホットリロードや簡単なデバッグができます。

#### `npm run build`

Prisma クライアントを生成し、`prisma db push`を使ってデータベーススキーマを同期します。この際、`--accept-data-loss`フラグが使用されます（このフラグはデータ損失の可能性があるため、注意が必要です）。その後、Next.js アプリケーションを本番用にビルドします。

#### `npm run start`

Next.js アプリケーションを本番モードで起動します。このコマンドを実行する前に、`npm run build`を実行してアプリケーションをビルドする必要があります。

### コードチェック

#### `npm run lint`

Next.js のリントツールを使用して、コードのリントチェックを実行します。このコマンドを使用して、コードの品質と一貫性を保つことができます。

### テスト関連

#### `npm run test`

テストスイートを実行する前に、`migrate:test`コマンドを実行してテスト環境のデータベースマイグレーションをリセットし、最新のマイグレーションを適用します。環境変数には`.env.test`ファイルを使用します。マイグレーションが完了した後、Jest を使用してテストを実行します。

**注意**: 別途テスト用のデータベースを設定し、必要な環境変数を`.env.test`ファイルに記載しておいてください。

### データベースマイグレーション

#### `npm run migrate`

Prisma クライアントを生成し、`prisma db push`を使用してデータベースに最新のスキーマ変更を適用します。`--accept-data-loss`フラグは破壊的なスキーマ変更がある場合、データ損失の可能性があるため、使用には注意が必要です。

#### `npm run migrate:test`

`migrate`コマンドと似ていますが、テスト環境用です。`.env.test`ファイルを使用して環境変数を読み込み、`prisma migrate reset`でテストデータベースをリセットします。このコマンドは、テストを実行する前に使用し、クリーンなデータベース状態を確保します。
