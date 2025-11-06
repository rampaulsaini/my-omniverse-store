# Admin upload instructions (mobile-friendly)

1. In Google Drive: create folders:
   - /Yatharth/audio/previews   (10s mp3 files; public)
   - /Yatharth/audio/full       (full audiobooks; keep private until purchase)

2. For each audio:
   - Upload preview (10s) to previews folder → Share → "Anyone with link" → Copy link → get fileId (between /d/ and /view)
   - Upload full audio to full folder (keep private or restricted)

3. Create CSV (id,title,fileId,price,previewSec,buyLink)
   - Use Google Sheets on mobile → Export CSV → use csv-to-json script or paste into data/items.json via GitHub web UI.

4. For manual delivery:
   - After buyer pays (GPay/UPI/PayPal), share full-file link to buyer via Drive (change file link to "Anyone with link" or share directly to buyer email)
   - 
