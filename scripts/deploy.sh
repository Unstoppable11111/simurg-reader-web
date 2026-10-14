#!/bin/bash
# ==============================================================================
# Simurg Reader Web - 宝塔服务器自动化发布与重载脚本
# 说明：解压上传的 .output.tar.gz，完成快照备份、零停机平滑重载与健康检查
# ==============================================================================

set -e

PROJECT_DIR="/www/wwwroot/simurg-reader-web"
BACKUP_DIR="${PROJECT_DIR}/backups"
PACKAGE_FILE="${PROJECT_DIR}/.output.tar.gz"

cd "${PROJECT_DIR}"

echo "=================================================="
echo ">> 开始执行部署: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="

# 1. 检查是否存在新产物包
if [ ! -f "${PACKAGE_FILE}" ]; then
  echo ">> [错误] 未在 ${PROJECT_DIR} 找到 ${PACKAGE_FILE} 文件，部署终止！"
  exit 1
fi

# 2. 备份当前运行中的 .output
if [ -d "${PROJECT_DIR}/.output" ]; then
  mkdir -p "${BACKUP_DIR}"
  CURRENT_SNAPSHOT="${BACKUP_DIR}/output_$(date +%Y%m%d_%H%M%S)"
  echo ">> 正在将当前运行版本备份至: ${CURRENT_SNAPSHOT}"
  cp -r "${PROJECT_DIR}/.output" "${CURRENT_SNAPSHOT}"

  # 保留最近 3 个历史备份，删除超出的旧备份
  cd "${BACKUP_DIR}"
  ls -td output_* 2>/dev/null | tail -n +4 | xargs -r rm -rf
  cd "${PROJECT_DIR}"
fi

# 3. 解压新版本并覆盖
echo ">> 正在解压新版本产物..."
tar -zxf "${PACKAGE_FILE}" -C "${PROJECT_DIR}"
rm -f "${PACKAGE_FILE}"

# 4. 平滑重载 PM2（Zero Downtime）
echo ">> 正在执行 PM2 平滑重载..."
if command -v pm2 &> /dev/null; then
  pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
else
  echo ">> [错误] 服务器未检测到 pm2 命令，请确保已安装 pm2 并配置全局环境变量"
  exit 1
fi

# 5. 健康检查
echo ">> 等待 3 秒进行健康自检..."
sleep 3

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001 || true)
echo ">> 服务健康检测结果: HTTP ${HTTP_CODE}"

if [ "${HTTP_CODE}" = "200" ] || [ "${HTTP_CODE}" = "302" ] || [ "${HTTP_CODE}" = "301" ]; then
  echo "=================================================="
  echo ">> 恭喜！部署完成，服务已正常上线！"
  echo "=================================================="
  exit 0
else
  echo ">> [警告] 端口返回状态异常 (${HTTP_CODE})，请检查应用日志: pm2 logs simurg-reader-web"
  exit 1
fi
