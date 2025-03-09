# ![image-20250309142523556](assets/image-20250309142523556.png)

# Terebi プロジェクト

このプロジェクトは、日本のテレビ局のYouTubeチャンネルを管理し、動画をランダムに再生するWebアプリケーションです。

## 機能

- 全国および地方の放送局のYouTubeチャンネルをリスト表示
- キャッシュされたチャンネルのみを表示
- ランダムにチャンネルを選択し、動画を再生
- チャンネルの動画リストをJSONファイルとして保存

## ファイル構成

- `index.jsp`: Webアプリケーションのメインページ。チャンネルリストの表示と動画の再生を行います。
- `get_channel_videos.py`: YouTube APIを使用してチャンネル情報と動画リストを取得し、JSONファイルに保存します。
- `japan_tv_youtube_channels.json`: 全国および地方の放送局のYouTubeチャンネル情報を含むJSONファイル。

## 使用方法

1. `get_channel_videos.py` を実行して、チャンネル情報と動画リストを取得します。
   ```bash
   python get_channel_videos.py
   ```
   - `--only-uncached` オプションを使用すると、未キャッシュのチャンネルのみを処理します。

2. Webサーバーを起動し、ブラウザで `index.jsp` を開きます。

3. チャンネルリストが表示され、ランダムに選択されたチャンネルの動画が再生されます。

## 必要条件

- Python 3.x
- YouTube Data API キー
- Javaサーブレットコンテナ（例: Apache Tomcat）

## 注意事項

- `WEB-INF/config.properties` にYouTube APIキーを設定してください。
- `source_processing.py` は、取得した動画データをさらに処理するためのスクリプトです。

## ツール説明

### 1. check_name.py

**用途**: `japan_tv_youtube_channels.json`設定ファイルと`data`ディレクトリ内の実際のデータファイルの整合性を確認します。

**設計理由**: 多数のYouTubeチャンネルデータを管理する際、設定ファイルと実際のデータの同期を確保する必要があります。

**解決する問題**:
- 設定ファイルに存在するが、対応するデータファイルがないチャンネルを検出
- データディレクトリに存在するが、設定ファイルに定義されていないチャンネルを特定

**使用方法**:
```bash
python tools/check_name.py
```

### 2. clear_channel.py

**用途**: `japan_tv_youtube_channels.json`設定ファイルから、対応する画像がないチャンネルをクリーンアップします。

**設計理由**: チャンネル画像は表示インターフェースの重要な要素です。画像ファイルがないチャンネルがあると、フロントエンドの表示に問題が生じる可能性があります。

**解決する問題**:
- 設定ファイルの整理
- すべての設定済みチャンネルに対応する画像リソースがあることを確認
- 画像リソースの欠如によるフロントエンド表示の問題を防止

**使用方法**:
```bash
python tools/clear_channel.py
```

### 3. extract_url_from_html ツールセット

#### html2video.py

**用途**: 保存されたHTMLファイルからYouTubeチャンネル情報と動画データを抽出します。

**設計理由**: APIを通じてチャンネルデータを取得できない場合や、API制限がある場合に使用します。

**解決する問題**:
- API制限を回避してチャンネルデータを取得
- 保存済みのHTMLページからチャンネル情報を復元
- チャンネルの正式名称、動画リスト、チャンネルアイコンを抽出

**使用方法**:
```bash
python tools/extract_url_from_html/html2video.py
```

#### merge_json_files.py

**用途**: HTMLから抽出したJSONデータを既存のdataディレクトリ内のデータとマージします。

**設計理由**: HTMLから抽出したデータを既存のデータと統合して、完全なチャンネル動画履歴を維持する必要があります。

**解決する問題**:
- 異なるソースからのチャンネルデータの統合
- 重複動画の回避
- 既存データを保持しながら新しいデータを追加

**使用方法**:
```bash
python tools/extract_url_from_html/merge_json_files.py
```

### 4. get_channel_videos.py

**用途**: YouTube APIを使用してチャンネルの動画リストを取得し、dataディレクトリに保存します。

**設計理由**: チャンネルの動画リストを定期的に更新して、データの鮮度を保つ必要があります。

**解決する問題**:
- チャンネル動画データの取得を自動化
- APIキーとクォータの管理
- 増分更新をサポートし、既存データの重複取得を回避
- キャッシュされていないチャンネルを優先的に処理

**使用方法**:
```bash
# 基本的な使用法
python tools/get_channel_videos.py

# すべてのチャンネルを強制更新
python tools/get_channel_videos.py --force

# 自動タスクモード、キャッシュされていないチャンネルを優先
python tools/get_channel_videos.py --auto-task

# チャンネルごとの取得動画数を指定
python tools/get_channel_videos.py --videos-per-channel 200

# すべてのプロンプトを自動確認
python tools/get_channel_videos.py --yes

# 処理後にFTPサーバーにアップロード
python tools/get_channel_videos.py --upload
```

### 5. get_picture.py

**用途**: チャンネルのアバター/アイコンを取得し、imgディレクトリに保存します。

**設計理由**: チャンネルアイコンはフロントエンド表示の重要な要素であり、すべてのチャンネルのアイコンを取得して保存する必要があります。

**解決する問題**:
- チャンネルアイコンの自動取得
- すべてのチャンネルに対応する画像リソースがあることを確認
- フロントエンド表示の品質向上

**使用方法**:
```bash
python tools/get_picture.py
```

### 6. run.py

**用途**: get_channel_videos.pyスクリプトを定期的に実行し、チャンネルデータの自動更新を実現します。

**設計理由**: チャンネルデータを定期的に更新する必要がありますが、手動実行は効率的ではありません。

**解決する問題**:
- チャンネルデータの定期更新を自動化
- 人的介入の削減
- データの継続的な更新を確保

**使用方法**:
```bash
python tools/run.py
```

スクリプトは毎日00:00にget_channel_videos.pyを自動実行します。

### 7. source_processing.py

**用途**: sourceディレクトリ内の生のJSONデータを処理し、標準フォーマットに変換してdataディレクトリに保存します。

**設計理由**: 異なるソースから取得したデータのフォーマットが一貫していない場合があり、標準フォーマットに統一する必要があります。

**解決する問題**:
- 異なるソースからのデータフォーマットの統一
- データ内の特殊ケースの処理
- 新旧データのマージ、重複の回避
- 新しく発見されたチャンネルを設定ファイルに自動追加

**使用方法**:
```bash
# すべてのファイルを処理
python tools/source_processing.py

# 特定のファイルを処理
python tools/source_processing.py path/to/file.json
```

### 8. update2ftp.py

**用途**: 処理済みのデータファイルをFTPサーバーにアップロードします。

**設計理由**: 処理済みのデータをサーバーにデプロイして、ウェブサイトからアクセスできるようにする必要があります。

**解決する問題**:
- デプロイプロセスの自動化
- サーバーへのファイル転送の安全性確保
- リモートディレクトリ構造の作成をサポート

**使用方法**:
```bash
python tools/update2ftp.py local_file config_file remote_dir
```

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。