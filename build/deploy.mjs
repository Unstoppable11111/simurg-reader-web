import { NodeSSH } from "node-ssh";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

const host = "111.228.38.154";
const port = 22;
const username = "root";
const password = process.env.SERVER_PWD;
const targetDir = "/www/wwwroot/simurg-reader-web";
const archiveName = ".output.tar.gz";

if (!password) {
  console.error("❌ 错误：未读取到 SERVER_PWD 环境变量！请在 Gitee 流水线【通用变量】中确认已配置！");
  process.exit(1);
}

if (!fs.existsSync(archiveName)) {
  console.error(`❌ 错误：本地未找到构建产物包 ${archiveName}，请确认 pnpm run build:prod 是否执行成功！`);
  process.exit(1);
}

const ssh = new NodeSSH();

async function run() {
  console.log(`🚀 开始连接服务器 ${host}:${port}...`);
  await ssh.connect({
    host,
    port,
    username,
    password,
    readyTimeout: 30000,
  });
  console.log("✅ 服务器连接成功！");

  // 1. 如果存在 ecosystem.config.cjs，同步配置文件
  if (fs.existsSync("ecosystem.config.cjs")) {
    console.log("📄 同步 PM2 配置文件 ecosystem.config.cjs...");
    await ssh.putFile("ecosystem.config.cjs", `${targetDir}/ecosystem.config.cjs`);
  }

  // 2. 上传构建产物包 (.output.tar.gz)
  const stats = fs.statSync(archiveName);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`📦 正在上传构建产物包 ${archiveName} (${sizeMB} MB)...`);
  await ssh.putFile(archiveName, `${targetDir}/${archiveName}`);
  console.log("✅ 产物包上传完成！正在远程执行原子切换与平滑重载...");

  // 3. 远程执行版本备份、解压原子替换、PM2 重载与健康检查
  const remoteCommand = `
    set -euo pipefail
    cd ${targetDir}

    # 加载 Node 24 与 PM2 环境变量
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
      . "$NVM_DIR/nvm.sh"
    fi
    export PATH="/root/.nvm/versions/node/v24.21.0/bin:$HOME/.nvm/current/bin:$PATH"

    # 1. 自动快照备份当前运行版本（保留最近 3 个历史备份）
    if [ -d ".output" ]; then
      mkdir -p backups
      BACKUP_DIR="backups/output_$(date +%Y%m%d_%H%M%S)"
      echo "==> 创建版本备份: $BACKUP_DIR"
      cp -r .output "$BACKUP_DIR"
      cd backups && (ls -td output_* 2>/dev/null || true) | tail -n +4 | xargs -r rm -rf && cd ..
    fi

    # 2. 解压新产物至临时提取目录
    echo "==> 正在解压新版本构建产物..."
    rm -rf .output_extract
    mkdir -p .output_extract
    tar -zxf ${archiveName} -C .output_extract
    rm -f ${archiveName}

    # 3. 目录原子替换（避免覆盖过程导致访问中断）
    rm -rf .output_old
    [ -d ".output" ] && mv .output .output_old
    mv .output_extract/.output ./
    rm -rf .output_extract .output_old

    # 4. 权限规范化
    chown -R www:www .output
    chmod -R 755 .output

    # 5. PM2 零停机平滑重载 (Zero Downtime)
    echo "==> 触发 PM2 平滑重载..."
    pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs

    # 6. 本地端口健康检查 (探测 3001 端口)
    sleep 3
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001 || true)
    echo "==> 健康检查状态码: HTTP $HTTP_CODE"
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
      echo "==> 恭喜！Gitee CI/CD 自动化部署成功上线！"
    else
      echo "==> [警告] 健康检查状态码异常: $HTTP_CODE，开始自动回滚至最新备份..."
      LATEST_BACKUP=$(ls -td backups/output_* 2>/dev/null | head -n 1 || true)
      if [ -n "$LATEST_BACKUP" ] && [ -d "$LATEST_BACKUP" ]; then
        rm -rf .output
        cp -r "$LATEST_BACKUP" .output
        pm2 reload ecosystem.config.cjs --update-env || true
        echo "==> 已回滚至 $LATEST_BACKUP"
      fi
      exit 1
    fi
  `;

  const result = await ssh.execCommand(remoteCommand);
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);

  if (result.code !== 0) {
    console.error(`❌ 远程部署失败，退出码: ${result.code}`);
    process.exit(1);
  }

  console.log("🎉 自动化部署全部顺利完成！");
  ssh.dispose();
}

run().catch((err) => {
  console.error("❌ 部署异常:", err);
  process.exit(1);
});
