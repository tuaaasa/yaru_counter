# Kabaddi Scoreboard

カバディ用スコアボードアプリ。GitHub Pages でホスティングし、Firebase Realtime Database でリアルタイム同期します。

## ページ構成

| ページ | URL | 説明 |
|--------|-----|------|
| 表示ページ | `index.html` | スコアを大きく表示（プロジェクター・大画面用） |
| 操作ページ | `operate.html` | 得点操作・UNDO・RESET・履歴（スマホ・タブレット用） |

## セットアップ手順

### 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」→ プロジェクト名を入力（例: `kabaddi-score`）
3. Google アナリティクスは任意（不要ならオフ）→ 「プロジェクトを作成」

### 2. Realtime Database を有効化

1. 左メニュー「構築」→「Realtime Database」→「データベースを作成」
2. ロケーション: `asia-southeast1`（シンガポール）を推奨
3. セキュリティルール: 「テストモードで開始」を選択（後で変更可）

### 3. セキュリティルールの設定

「Realtime Database」→「ルール」タブで以下に変更して「公開」:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> 注意: このルールは誰でも読み書きできます。パスワード保護が必要な場合は別途設定してください。

### 4. Firebase 設定値を取得

1. プロジェクト概要の歯車アイコン →「プロジェクトの設定」
2. 「マイアプリ」セクション →「ウェブ」アイコン（`</>`）をクリック
3. アプリ名を入力して「アプリを登録」
4. `firebaseConfig` オブジェクトの値をコピー

### 5. config.js を編集

`config.js` の `YOUR_...` の部分を取得した値に書き換えます:

```js
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "kabaddi-score.firebaseapp.com",
  databaseURL: "https://kabaddi-score-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kabaddi-score",
  storageBucket: "kabaddi-score.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 6. GitHub Pages でホスティング

1. このリポジトリを GitHub にプッシュ
2. リポジトリの「Settings」→「Pages」
3. Source: 「Deploy from a branch」→ ブランチ `main` / `/ (root)` を選択 →「Save」
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## 使い方

- **表示ページ** (`index.html`): スコアボードとして大画面に映す
- **操作ページ** (`operate.html`): スマホやタブレットから得点を入力
- 得点ボタンを押すと即座に表示ページのスコアが更新される
- **UNDO**: 直前の操作を1つ取り消す
- **RESET**: スコアと履歴を全リセット（確認ダイアログあり）
