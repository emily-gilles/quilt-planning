document.addEventListener("DOMContentLoaded", function () {
  const quiltUse = document.getElementById("quilt-use");
  const bedSizeGroup = document.getElementById("bed-size-group");
  const overhangGroup = document.getElementById("overhang-group");
  const throwSizeGroup = document.getElementById("throw-size-group");

  quiltUse.addEventListener("change", function () {
    const useValue = quiltUse.value;

    if (useValue === "throw") {
      bedSizeGroup.style.display = "none";
      overhangGroup.style.display = "none";
      throwSizeGroup.style.display = "block";
    } else {
      bedSizeGroup.style.display = "block";
      overhangGroup.style.display = "block";
      throwSizeGroup.style.display = "none";
    }

    document.getElementById("output").innerHTML = ""; // Clear output when switching
  });

  document.getElementById("generate-button").addEventListener("click", generatePlan);
});

function generatePlan() {
  const use = document.getElementById("quilt-use").value;
  let totalWidth = 0;
  let totalLength = 0;

  if (use === "throw") {
    const throwSize = document.getElementById("throw-size").value;
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

  const output = `
    <h2>Your plan</h2>
    <p>You will need ${blocksAcross * blocksDown} total blocks (${blocksAcross} across by ${blocksDown} down).</p>
    <ul>
      <li>Finished quilt: ${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</li>
      <li>Finished blocks: ${blockSize}" x ${blockSize}"</li>
      <li>Sashing: ${sashing}"</li>
      <li>Border: ${border}"</li>
    </ul>
  `;
  document.getElementById("output").innerHTML = output;
} 


