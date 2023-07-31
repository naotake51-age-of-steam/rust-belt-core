
# Docs

- https://boardgamegeek.com/filepage/191076/age-steam-deluxe-english-rules

# Directories

|Directory|Description|
|---|---|
|src/enums||
|src/game|タイル配置やプレーヤーアクションなど、進行状況を保存するオブジェクト群|
|src/objects|ゲームマップやタイルなど、ゲームを構築する不変のオブジェクト群|

# Methods

|Method|Description|
|---|---|
|canXxxx|対応するアクションが実行可能かどうか|
|actionXxxx|アクションの実行。次の状態を返す|

# Test

## 特定のテストのみ実行する方法
```
npm run test -- src/game/Phase/WaitingStartPhase.test.ts -t actionStartGame
```

# VSCode Plugin

|Plugin|Description|
|---|---|
|vscode-jest|テストおよびデバッグを簡単に実行するために使用する。ファイル保存したタイミングでテスト実行されないようにsetting.jsonで調整|