function generatePlan() {
  const bedSizeValue = document.querySelector('input[name="bed-size"]:checked').value;
  const bedSize = bedSizeValue.split("x");
  const bedWidth = parseInt(bedSize[0]);
  const bedLength = parseInt(bedSize[1]);
  const overhang = parseFloat(document.getElementById("overhang").value);
  const blockSize = parseFloat(document.getElementById("block-size").value);
  const sashing = parseFloat(document.getElementById("sashing").value);
  const border = parseFloat(document.getElementById("border").value);

  const totalWidth = bedWidth + overhang * 2;
  const totalLength = bedLength + overhang * 2;

  const finishedBlock = blockSize + sashing;
  const blocksAcross = Math.round(totalWidth / finishedBlock);
  const blocksDown = Math.round(totalLength / finishedBlock);

  const quiltWidth = (blocksAcross * finishedBlock) - sashing + border * 2;
  const quiltLength = (blocksDown * finishedBlock) - sashing + border * 2;

  const output = `
    <h2>Your plan</h2>
    <p>You will need <strong>${blocksAcross * blocksDown}</strong> square quilt blocks (${blocksAcross} x ${blocksDown}).</p>
    <ul>
      <li>Finished quilt: ${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</li>
      <li>Finished blocks: ${blockSize}" x ${blockSize}"</li>
      <li>Sashing: ${sashing}"</li>
      <li>Border: ${border}"</li>
    </ul>
  `;
  document.getElementById("output").innerHTML = output;
}

