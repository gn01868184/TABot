# 助教機器人

目前功能如下
1. 使用 Node.js 連接 Dialogflow 連接 FaceBook
2. FaceBook Messager 常設選單完成
3. 透過 FaceBook Messager 添加審核內容至試算表
4. 透過試算表更新 Entities

## 安裝說明

### Firebase CLI
1. 創建 [Dialogflow Agent](https://console.dialogflow.com/)
2. `git clone https://github.com/gn01868184/TABot`
3. `cd` 到 `functions` 資料夾
4. npm 安裝
  + `npm install`
  + `npm install -g firebase-tools`
  + `npm install actions-on-google`
  + `npm install googleapis@39 --save`
  + `npm install --save firebase`
  + `npm install neo4j-driver`
5. 登入您的 Google 帳戶 `firebase login`
6. 添加你的專案 $ `firebase use <project ID>`
  + project ID 在 Dialogflow **Settings** ⚙ > **General** tab > copy **Project ID**.
7. 執行 `firebase deploy --only functions:dialogflowFirebaseFulfillment`
8. 成功執行可以從 **Project Console** 的連結 > **Functions** > **Dashboard**
  + 複製連結，例： `https://us-central1-<PROJECTID>.cloudfunctions.net/<FUNCTIONNAME>`
9. 回到 **Dialogflow** > **Fulfillment** > **貼上** Webhook.
10. 貼上網址 **URL** > **Save**.
