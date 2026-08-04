【この更新パックでできること】
- 第4地点を B館 → C館 に変更
- C-Center の看板を画像認識すると、祭札「う」が表示される
- 認識成功後、本編へ戻って「ずいこう」を完成できる

【GitHub に上げるファイル】
app.js
style.css
c-center-ar.html
assets/images/c-center.jpg
assets/ui/festival-card-u.svg
targets/c-center.mind（※自分で作成して追加）

【重要】
このパックには c-center.mind は入っていません。
画像認識を動かすには、MindAR の Image Target Compiler で
assets/images/c-center.jpg から c-center.mind を作ってください。

【GitHub へ反映する手順】
1. 今のリポジトリ ar-ennichi-kitan を開く
2. app.js と style.css を上書きアップロード
3. c-center-ar.html をトップ階層へ追加
4. assets/images/ に c-center.jpg を追加
5. assets/ui/ に festival-card-u.svg を追加
6. targets/ フォルダを作成し、その中に c-center.mind を追加
7. 反映後、サイトを開いて第4地点まで進み、「C館ARを起動する」を押す

【動作の流れ】
- 本編の第4地点で C館ARを起動する
- C-Center を認識すると祭札「う」が出る
- 「本編に戻る」で index.html に戻る
- 「認識できたらここを押す」で祭札「う」を獲得
