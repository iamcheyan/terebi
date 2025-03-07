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

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。