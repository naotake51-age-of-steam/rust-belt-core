
# Docs

- https://boardgamegeek.com/filepage/191076/age-steam-deluxe-english-rules

# Directories

|Directory|Description|
|---|---|
|src/enums||
|src/game|タイル配置やプレーヤーアクションなど、進行状況を保存するオブジェクト群|
|src/objects|ゲームマップやタイルなど、ゲームを構築する不変のオブジェクト群|

# Methods

|---|---|
|Method|Description|
|---|---|
|canXxxx|対応するアクションが実行可能かどうか|
|actionXxxx|アクションの実行。次の状態を返す|
