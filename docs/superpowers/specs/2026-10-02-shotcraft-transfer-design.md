# video-shotcraft 能力迁移设计(brief + explainer + brief-check)

日期:2026-10-02。
状态:已确认,直接实施(用户豁免 writing-plans)。

## 背景

`/Users/rio/repos/opensource-refs/video-shotcraft` 是一个宣传片制作 skill 库(157 张镜头配方卡 + 判例式审美准则)。
本 repo 的链路是 visual-brief-design(导演,出分镜 brief)-> 各 explainer(引擎,落 Remotion 代码)-> brief-check(忠实度校验)。
本次把 shotcraft 中"导演语义层"的内容迁给 visual-brief-design,"实现配方层"的内容迁给 explainer,校验词表同步给 brief-check。

## 已确认的决策

- 范围:全量(brief 侧 10 项 + explainer 侧配方 + brief-check 同步)。
- 结构:**master + 副本**(theme-catalog 同构)。master 在 `skills/motion-recipes.md`,副本进各 explainer 的 `references/motion-recipes.md`,逐字拷贝,改配方只改 master 再同步副本。
- brief 侧嵌入方式:**方案 A 扩充式**——现有词表保留为基础档,新词作高级档追加,旧 brief 完全兼容。
- 类型冲突处理:不搬"宁慢勿快"整体节奏哲学(与"信息轰炸"对立,片种不同),只搬不冲突的条目。
- 不做:音效/卡点体系、截图采集管线、3D 配方参数、自动化同步脚本。

## 改动清单

### visual-brief-design/SKILL.md(扩充式)

1. 转场词表:基础三式(硬切/滑动/淡入)之外加高级四式——穿窗(总览→深讲)/虚焦接力(同系统区块切换)/黑场字卡(章节分段)/甩镜转场(强转折)。附规则:一接缝一式、转场帧从相邻镜头预算划走、出入方向连续。
2. 隐藏动词表加两行:划重点类→定格标注(freeze+圈注);快速过一遍类→变速(快→慢窗→快)。
3. 镜头语言表加两行:crash-zoom 急推(节奏冲击,配滞后偏移);侧掠(物动镜不动,长横排内容,与横移正交)。
4. 出场动效库 stagger 条目改写:等间隔→加速错峰(间隔递减+收尾静止 0.5s+物理隐喻)。
5. 焦点控制表加一行:划重点→freeze+圈注。
6. 场景约束加两条:hold/rest 帧预算前置;整画面级冲击(stamp 砸屏/震屏/闪帧)全片 ≤3 处。
7. 段落级节奏结构:收束可选"合影式收尾"(全片代表元素各出一个飞入合围结论字标,能量峰值)。
8. 新增「文字两态」小节:要读/纹理,无中间态,未标默认要读。
9. 推近 1.3x 放宽:矢量不受限;位图经引擎高清栅格化(见 motion-recipes)后可超。
10. 自检清单加 5 条对应项。

### skills/motion-recipes.md(新建 master)

定位:导演给语义词,本文件给实现配方(参数/曲线/命门),风格无关,引擎差分条目内标注。
内容分五组:入场(stagger 加速错峰/rush-in)、强调(定格标注/变速/crash-zoom)、镜头(侧掠/缩放清晰度)、转场高级四式+通用规则、画质纪律(光效/有效字高/确定性渲染)。
每条注明 shotcraft 判例来源。

### 各 explainer

- doodle / sticker(同构,全套):SKILL.md 实现原则 4 转场扩四式、第 1 步 stagger/焦点/镜头映射行更新+文字两态 bullet、第 5 步渲染自检加字高+确定性两条、文件导航加行;style-guide 时序语法加批量加速错峰、动画语法加高级动效指针、禁止项加确定性渲染、交付要求加字高验收;references/motion-recipes.md 副本。
- modern-tech / dark-botanical(轻量):SKILL.md 实现原则加一行高级动效指针、文件导航加行;references/motion-recipes.md 副本。
- hand-drawn(尚无 SKILL.md):仅放 references/motion-recipes.md 副本备用。

### brief-check/SKILL.md

- 第 7 条镜头:加 crash-zoom/侧掠;推近 1.3x 措辞放宽(位图栅格化后可超)。
- 第 2 条动作匹配示例加 freeze 定格标注。
- 新增转场匹配检查项(基础三式+高级四式)。
- 新增第 11 条(整画面级冲击 ≤3 处)、第 12 条(文字两态:纹理字应明显淡化)。
- 校验清单速记同步。

## 验证

- 两份(doodle/sticker)副本与 master diff 为空;modern-tech/dark-botanical/hand-drawn 副本同。
- grep 新词(穿窗/虚焦接力/黑场字卡/甩镜/定格标注/crash-zoom/侧掠/加速错峰/有效字高/两态)在 brief、各 explainer、brief-check 中出现且语义一致。
- 同步 ~/.agents/skills/ 六个目录(visual-brief-design/doodle/sticker/modern-tech/dark-botanical/brief-check)。
