// Firebase Configuration Template
// 复制此文件为 firebase-config.js 并填入你自己的 Firebase 项目配置

// 如何获取这些配置：
// 1. 访问 https://console.firebase.google.com/
// 2. 创建或选择一个项目
// 3. 进入项目设置 → 常规 → 你的应用
// 4. 复制 Firebase 配置对象

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// 重要提醒：
// 1. 在 Firebase Console → Authentication → Settings → Authorized domains
//    添加你的域名（如：yourdomain.com）
// 
// 2. 在 Firestore Database → Rules 设置安全规则：
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /users/{userId} {
//          allow read, write: if request.auth != null && request.auth.uid == userId;
//        }
//      }
//    }

