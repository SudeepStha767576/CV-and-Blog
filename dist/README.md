# Sudip Shrestha — Personal Site

A static personal site (CV + blog). Pure HTML, CSS, and React via Babel-in-the-browser. No build step required.

## Files
- index.html — entry point
- styles-v5.css — all styles
- v5-app.jsx — main React app (Babel transpiled at runtime)
- tweaks-panel.jsx — design tweaks panel (only shown when host enables edit mode; safe to keep)
- bc-smtp-content.jsx — long-form blog post content
- assets/ — optimized avatar images (webp + jpg fallbacks)

## Deploy
Drop the entire folder onto any static host:
- **Netlify**: drag-drop in dashboard, or `netlify deploy --dir=.`
- **Vercel**: `vercel --prod` from this folder
- **GitHub Pages**: push to a repo, enable Pages on branch root
- **Cloudflare Pages**: connect repo or upload directly
- **Plain hosting**: upload by FTP / SFTP, point domain at folder

## Local preview
Any static server works — for example:
```
npx serve .
# or
python3 -m http.server 8000
```
Then open http://localhost:8000

## Customisation
All editable copy lives in v5-app.jsx (profile, timeline, skills, certs, blog list).
Theme tokens live at the top of styles-v5.css under `:root`.

## Notes
- Babel-in-browser is convenient but adds ~600 KB of script. For production you can pre-transpile v5-app.jsx with `npx babel --presets=@babel/preset-react v5-app.jsx` and remove the babel `<script>` tag from index.html.
- Fonts load from Google Fonts. To self-host, swap the `<link>` tags for local @font-face declarations.
