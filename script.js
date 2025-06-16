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
    let bedName = ""; // Declare here to have broader scope

    // Determine total size
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

      // Define bedName mapping here
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

    // Inputs
    const blockSize = parseFloat(document.getElementById("block-size").value) || 0;
    const sashing = parseFloat(document.getElementById("sashing").value) || 0;
    const border = parseFloat(document.getElementById("border").value) || 0;

    // Calculations
    const finishedBlock = blockSize + sashing;
    const blocksAcross = Math.round(totalWidth / finishedBlock);
    const blocksDown = Math.round(totalLength / finishedBlock);
    const quiltWidth = blocksAcross * finishedBlock - sashing + border * 2;
    const quiltLength = blocksDown * finishedBlock - sashing + border * 2;

    // Cut sizes
    const cutBlockSize = (blockSize + 0.5).toFixed(1);
    const cutSashing = sashing > 0 ? (sashing + 0.5).toFixed(1) : null;
    const cutBorder = border > 0 ? (border + 0.5).toFixed(1) : null;

    const sashingLenIn =
      sashing > 0 ? (blocksAcross - 1) * quiltLength + (blocksDown - 1) * quiltWidth : null;
    const borderLenIn = border > 0 ? 2 * (quiltWidth + quiltLength) : null;
    const sashingLenYd = sashingLenIn != null ? (sashingLenIn / 36).toFixed(2) : null;
    const borderLenYd = borderLenIn != null ? (borderLenIn / 36).toFixed(2) : null;

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
} <h3>Finished quilt</h3><p>${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</p>`;


// Binding
const bindingLenIn = quiltWidth + quiltLength * 2 + 10;
const bindingLenYd = (bindingLenIn / 36).toFixed(2);

// Output HTML
let html = `<h2>Your plan</h2><p>${summary}</p>`;
html += `<h3>Blocks</h3><p>${blocksAcross * blocksDown} total blocks (${blocksAcross} across by ${blocksDown} down)<br>Cut to ${cutBlockSize}" x ${cutBlockSize}"</p>`;
if (cutSashing) {
  html += `<h3>Sashing</h3><p>Cut sashing to ${cutSashing}" wide<br>Length: ${sashingLenIn.toFixed(1)}” (${sashingLenYd} yards)</p>`;
}
if (cutBorder) {
  html += `<h3>Border</h3><p>Cut border to ${cutBorder}" wide<br>Length: ${borderLenIn.toFixed(1)}” (${borderLenYd} yards)</p>`;
}
html += `<h3>Binding</h3><p>Cut binding to 2.5" wide<br>Length: ${bindingLenIn.toFixed(1)}” (${bindingLenYd} yards)</p>`;


    // Inject and show
    const out = document.getElementById("output");
    out.innerHTML = html;
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    console.error(e);
    document.getElementById("output").innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
