MYTHOS: Wild Frontier — オンライン公開パッケージ

重要：Netlifyだけでは、このゲームのWebSocket通信サーバーを動かせません。
このパッケージは、ゲーム本体と通信サーバーを同じURLで動かす構成です。
RenderなどNode.js対応ホストにデプロイしてください。

ファイル：
- index.html : ゲーム本体（トップページ）
- server.js : 友達同士をつなぐWebSocketサーバー
- package.json : 起動設定
- render.yaml : Render用の設定

公開手順（Renderを使う場合）：
1. ZIPを解凍する。
2. GitHubで新しい空のリポジトリを作る。
3. 解凍した4ファイルをリポジトリの一番上にアップロードする（ZIPそのものを置くだけでは不可）。
4. Renderで New + → Web Service を選び、そのGitHubリポジトリを接続する。
5. 設定を確認してデプロイする。Build Command: npm install / Start Command: npm start
6. Renderが発行した https://... のURLを自分と友達で開く。部屋コードは不要で、同じ公開ワールドに接続する。

注意：
- Netlifyの静的サイト公開だけでは通信サーバーが動かないため、NetlifyのURLだけで友達とオンラインプレイはできません。
- Renderの無料サービスは休止後、最初の接続まで時間がかかる場合があります。
- 接続できたら、ゲーム内の「オンライン」で接続中か確認してください。
- この構成はゲームの既存オンライン機能を利用するものです。プレイヤー表示・チャット・PvPなどは実機でテストしてください。
