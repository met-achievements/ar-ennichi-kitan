# AR縁日奇譚 ― 消えた祭札を探せ ―

大阪経済大学・大樟祭向けの、スマートフォンだけで遊べる学内回遊型Web謎解きの試作版です。

## 実装済み
- 4地点の選択式クイズ
- 祭札「ず・い・こ・う」の収集
- 最終キーワード入力
- 同じスマホでの進捗保存
- 現地写真を後から追加できる構造
- ARトロフィー・NFTボタンの仮置き

## GitHub Pagesで公開
1. 新しいPublicリポジトリを作成（推奨名 `ar-ennichi-kitan`）
2. このフォルダ内のファイルをリポジトリのルートへアップロード
3. `Settings` → `Pages`
4. `Source` を `Deploy from a branch`
5. Branchを `main`、Folderを `/(root)` にして保存
6. 公開URLを確認後、そのURLで新しいQRを作る

`met-achievements/ar-ennichi-kitan` なら公開URLは通常
`https://met-achievements.github.io/ar-ennichi-kitan/`

## 写真を追加
画像を `assets/images/` に入れ、`app.js` の `image` を変更します。

```js
image: "./assets/images/b-building.jpg",
```

推奨ファイル名：`d-building.jpg`、`library.jpg`、`main-gate.jpg`、`b-building.jpg`

## AR・NFT
ARトロフィー完成後に `assets/models/trophy.glb` と必要に応じて `trophy.usdz` を追加します。
NFT受取URLが決まったら、クリア画面のボタンへ設定します。
秘密鍵やSecret KeyはGitHub Pagesのコードへ書かないでください。
