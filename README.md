# ⚡ Aisling JS API v3.0 官方文档

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0-brightgreen)]()

> 本项目为 **Aisling JS API v3.0** 的完整接口参考手册。专为 Minecraft 模组脚本环境（如 ScriptEngine）设计，提供基于 JavaScript 的深度交互能力，涵盖实体操作、网络拦截、内存读写等高级功能。

## 📖 项目描述
- **适用场景**：Minecraft 模组开发、客户端脚本编写、自动化 bot 逻辑。
- **核心特性**：
  - 🧩 完整的事件监听系统（Tick、数据包、移动、攻击）
  - 👤 丰富的玩家信息查询与状态控制
  - 🗺️ 精确的坐标、旋转、运动向量操作
  - ⚔️ 实体交互（攻击、挥臂、列表检索）
  - 🧱 方块信息读取
  - 🌐 模拟玩家输入与数据包发送
  - 🔬 底层内存读写（高级功能）

---

## 📚 目录
1. [事件系统](#1-事件系统)
2. [玩家信息](#2-玩家信息)
3. [位置与运动](#3-位置与运动)
4. [实体操作](#4-实体操作)
5. [方块与计时器](#5-方块与计时器)
6. [网络与输入](#6-网络与输入)
7. [工具函数](#7-工具函数)
8. [高级内存操作](#8-高级内存操作)
9. [快速上手示例](#-快速上手示例)

---

## 1. 事件系统
核心操作函数：
- `registerEvent(eventName, callback)`：注册监听
- `unregisterEvent(eventName, callback)`：取消监听
- `clearAllEvents()`：清除所有事件

### 可用事件列表
| 事件名称 | 触发时机 | 回调参数 |
| :--- | :--- | :--- |
| `onActorTick` | 实体（Actor）Tick 更新 | `(actorPtr)` |
| `onSendPacket` | 发送数据包时 | `(packetPtr)` |
| `onMove` | 玩家移动时 | `(posObj)` |
| `onAttack` | 攻击实体时 | `(targetPtr)` |

*（注：回调参数通常为内存指针字符串，需配合内存 API 解析）*

---

## 2. 玩家信息
### 获取对象
- `getLocalPlayer()`：获取本地玩家指针
- `getPlayerByName(name)`：按名字查找玩家

### 属性读取
| 方法 | 返回值/描述 |
| :--- | :--- |
| `getName(ptr)` | 玩家名称 |
| `getHealth(ptr)` | 当前生命值 |
| `getMaxHealth(ptr)` | 最大生命值 |
| `getPlayerGameType(ptr)` | 游戏模式 ID |
| `getRuntimeID(ptr)` | 运行时唯一 ID |

### 状态判断 & 设置
- `isValid(ptr)`、`isRemotePlayer(ptr)`、`isOnGround(ptr)`
- `isInvisible(ptr)`、`canSee(ptr)`、`setPlayerGameType(ptr, mode)`
- **模式参数**：`0`=生存, `1`=创造, `2`=冒险, `3`=旁观

---

## 3. 位置与运动
| 方法 | 说明 |
| :--- | :--- |
| `getPos(ptr)` / `setPos(ptr, pos)` | 获取/设置坐标（支持 `{x,y,z}` 或数组 `[x,y,z]`） |
| `getRot(ptr)` / `setRot(ptr, rot)` | 获取/设置俯仰(pitch)与偏航(yaw) |
| `getMotion(ptr)` / `setMotion(ptr, vec)` | 获取/设置速度向量 |
| `applyTurnDelta(ptr, delta)` | 应用旋转增量 |

---

## 4. 实体操作
- `attack(ptr)`：攻击目标实体
- `swing(ptr)`：挥动手臂（客户端动画）
- `getActorList()`：获取当前所有实体的指针列表
- `getPlayerList()`：获取当前所有玩家的指针列表

---

## 5. 方块与计时器
### 方块查询
- `getBlock(pos)`：返回方块信息对象（包含 `id`、`name`、`isAir` 等属性）

### 计时器
- `setTimerSpeed(speed)`：设置游戏 TPS（默认 `20.0` 为正常速度）

---

## 6. 网络与输入
- `sendPlayerAuthInput(packetData)`：发送认证输入数据包（模拟移动/视角）
- `handleBuildOrAttackButtonPress(interact)`：模拟左键点击（`true`=开始, `false`=结束）

---

## 7. 工具函数
- `prompt(text)`：弹窗获取用户输入字符串
- `clientMessage(msg)`：在客户端右下角显示消息
- `evalPython(code)`：执行 Python 代码（需环境支持）

---

## 8. 高级内存操作
*（仅供高级用户使用，操作不当可能导致崩溃）*

| 方法 | 说明 |
| :--- | :--- |
| `GetBaseAddress(moduleName)` | 获取指定模块的基址 |
| `readMemory(addr, type)` | 读取内存（type: "int", "float", "string" 等） |
| `writeMemory(addr, value, type)` | 写入内存 |
| `add(addr, offset)` / `sub(addr, offset)` | 指针地址加减运算 |

---

## 🚀 快速上手示例
以下是一个简单的脚本示例，演示注册事件、获取玩家信息并发送消息：

```javascript
// 1. 注册 Tick 事件
registerEvent("onActorTick", function(actor) {
    if (!isValid(actor)) return;
    var pos = getPos(local);
    clientMessage("当前位置: " + pos.x + ", " + pos.y + ", " + pos.z);
});

// 4. 设置游戏速度为 1.5 倍
setTimerSpeed(30.0);

// 5. 模拟点击（示例）
// handleBuildOrAttackButtonPress(true);
// setTimeout(() => handleBuildOrAttackButtonPress(false), 100);