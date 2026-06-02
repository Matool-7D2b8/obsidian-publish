#!/bin/bash
# Sync notes from three Obsidian vaults into Quartz content directory
set -e

VAULTS_DIR="F:/GitHub_Repository"
CONTENT_DIR="./content"

echo "=== Syncing Obsidian vaults to Quartz content ==="

# Clean existing vault content
rm -rf "$CONTENT_DIR/Data_Struct" "$CONTENT_DIR/Math_note" "$CONTENT_DIR/En_learn"

# --- Data_Struct ---
echo "[1/3] Syncing Data_Struct..."
mkdir -p "$CONTENT_DIR/Data_Struct"
cp -r "$VAULTS_DIR/Data_Struct/DS/." "$CONTENT_DIR/Data_Struct/"
cp -r "$VAULTS_DIR/Data_Struct/CN/." "$CONTENT_DIR/Data_Struct/CN/"
cp -r "$VAULTS_DIR/Data_Struct/CO/." "$CONTENT_DIR/Data_Struct/CO/"
cp -r "$VAULTS_DIR/Data_Struct/OS/." "$CONTENT_DIR/Data_Struct/OS/"
echo "       $(find "$CONTENT_DIR/Data_Struct" -name '*.md' | wc -l) notes copied"

# --- Math_note ---
echo "[2/3] Syncing Math_note..."
mkdir -p "$CONTENT_DIR/Math_note"
cp -r "$VAULTS_DIR/Math_note/Math/." "$CONTENT_DIR/Math_note/"
echo "       $(find "$CONTENT_DIR/Math_note" -name '*.md' | wc -l) notes copied"

# --- En_learn ---
echo "[3/3] Syncing En_learn..."
mkdir -p "$CONTENT_DIR/En_learn"
# Copy markdown files from root, skip hidden files
for f in "$VAULTS_DIR/En_learn"/*.md; do
    [ -f "$f" ] && cp "$f" "$CONTENT_DIR/En_learn/"
done
# Copy non-empty subdirectories
for dir in 方法论 真题PDF 错题本 阅读分析; do
    if [ -d "$VAULTS_DIR/En_learn/$dir" ] && [ -n "$(ls -A "$VAULTS_DIR/En_learn/$dir" 2>/dev/null)" ]; then
        mkdir -p "$CONTENT_DIR/En_learn/$dir"
        cp -r "$VAULTS_DIR/En_learn/$dir/." "$CONTENT_DIR/En_learn/$dir/"
    fi
done
echo "       $(find "$CONTENT_DIR/En_learn" -name '*.md' | wc -l) notes copied"

echo ""
echo "=== Sync complete! Run 'npx quartz build' to build the site ==="
