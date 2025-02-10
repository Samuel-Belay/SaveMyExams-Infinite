# Infinite SaveMyExams

A Tampermonkey script that automatically clears cookies, local storage, and session storage on **Save My Exams** (`https://www.savemyexams.com/`) every time you navigate to a new page. This ensures an **infinite** browsing experience without stored session data.

## 🚀 Features
- 🔄 **Clears all cookies, local storage, and session storage** automatically.
- 🔍 Works on both **traditional** and **Single Page Applications (SPAs)**.
- 🛠️ Uses **history API hooks** (`pushState`, `replaceState`, `popstate`) to detect navigation.
- ✅ Ensures your **session remains fresh** every time you visit a page.

## 📌 Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click the **Tampermonkey extension** icon and select **Create a new script**.
3. Replace the content with [this script](userscript.js).
4. Click **File → Save** (`Ctrl + S`).
5. Open [Save My Exams](https://www.savemyexams.com/) and enjoy unlimited resets!

## 🖥️ Usage
- The script **automatically runs** on every page load.
- It also works for **SPAs** (where navigation happens without full reloads).
- To check if it’s working, open **Developer Tools (`F12`) → Console** and look for "Clearing Cookies and Storage..."

## 📄 License
[Click here](LICENSE) to check the project's license.

---

### NOTE: This repository is purely in the interest of education and privacy. I'm not condoning or recommending piracy, bypassing legislated bans, or anything similiar. The implications of your actions are your own responsibility.
