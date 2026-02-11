# Habit Tracker SPA

React + Vite で作成した習慣トラッカーです。GitHub Pages へデプロイでき、データは `localStorage` に保存されます。

## 主な機能

- 週間ビュー（日曜始まり、7マス、状態4種）
  - `none` 未達成（枠のみ）
  - `half` 半分達成（半分領域に斜線）
  - `done` 達成（全面塗り）
  - `skip` スキップ（バッテン）
- 月間ビュー（日曜始まりカレンダー、習慣ごと表示）
- 達成度集計
  - 表示中の期間に連動して計算（週表示は表示週、月表示は表示月）
  - 現在の週/月を表示中の場合は未来日を除外
  - `done = 1.0` / `half = 0.5` / `none = 0` / `skip = 分母から除外`
- 習慣管理（追加・編集・アーカイブ・復元・削除）
- `appDataVersion` 付き `localStorage` 永続化と軽量マイグレーション

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## GitHub Pages デプロイ

このリポジトリには `.github/workflows/deploy.yml` があり、`main` への push で Pages にデプロイされます。

1. GitHub リポジトリの `Settings > Pages` で `Source: GitHub Actions` を選択
2. `main` ブランチへ push
3. Actions の `Deploy to GitHub Pages` 完了後、公開URLに反映

`vite.config.js` は GitHub Actions 実行時に `GITHUB_REPOSITORY` から `base` を自動解決します。
ローカルでは `"/habit-tracker/"` を使うため、リポジトリ名を変更する場合は必要に応じて調整してください。

## データ構造

`localStorage` キー: `habit-tracker.app`

```json
{
  "appDataVersion": 2,
  "habits": [
    {
      "id": "uuid",
      "name": "読書 20分",
      "createdAt": "2026-02-11T00:00:00.000Z",
      "archived": false,
      "color": "#2e7d32"
    }
  ],
  "records": {
    "habit-id": {
      "2026-02-11": "done",
      "2026-02-12": "half",
      "2026-02-13": "skip"
    }
  }
}
```

## 主要コンポーネント

- `src/components/WeekView.jsx`
- `src/components/MonthView.jsx`
- `src/components/HabitCard.jsx`
- `src/components/StatusCell.jsx`
- `src/components/HabitEditorDialog.jsx`
- `src/hooks/useLocalStorageStore.js`
