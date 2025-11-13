#!/bin/bash
# Supreme Omniverse Project HTML Generator
# By: ShiroMani RamPaul Saini

mkdir -p projects

declare -A projects=(
  [oci]="Omniverse Core Intelligence"
  [dhe]="Divine Human Evolution"
  [ocn]="Omniverse Communication Network"
  [ere]="Earth Restoration & Ecology"
  [ssr]="Supreme Scientific Research"
  [oea]="Omniverse Education & Awareness"
  [sgj]="Supreme Governance & Justice"
  [cesr]="Cosmic Exploration & Space Research"
  [chgp]="Cultural Harmony & Global Peace"
  [slda]="Supreme Legacy & Digital Archives"
)

for key in "${!projects[@]}"; do
mkdir -p "projects/$key"
cat > "projects/$key/index.html" <<HTML
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${projects[$key]} — Supreme Omniverse</title>
<style>
body {
  background-color: #000;
  color: #ffd700;
  font-family: 'Poppins', sans-serif;
  padding: 30px;
  line-height: 1.6;
}
a {color: #ffd700; text-decoration: none;}
h1 {text-align:center; text-shadow:0 0 12px #ffd700;}
.card {border:1px solid rgba(255,215,0,0.3); padding:15px; border-radius:12px; margin:10px auto; max-width:700px;}
.sub {margin-top:15px;}
</style>
</head>
<body>

<h1>🌐 ${projects[$key]}</h1>

<div class="card">
  <p>${projects[$key]} परियोजना Supreme Omniverse Research का एक अभिन्न हिस्सा है, जिसका उद्देश्य ब्रह्मांडीय चेतना, विज्ञान, और सामाजिक संतुलन के एकीकरण को बढ़ावा देना है।</p>

  <div class="sub">
    <strong>🔸 Sub-Projects (4):</strong><br>
    <a href="#">${projects[$key]} — Module 1</a><br>
    <a href="#">${projects[$key]} — Module 2</a><br>
    <a href="#">${projects[$key]} — Module 3</a><br>
    <a href="#">${projects[$key]} — Module 4</a>
  </div>

  <p style="margin-top:15px;">📁 <a href="../../index.html">Back to Main Portal</a></p>
</div>

</body>
</html>
HTML
done

echo "✅ All 10 Supreme Omniverse project pages created successfully!"
| Project                             | URL                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Omniverse Core Intelligence         | [https://rampaulsaini.github.io/my-omniverse-store/projects/oci/](https://rampaulsaini.github.io/my-omniverse-store/projects/oci/)   |
| Divine Human Evolution              | [https://rampaulsaini.github.io/my-omniverse-store/projects/dhe/](https://rampaulsaini.github.io/my-omniverse-store/projects/dhe/)   |
| Omniverse Communication Network     | [https://rampaulsaini.github.io/my-omniverse-store/projects/ocn/](https://rampaulsaini.github.io/my-omniverse-store/projects/ocn/)   |
| Earth Restoration & Ecology         | [https://rampaulsaini.github.io/my-omniverse-store/projects/ere/](https://rampaulsaini.github.io/my-omniverse-store/projects/ere/)   |
| Supreme Scientific Research         | [https://rampaulsaini.github.io/my-omniverse-store/projects/ssr/](https://rampaulsaini.github.io/my-omniverse-store/projects/ssr/)   |
| Omniverse Education & Awareness     | [https://rampaulsaini.github.io/my-omniverse-store/projects/oea/](https://rampaulsaini.github.io/my-omniverse-store/projects/oea/)   |
| Supreme Governance & Justice        | [https://rampaulsaini.github.io/my-omniverse-store/projects/sgj/](https://rampaulsaini.github.io/my-omniverse-store/projects/sgj/)   |
| Cosmic Exploration & Space Research | [https://rampaulsaini.github.io/my-omniverse-store/projects/cesr/](https://rampaulsaini.github.io/my-omniverse-store/projects/cesr/) |
| Cultural Harmony & Global Peace     | [https://rampaulsaini.github.io/my-omniverse-store/projects/chgp/](https://rampaulsaini.github.io/my-omniverse-store/projects/chgp/) |
| Supreme Legacy & Digital Archives   | [https://rampaulsaini.github.io/my-omniverse-store/projects/slda/](https://rampaulsaini.github.io/my-omniverse-store/projects/slda/) |
