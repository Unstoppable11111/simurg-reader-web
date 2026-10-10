#!/bin/bash
# ==============================================================================
# Simurg Reader Web - 线上秒级版本回滚脚本
# 说明：若最新发布的版本出现线上故障，直接执行本脚本，瞬间还原上一个备份版本
# ==============================================================================

set -e

PROJECT_DIR="/www/wwwroot/simurg-reader-web"
BACKUP_DIR="${PROJECT_DIR}/backups"

cd "${PROJECT_DIR}"

echo "=================================================="
echo ">> 开始执行版本回滚: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="

# 查找最近的备份目录
LATEST_BACKUP=$(ls -td "${BACKUP_DIR}"/output_* 2>/dev/null | head -n 1)

if [ -z "${LATEST_BACKUP}" ] || [ ! -d "${LATEST_BACKUP}" ]; then
  echo ">> [错误] 未在 ${BACKUP_DIR} 中找到可用备份，无法执行回滚！"
  exit 1
fi

echo ">> 找到最新备份版本: ${LATEST_BACKUP}"
echo ">> 正在将当前 .output 替换为备份版本..."

rm -rf "${PROJECT_DIR}/.output"
cp -r "${LATEST_BACKUP}" "${PROJECT_DIR}/.output"

echo ">> 正在平滑重载 PM2..."
pm2 reload ecosystem.config.cjs --update-env

sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001 || true)
echo ">> 回滚后健康检查: HTTP ${HTTP_CODE}"

echo "=================================================="
echo ">> 回滚操作执行完毕！已成功恢复为稳定版本。"
echo "=================================================="
