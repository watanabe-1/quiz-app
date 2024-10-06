# 資格問題解答サイト

このサイトは資格勉強用に問題を解くためのサイトです。

## 目次

1. [環境変数の設定-ローカル](#環境変数の設定-ローカル)
   - [必要な環境変数](#必要な環境変数)
   - [`.env.local` ファイルの例](#envlocal-ファイルの例)
   - [`.env` ファイルの例](#env-ファイルの例)
2. [環境変数の設定-vercel](#環境変数の設定-vercel)
   - [`vercel 環境変数 の例`](#vercel 環境変数 の例)
3. [パスワードのハッシュ化](#パスワードのハッシュ化)
   - [ハッシュ化スクリプトの実行方法](#ハッシュ化スクリプトの実行方法)
4. [シークレットキーの生成](#シークレットキーの生成)
   - [シークレットキーの生成方法](#シークレットキーの生成方法)

---

## 環境変数の設定-ローカル

ローカルマシン上で実行する場合は、プロジェクトのルートディレクトリに `.env.local` `.env` ファイルを作成し、以下の環境変数を設定してください。
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

## 環境変数の設定-vercel

vercel にデプロイする場合は、以下の環境変数を設定してください。

### vercel 環境変数 の例

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
