# Simurg Reader 前端项目 Git 工作流与提交规范

本规范旨在统一团队日常开发分支管理、提交信息格式与发布流转机制，避免历史无用分支冗余、冲突难以追踪及代码丢失等问题。

---

## 一、 分支管理规范 (Branching Strategy)

### 1. 核心分支说明

| 分支类型 | 分支名称 | 职责定位 | 维护规则 |
| :--- | :--- | :--- | :--- |
| **生产主干** | `master` | 对应生产环境稳定代码。 | **受保护分支**。禁止直接 push 未经测试的代码；只允许通过 PR/MR 或完成验收后合入；必须保持随时可部署状态。 |
| **功能开发** | `feature/<模块或版本>` | 用于新功能、新特性或迭代周期的开发。 | 从最新的 `master` 切出；命名推荐如 `feature/ai-companion`、`feature/v1.1`；开发测试完成并合入主干后**必须删除**。 |
| **缺陷修复** | `fix/<问题描述>` | 常规缺陷或非紧急 Bug 修复。 | 从 `master` 切出；修复验证通过后合入主干并删除。 |
| **紧急热修** | `hotfix/<版本号或问题>` | 生产环境突发高危紧急 Bug 修复。 | 直接基于生产当前对应节点切出；修复并上线后，必须同时同步回 `master`。 |

> [!WARNING]
> **严禁随意在分支名称中追加随意时间戳**（例如类似 `feature-1.0-20250912`）：
> - 临时时间戳分支极易导致团队成员误以为是主干，从而发生错误合并；
> - 如需对某特定历史快照或发版节点进行永久存档，**必须使用 Git Tag**（标签），严禁使用常驻分支充当快照。

---

## 二、 提交信息规范 (Commit Message Conventions)

项目遵循 **Conventional Commits** 规范，统一提交信息格式：

```text
<type>(<scope>): <subject>

[optional body: 详细说明改动动机、上下文及影响范围]

[optional footer: 关联的 Issue 或 BREAKING CHANGE 说明]
```

### 1. Type 常用类型清单

| Type | 说明 | 示例 |
| :--- | :--- | :--- |
| **feat** | 新增功能 (feature) | `feat(chat): 集成「司木」AI伴读对话助手` |
| **fix** | 修复 Bug | `fix(reader): 修复目录抽屉在移动端横向溢出问题` |
| **perf** | 性能优化 (不影响逻辑，提升速度/减少消耗) | `perf(image): 首页轮播图采用 WebP 格式并增加懒加载` |
| **style** | 代码格式变动 (空格、分号、排版，不影响运行) | `style(tokens): 规范设计系统颜色变量命名格式` |
| **refactor**| 代码重构 (既不是新功能也不是修复 Bug) | `refactor(auth): 抽离登录状态鉴权逻辑至独立 composable` |
| **docs** | 文档更新 (README、接口规范、流程说明等) | `docs: 新增 Git 工作流与提交规范指南` |
| **ci** | CI/CD 与部署流水线脚本改动 | `ci: 优化 Gitee Go 流水线并集成自动归档部署` |
| **chore** | 构建流程、辅助依赖或配置变动 | `chore: 升级 pinia 依赖至最新版本` |
| **revert** | 回退历史提交 | `revert: 回退 commit 6390ee6 ("fix: xxx")` |

### 2. 提交规范红线
- ❌ **严禁使用无意义词汇**：如 `update`、`modify`、`test`、`fix bug`、`111` 等。
- ❌ **严禁多件事混在一个 Commit**：避免“改了业务 + 顺便格式化了10个无关文件 + 升级依赖”混在一起。
- ✅ **动宾结构清晰简练**：用中文准确陈述“修改了什么，解决了什么”。

---

## 三、 日常开发标准操作流 (Step-by-Step)

### 步骤 1：开新分支前，先同步主干
```bash
# 切换到 master
git checkout master

# 拉取最新代码
git pull origin master
```

### 步骤 2：基于主干创建并切换到特性分支
```bash
# 分支命名：feature/<功能名>
git checkout -b feature/user-profile
```

### 步骤 3：本地开发与规范提交
```bash
# 查看修改状态
git status

# 暂存目标文件
git add pages/user/profile.vue

# 规范提交
git commit -m "feat(user): 新增用户个人资料编辑与头像上传"
```

### 步骤 4：保持与主干同步（防止后期大面积冲突）
在开发周期较长时，应定期将主干最新更新合入特性分支：
```bash
# 拉取主干最新动态到本地 master
git fetch origin master

# 在特性分支上进行合并或变基
git merge origin/master
# 或: git rebase origin/master
```

### 步骤 5：提交前本地构建自检
提交 PR 或合入前，务必在本地运行预检命令，确保没有编译或类型错误：
```bash
npx nuxt prepare
# 或
npm run build
```

### 步骤 6：合入主干与删除废弃分支
当特性分支在测试环境完成验证后：
```bash
# 1. 切换回 master
git checkout master
git pull origin master

# 2. 合并特性分支（建议生成显式 merge commit 保留功能完整边界）
git merge feature/user-profile --no-ff -m "feat: 合并 user-profile 功能模块"

# 3. 部署验证通过后，清理已完成的历史特性分支
git branch -d feature/user-profile              # 删除本地分支
git push origin --delete feature/user-profile   # 删除远端分支
```

---

## 四、 里程碑与版本归档规范 (Tag 管理)

如需对特定上线版本或历史阶段进行存档保留，**一律使用 Git Tag**：

```bash
# 1. 创建附注标签（推荐）
git tag -a v1.0.0 -m "release: 司木阅读器 1.0.0 正式上线版本"

# 2. 推送标签到远程仓库
git push origin v1.0.0

# 3. 查看所有标签
git tag -l
```

---

## 五、 冲突解决与生产安全原则

1. **先预检，后合入**：在合并复杂分支前，先比对两分支差异（`git log --oneline --left-right branchA...branchB`）。
2. **业务逻辑优先**：解决冲突时，严禁盲目覆盖他人代码。若不确定逻辑关联，必须向改动作者当面/在线确认。
3. **保持可回滚**：主干保持每一次合并都是一个独立的原子操作，以便在发生线上突发异常时能快速使用 `git revert` 优雅回滚。
