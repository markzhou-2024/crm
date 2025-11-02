# 美业CRM 小程序

基于微信小程序 + 云开发（Cloud Functions）骨架，按“医疗美容/高端极简/白金金色”主题。

## 运行
1. 用微信开发者工具打开本仓库根目录。
2. 选择“云开发”启用环境，并在 **project.config.json** 中填入你的 appid。
3. 右键 cloudfunctions 目录选择‘上传并部署：云端安装依赖’。
4. 本地调试：直接点击‘预览/真机调试’。

## 目录
- cloudfunctions/（云函数：usage-stats）
- pages/home、customer/list、purchase/list、usage/list
- styles/theme.wxss（全局主题）
- app.js / app.json / app.wxss / project.config.json

## CI/质量
- ESLint + Prettier 统一风格
- GitHub Actions：Lint、占位构建、gitleaks 泄露扫描

## 体验版上传（可选）
在仓库 Secrets 配置：WEAPP_APPID、WEAPP_PRIVATE_KEY、WEAPP_VERSION、WEAPP_DESC，工作流会用 wechat-miniprogram-ci 自动上传。
