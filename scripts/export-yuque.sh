#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SESSION="yuque-login"
mkdir -p "$ROOT/raw/docs"

books=(
  "24013644|nmkii5|工作"
  "44851824|qmvy1p|生活"
  "58796906|gzq3v8|Python"
  "44851988|rs8s8g|前端"
  "48466893|qd0t47|开源"
)

for item in "${books[@]}"; do
  IFS='|' read -r id slug name <<< "$item"
  echo "[$name] 获取文档列表..."
  expr="fetch('/api/books/$id/docs?limit=1000').then(r=>r.json()).then(d=>d.data.map(x=>({id:x.id,slug:x.slug,title:x.title,description:x.description||'',content_updated_at:x.content_updated_at})))"
  agent-browser --session "$SESSION" --restore eval "$expr" > "$ROOT/raw/$slug-docs.json"

  total=$(python -c "import json,sys;print(len(json.load(open(sys.argv[1],encoding='utf-8'))))" "$ROOT/raw/$slug-docs.json")
  echo "[$name] $total 篇"
  mkdir -p "$ROOT/raw/docs/$slug"

  python - "$ROOT/raw/$slug-docs.json" <<'PY' > "$ROOT/raw/$slug-pairs.txt"
import json, sys
for d in json.load(open(sys.argv[1], encoding='utf-8')):
    print(d['slug'] + '\t' + str(d['id']))
PY

  i=0
  while IFS=$'\t' read -r doc_slug doc_id; do
    i=$((i + 1))
    expr="fetch('/api/docs/$doc_slug?book_id=$id').then(r=>r.json()).then(d=>({id:d.data.id,slug:d.data.slug,title:d.data.title,description:d.data.custom_description||d.data.description||'',content:d.data.content||'',updated_at:d.data.content_updated_at||d.data.updated_at}))"
    agent-browser --session "$SESSION" --restore eval "$expr" > "$ROOT/raw/docs/$slug/$doc_slug.json"
    if (( i % 25 == 0 || i == total )); then
      echo "  $name: $i/$total"
    fi
  done < "$ROOT/raw/$slug-pairs.txt"
done

echo "导出完成"
