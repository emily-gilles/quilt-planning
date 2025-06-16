document.addEventListener("DOMContentLoaded", function () {
  const useRadios = document.querySelectorAll('input[name="use"]');
  const bedSizeGroup = document.getElementById("bed-size-group");
  const overhangGroup = document.getElementById("overhang-group");
  const throwSizeGroup = document.getElementById("throw-size-group");

  useRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const useValue = document.querySelector('input[name="use"]:checked').value;

      if (useValue === "Throw for couch") {
        bedSizeGroup.style.display = "none";
        overhangGroup.style.display = "none";
        throwSizeGroup.style.display = "block";
      } else {
        bedSizeGroup.style.display = "block";
        overhangGroup.style.display = "block";
        throwSizeGroup.style.display = "none";
      }

      document.getElementById("output").innerHTML = ""; // Clear output on change
    });
  });

  document.getElementById("generate-button").addEventListener("click", generatePlan);
});

function generatePlan() {
  try {
    const use = document.querySelector('input[name="use"]:checked')?.value || "";
    let totalWidth = 0;
    let totalLength = 0;
    let bedWidth = 0,
      bedLength = 0,
      overhang = 0;
    let throwSize = "";
    let bedName = "";

    // Determine total quilt size
    if (use === "Throw for couch") {
      const tsInput = document.querySelector('input[name="throw-size"]:checked');
      throwSize = tsInput?.value;
      const throwSizes = {
        small: [50, 40],
        standard: [60, 50],
        large: [70, 60],
        oversized: [80, 70],
      };

      if (!throwSizes[throwSize]) {
        document.getElementById("output").innerHTML =
          "<p>Please select a throw blanket size.</p>";
        return;
      }
      [totalWidth, totalLength] = throwSizes[throwSize];
    } else {
      const bedSizeInput = document.querySelector('input[name="bed-size"]:checked');
      if (!bedSizeInput) {
        document.getElementById("output").innerHTML = "<p>Please select a bed size.</p>";
        return;
      }
      [bedWidth, bedLength] = bedSizeInput.value.split("x").map(Number);

      const bedSizeMap = {
        "28x52": "crib",
        "38x75": "twin",
        "38x80": "twin XL",
        "54x75": "full",
        "60x80": "queen",
        "76x80": "king",
        "72x84": "california king",
      };
      const bedKey = `${bedWidth}x${bedLength}`;
      bedName = bedSizeMap[bedKey] || `${bedWidth} x ${bedLength}"`;

      overhang = parseFloat(document.getElementById("overhang").value) || 0;
      totalWidth = bedWidth + overhang * 2;
      totalLength = bedLength + overhang * 2;
    }

    // User Inputs
    const blockSize = parseFloat(document.getElementById("block-size").value) || 0;
    const sashing = parseFloat(document.getElementById("sashing").value) || 0;
    const border = parseFloat(document.getElementById("border").value) || 0;

    // Block layout
    const finishedBlock = blockSize + sashing;
    const blocksAcross = Math.round(totalWidth / finishedBlock);
    const blocksDown = Math.round(totalLength / finishedBlock);

    // Quilt top size (before borders)
    const topWidth = blocksAcross * finishedBlock - sashing;
    const topLength = blocksDown * finishedBlock - sashing;

    // Final quilt size (including borders)
    const quiltWidth = topWidth + border * 2;
    const quiltLength = topLength + border * 2;

    // Cutting sizes
    const cutBlockSize = (blockSize + 0.5).toFixed(1);
    const cutSashing = sashing > 0 ? (sashing + 0.5).toFixed(1) : null;
    const cutBorder = border > 0 ? (border + 0.5).toFixed(1) : null;

    // Yardage + strips (42" wide fabric)
    const WOF = 42;

    // Sashing
    const sashingLenIn =
      sashing > 0 ? (blocksAcross - 1) * quiltLength + (blocksDown - 1) * quiltWidth : null;
    const sashingLenYd = sashingLenIn != null ? (sashingLenIn / 36).toFixed(2) : null;
    const sashingStrips = sashingLenIn != null ? Math.ceil(sashingLenIn / WOF) : null;

    // Border
    const borderLenIn = border > 0 ? 2 * (topWidth + topLength) : null;
    const borderLenYd = borderLenIn != null ? (borderLenIn / 36).toFixed(2) : null;
    const borderStrips = borderLenIn != null ? Math.ceil(borderLenIn / WOF) : null;

    // Binding
    const bindingLenIn = 2 * (quiltWidth + quiltLength) + 10;
    const bindingLenYd = (bindingLenIn / 36).toFixed(2);
    const bindingStrips = Math.ceil(bindingLenIn / WOF);

    // Summary
    const summary = `You’re making a ${
      use === "Throw for couch"
        ? `${throwSize} throw blanket`
        : `cover for a ${bedName} (${bedWidth}" x ${bedLength}") bed`
    } with ${blockSize}" square blocks${
      sashing > 0 ? `, ${sashing}" sashing` : ""
    }${border > 0 ? `, and a ${border}" border` : ""}.${
      use !== "Throw for couch" && overhang > 0
        ? ` You want it to overhang the bed by ${overhang}."`
        : ""
    } 

    // Output
    let html = `<h2>Your plan</h2><span class="hint">${summary}</span>`;

     html += `<h3>Finished quilt</h3><p>${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</p>`;
    
    html += `<h3>Blocks</h3><p>${blocksAcross * blocksDown} total blocks (${blocksAcross} across by ${blocksDown} down)<br>Cut blocks to ${cutBlockSize}" x ${cutBlockSize}"</p>`;

    if (cutSashing) {
      html += `<h3>Sashing</h3><p>Cut sashing strips to ${cutSashing}" wide<br>Total length: ${sashingLenIn.toFixed(
        1
      )}” (${sashingLenYd} yards)<br>You’ll need ${sashingStrips} strips from 42" wide fabric</p>`;
    }

    if (cutBorder) {
      html += `<h3>Border</h3><p>Cut border strips to ${cutBorder}" wide<br>Total length: ${borderLenIn.toFixed(
        1
      )}” (${borderLenYd} yards)<br>You’ll need ${borderStrips} strips from 42" wide fabric</p>`;
    }

    html += `<h3>Binding</h3><p>Cut binding strips to 2.5" wide<br>Total length: ${bindingLenIn.toFixed(
      1
    )}” (${bindingLenYd} yards)<br>You’ll need ${bindingStrips} strips from 42" wide fabric</p>`;

    const out = document.getElementById("output");
    out.innerHTML = html;
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    console.error(e);
    document.getElementById("output").innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
