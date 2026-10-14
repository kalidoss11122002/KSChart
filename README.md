# KSChat 🛰️
Code-based messaging + photos + video call. Works over ANY internet link: mobile data, WiFi or satellite internet (Starlink-type dish).

## Run
1. Install Node.js (18+). In this folder: `npm install` then `node server.js`
2. Same WiFi: open `http://<computer-IP>:3000` on both phones. Each phone gets a code.
3. Type the other person's code, then send message / photo / call.

## Internet-la irundhu use panna (real use)
- Server-a oru VPS/cloud-la host pannunga (Render, Railway, Fly.io) with **HTTPS**. Camera/mic browser-la HTTPS-la thaan work aagum (localhost thavira).
- Satellite internet (CGNAT) la video call-ku **TURN server** venum (coturn). `index.html`-la `ICE` list-la add pannunga.

## Offline behaviour
- Net illama type panna message/photo phone-la save aagi, net vandha udane anuppum.
- Receiver offline na server-la save aagum (memory-la only; server restart na poidum).
- Video call rendu perum online-la irukkanum.

## Limits (mukkiyam)
- Login/password illa, code theriyuravanga yaarum message anuppalaam. Real use-ku authentication serkkanum.
- Messages encrypted illa (HTTPS mattum). Private use-ku end-to-end encryption serkkanum.
- Phone signal/satellite illama direct-a anuppa mudiyaadhu: app-ku oru internet link venum.

## App-ah install panna (PWA)
1. Server-a HTTPS-oda host pannunga (Render/Railway/Fly.io). HTTP-la install option varaadhu.
2. Phone Chrome-la andha link open pannunga, menu -> **Install app / Add to Home Screen**.
3. Home screen-la KSChat icon varum, app maari full screen-la open aagum. Net illamayum app thorakkum, messages queue aagum.
4. iPhone: Safari -> Share -> **Add to Home Screen**.
Play Store APK venumna: Capacitor (`npx cap add android`) vechu wrap pannalaam, Android Studio venum.
