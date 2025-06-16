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
  const use = document.querySelector('input[name="use"]:checked')?.value || "";
  let totalWidth = 0;
  let totalLength = 0;

  if (use === "Throw for couch") {
    const throwSizeInput = document.querySelector('input[name="throw-size"]:checked');
    const throwSize = throwSizeInput ? throwSizeInput.value : null;
    const throwSizes = {
      small: [50, 40],
      standard: [60, 50],
      large: [70, 60],
      oversized: [80, 70],
    };

    if (!throwSizes[throwSize]) {
      document.getElementById("output").innerHTML = "<p>Please select a throw blanket size.</p>";
      return;
    }

    [totalWidth, totalLength] = throwSizes[throwSize];
  } else {
    const bedSizeValue = document.querySelector('input[name="bed-size"]:checked');
    if (!bedSizeValue) {
      document.getElementById("output").innerHTML = "<p>Please select a bed size.</p>";
      return;
    }

    const bedSize = bedSizeValue.value.split("x");
    const bedWidth = parseInt(bedSize[0]);
    const bedLength = parseInt(bedSize[1]);
    const overhang = parseFloat(document.getElementById("overhang").value) || 0;

    totalWidth = bedWidth + overhang * 2;
    totalLength = bedLength + overhang * 2;
  }

  const blockSize = parseFloat(document.getElementById("block-size").value) || 0;
  const sashing = parseFloat(document.getElementById("sashing").value) || 0;
  const border = parseFloat(document.getElementById("border").value) || 0;

  const finishedBlock = blockSize + sashing;
  const blocksAcross = Math.round(totalWidth / finishedBlock);
  const blocksDown = Math.round(totalLength / finishedBlock);

  const quiltWidth = (blocksAcross * finishedBlock) - sashing + border * 2;
  const quiltLength = (blocksDown * finishedBlock) - sashing + border * 2;

  const cutBlockSize = (blockSize + 0.5).toFixed(1);
  const cutSashing = sashing > 0 ? (sashing + 0.5).toFixed(1) : null;
  const cutBorder = border > 0 ? (border + 0.5).toFixed(1) : null;

  const sashingLengthInches = sashing > 0
    ? ((blocksAcross - 1) * quiltLength) + ((blocksDown - 1) * quiltWidth)
    : null;

  const borderLengthInches = border > 0
    ? 2 * (quiltWidth + quiltLength)
    : null;

  // Convert inches to yards and round to 2 decimals
  const sashingLengthYards = sashingLengthInches !== null
    ? (sashingLengthInches / 36).toFixed(2)
    : null;

  const borderLengthYards = borderLengthInches !== null
    ? (borderLengthInches / 36).toFixed(2)
    : null;

  let output = `
  <h2>Your plan</h2>
  <p><strong>Use:</strong> ${use}<br>
  <strong>Block size:</strong> ${blockSize}"<br>
  <strong>Sashing:</strong> ${sashing}"<br>
  <strong>Border:</strong> ${border}"</p>

  <h3><strong>Blocks</strong></h3>
  <p>${blocksAcross * blocksDown} total blocks (${blocksAcross} across by ${blocksDown} down)<br>
  Cut to ${cutBlockSize}" x ${cutBlockSize}"</p>

  <h3><strong>Finished quilt</strong></h3>
  <p>${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</p>
`;

if (cutSashing) {
  output += `
    <h3><strong>Sashing</strong></h3>
    <p>Cut to ${cutSashing}" wide<br>
    Length: ${sashingLengthInches.toFixed(1)}” (${sashingLengthYards} yards)</p>
  `;
}

if (cutBorder) {
  output += `
    <h3><strong>Border</strong></h3>
    <p>Cut to ${cutBorder}" wide<br>
    Length: ${borderLengthInches.toFixed(1)}” (${borderLengthYards} yards)</p>
  `;
}

document.getElementById("output").innerHTML = output;

// Show and scroll to output
const outputEl = document.getElementById("output");
outputEl.style.display = "block";
outputEl.scrollIntoView({ behavior: "smooth" });


}
