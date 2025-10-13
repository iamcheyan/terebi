# 🔒 安全说明 / Security Guide

## Firebase 配置安全

本项目使用 Firebase 作为后端服务。如果你想部署自己的版本，请注意以下安全事项：

### ⚠️ 重要警告

代码中的 Firebase 配置是**公开的**，但这是安全的，因为：

1. **授权域名限制**：只有在 Firebase 控制台中授权的域名才能使用登录功能
2. **Security Rules**：Firestore 安全规则限制了数据访问权限
3. **API Key 特性**：Firebase 的 API Key 设计就是公开的，不是传统意义的密钥

### 🛡️ 保护措施

#### 1. 授权域名设置

在 Firebase Console 中：
```
Authentication → Settings → Authorized domains
```

只添加你自己的域名：
- ✅ `localhost`（开发用）
- ✅ `yourdomain.com`（生产环境）
- ❌ 不要添加不信任的域名

#### 2. Firestore 安全规则

确保在 Firestore Database → Rules 中设置：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户只能访问自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == userId;
    }
  }
}
```

#### 3. 使用配额限制

在 Firebase Console → Usage and billing：
- 设置预算提醒
- 设置使用限制
- 监控异常流量

### 🚀 部署自己的版本

如果你想部署自己的版本：

#### 步骤 1：创建自己的 Firebase 项目

1. 访问 https://console.firebase.google.com/
2. 点击"创建项目"
3. 启用 Authentication（Google 登录）
4. 启用 Firestore Database

#### 步骤 2：获取配置

1. 进入项目设置 → 常规
2. 向下滚动到"你的应用"
3. 点击 Web 应用图标
4. 复制 Firebase 配置对象

#### 步骤 3：替换配置

在 `index.html` 中找到：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  // ... 替换为你自己的配置
};
```

#### 步骤 4：设置授权域名

在 Firebase Console 中添加你的域名：
```
Authentication → Settings → Authorized domains → Add domain
```

#### 步骤 5：设置安全规则

复制上面的 Firestore Security Rules 到你的项目中。

### 📊 监控和维护

定期检查：
- 使用量统计
- 活跃用户数
- 数据库大小
- 异常登录活动

### ❓ 常见问题

**Q: API Key 泄露了怎么办？**  
A: Firebase 的 API Key 设计就是公开的，真正的安全由授权域名和 Security Rules 控制。

**Q: 别人能用我的配置吗？**  
A: 如果他们的域名未授权，登录会失败。即使成功登录，也只能访问自己的数据。

**Q: 如何防止配额被滥用？**  
A: 设置使用限制和预算提醒，监控异常流量。

### 📞 支持

如有安全问题，请通过 GitHub Issues 联系。

---

最后更新：2025-01

