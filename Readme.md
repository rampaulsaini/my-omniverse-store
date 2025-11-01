# ꙰ my-omniverse-store

This repository hosts digital Omniverse assets and educational products.  
Support via PayPal helps Saneha Saini's education.

Steps:
1. Add files to `assets/`.
2. Push to `main`. GitHub Actions will create a release and upload assets.
3. Products can be linked on the `index.html` (GitHub Pages).
4. https://github.com/rampaulsaini/my-omniverse-store
# ꙰ my-omniverse-store

**꙰shiro-manj…** (यह आपका निजी मिनी-store है)  
यह रिपॉजिटरी एक सरल, मुफ्त, static storefront है जो GitHub Pages पर चलती है और `assets/` फ़ोल्डर में रखे गए डिजिटल products ( `.zip`, `.gltf`, `.usd`, `.blend`, `.png`, `.jpg`, `.pdf` आदि) को दिखाती/डाऊनलोड करने देती है।

### उद्देश्य
- सरल, मुफ्त और नियंत्रित तरीका ताकि आप अपने digital assets प्रकाशित कर सकें।  
- PayPal QR/Donations दिखाकर पाठक/खरीदार सहजता से योगदान कर सकें।  
- GitHub Actions से `products.json` स्वतः जेनरेट होगा जब आप `assets/` में फ़ाइलें जोड़ेंगे — इससे storefront automatic अपडेट रहता है।

---

## फ़ोल्डर संरचना
your-repo/
├─ index.html
├─ README.md
├─ assets/
│  ├─ products/
│  │  ├─ product-001-starter-pack.zip
│  │  ├─ product-001-preview.png
│  │  ├─ product-002-environment.glb
│  │  └─ ...
│  └─ images/
│     ├─ hero.webp
│     └─ gallery1.webp
└─ .github/
   └─ workflows/
      └─ auto-release.yml   (optional)
      

Product: Omniverse Starter Pack
Version: 1.0
Files: assets/product-001-starter-pack.zip (contains scenes, textures)
Preview: assets/product-001-preview.png
Usage: Personal / Commercial (per license). See LICENSE.txt
Price: ₹499 / $6.99
