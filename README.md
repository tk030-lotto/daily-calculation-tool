# 日常計算ツール

日常生活で発生する「年齢」「日付」「期間」「時間」に関する計算を、ひとつのWeb画面で完結して行える軽量Webツールです。

- **公開URL (GitHub Pages)**: [https://tk030-lotto.github.io/daily-calculation-tool/](https://tk030-lotto.github.io/daily-calculation-tool/)

電卓では入力や計算が煩雑になりがちな処理を、日付・時刻の直感的な入力のみで即座に算出します。

## 主な機能

1. **年齢計算**
   - 生年月日と基準日（初期値：当日）から満年齢および経過期間を算出
   - うるう年生まれや誕生日当日の年齢加算を正確に処理
2. **日付計算**
   - 基準日からの指定日数後または指定日数前の日付を算出
   - 月末、うるう年、年末年始を正確に考慮
3. **期間計算**
   - 開始日と終了日の2つの日付間の「総日数」および暦上の「○年○か月○日」を算出
4. **時間計算**
   - 開始時刻と終了時刻から経過時間（○時間○分）を算出
   - 日付をまたぐ計算（翌日設定）に対応

## 特徴・設計方針

- **完全クライアントサイド動作**: 外部API、データベース、バックエンドサーバーを一切使用しません。
- **プライバシー保護**: 入力されたデータは外部に送信されず、ブラウザ内でのみ処理されます。
- **軽量・高速**: 依存ライブラリを最小限に抑え、低スペックPC（4GB RAM環境等）やモバイル端末でも軽快に動作します。
- **レスポンシブデザイン**: スマートフォンからデスクトップまで幅広い画面サイズ（最小320px幅対応）に最適化。
- **GitHub Pages対応**: 静的ファイル（HTML / CSS / JavaScript）のみで構成され、GitHub Pagesで即座にホスティング可能です。

## 技術スタック

- HTML5
- CSS3（Vanilla CSS）
- JavaScript（ES6+）

## 起動方法

Windows環境では、フォルダ内の `ツール起動.bat` をダブルクリックするだけで、既定のブラウザでツールが自動的に起動します。
（サーバー設定やNode.jsのインストールは一切不要です）

## 画面構成

タブ切り替えUIを採用し、必要な計算機能を1クリックで切り替えて利用できます。

```text
┌──────────────────────────────┐
│        日常計算ツール         │
├──────────────────────────────┤
│ [年齢] [日付] [期間] [時間]  │
├──────────────────────────────┤
│                              │
│       選択した計算機能        │
│                              │
│       入力                   │
│       ↓                      │
│       計算                   │
│       ↓                      │
│       結果                   │
│                              │
└──────────────────────────────┘
```

## 関連ドキュメント

- 要件定義書: [REQUIREMENTS(6).md](REQUIREMENTS(6).md)
- 仕様書: [SPECIFICATION(20260908-160658).md](SPECIFICATION(20260908-160658).md)
- 開発記録: [RECORD.md](RECORD.md)

## ライセンス

本プロジェクトは MIT ライセンスのもとで公開されています。

```text
MIT License

Copyright (c) 2026 tk030

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
