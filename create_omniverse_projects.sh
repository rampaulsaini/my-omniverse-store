#!/usr/bin/env bash
set -e
echo "🚀 Supreme Omniverse Projects Auto-Creation Started..."

BASE="./projects"
mkdir -p "$BASE"

declare -A PROJECTS
PROJECTS["oci"]="Omniverse Core Intelligence|NISP: Nishpaksh Intelligence Synthesis Protocol;ULM: Universal Logic Matrix;EOS: Eternal Observation System;COSMIC OS Framework"
PROJECTS["dhe"]="Divine Human Evolution|Consciousness Resonance Field;Spiritual Physics Mapping;Soul Frequency Database;Bio-Energy Amplification Model"
PROJECTS["ocn"]="Omniverse Communication Network|Quantum Message Protocol;Universal Data Translator;Global Harmony Network;Telepathic Bridge Research"
PROJECTS["ere"]="Earth Restoration & Ecology|Hydro-Purification Wave Engine;Solar Memory Cells;Atmos Rebalance Algorithm;Bio-Eco Pulse Tracker"
PROJECTS["ssr"]="Supreme Scientific Research|Time-Energy Continuum Study;Reality Equation Model;Anti-Entropy Stabilizer;Quantum-Spirit Interface"
PROJECTS["oea"]="Omniverse Education & Awareness|Truth Literacy Initiative;Global Knowledge Grid;AI-Ethics Training Core;Holistic Learning Platform"
PROJECTS["sgj"]="Supreme Governance & Justice|Universal Justice Equation;Moral Quantum Balance;Truth Audit System;Supreme Citizen Framework"
PROJECTS["cesr"]="Cosmic Exploration & Space Research|Inter-Dimensional Navigation System;Gravity Neutral Propulsion (concept);Stellar Memory Storage;Quantum Field Observation Unit"
PROJECTS["chgp"]="Cultural Harmony & Global Peace|Universal Art Integration;Harmony Music Project;Peace Communication Protocol;Global Unity Festival"
PROJECTS["slda"]="Supreme Legacy & Digital Archives|Eternal Knowledge Vault;Digital Memory Preservation;Legacy Transfer Protocol;Golden Record Database"

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[:\/]//g' | sed 's/ /-/g' | sed 's/[^a-z0-9\-]//g'
}

for key in "${!PROJECTS[@]}"; do
  IFS='|' read -r title subs <<< "${PROJECTS[$key]}"
  proj_dir="$BASE/$key"
  mkdir -p "$proj_dir"

  # Project main page
  cat > "$proj_dir/index.html" <<HTML
<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title} — Supreme Omniverse</title>
<meta name="description" content="${title} - Detailed project page under Supreme Omniverse.">
<style>
:root{--gold:#ffd700;--bg:#080808;}
body{margin:0;font-family:'Poppins',sans-serif;background:linear-gradient(180deg,#050505,#0a0a0a);color:var(--gold)}
.container{max-width:960px;margin:30px auto;padding:20px;border-radius:20px;border:1px solid rgba(255,215,0,0.2)}
a.btn{display:inline-block;margin:6px;padding:8px 12px;color:var(--gold);text-decoration:none;border:1px solid rgba(255,215,0,0.3);border-radius:10px}
.card{background:rgba(255,215,0,0.05);padding:14px;border-radius:12px;margin-top:15px}
</style>
</head>
<body>
<div class="container">
  <h1>${title}</h1>
  <p>यह पृष्ठ <strong>${title}</strong> परियोजना का मुख्य केंद्र है। नीचे Sub-Projects देखें:</p>
  <div class="card">
    <h3>Sub-Projects</h3>
    <ul>
HTML

  # Subpages
  IFS=';' read -ra subarr <<< "$subs"
  for sub in "${subarr[@]}"; do
    subslug=$(slugify "$sub")
    echo "      <li><a class='btn' href='${subslug}.html'>$sub</a></li>" >> "$proj_dir/index.html"

    # Create subpage
    cat > "$proj_dir/${subslug}.html" <<SUBHTML
<!doctype html>
<html lang="hi">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${sub} — ${title}</title>
<meta name="description" content="${sub} research under ${title} project.">
<style>:root{--gold:#ffd700;}
body{margin:0;font-family:'Poppins',sans-serif;background:#050505;color:var(--gold)}
.wrap{max-width:900px;margin:30px auto;padding:20px}
a.btn{display:inline-block;margin:6px;padding:8px 12px;color:var(--gold);text-decoration:none;border:1px solid rgba(255,215,0,0.3);border-radius:10px}
.card{background:rgba(255,215,0,0.05);padding:14px;border-radius:12px;margin-top:15px}
</style></head>
<body>
<div class="wrap">
  <h1>${sub}</h1>
  <div class="card">
    <h3>Parent Project: ${title}</h3>
    <p>यह उप-परियोजना ${title} के अंतर्गत है। यहाँ अपने शोध डेटा, Drive Links, और Validation Details जोड़ें।</p>
  </div>
  <div style="text-align:center;margin-top:20px">
    <a class="btn" href="index.html">⬅ Back to ${title}</a>
    <a class="btn" href="../../">🏠 Back to Omniverse Store</a>
  </div>
</div>
</body>
</html>
SUBHTML
  done

  # Close project page
  cat >> "$proj_dir/index.html" <<HTML
    </ul>
  </div>
</div>
</body>
</html>
HTML
done

echo "✅ All 10 Projects & 40 Sub-Pages Created Successfully!"
echo "📁 Upload the 'projects/' folder into your GitHub repo root (my-omniverse-store)"
echo "🌐 Then open: https://rampaulsaini.github.io/my-omniverse-store/projects/"
