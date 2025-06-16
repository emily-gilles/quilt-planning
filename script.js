function generatePlan() {
  const bedSize = document.getElementById("bed-size").value.split("x");
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
    <h2>Your Plan</h2>
    <p>You will need <strong>${blocksAcross * blocksDown}</strong> square quilt blocks (${blocksAcross} across by ${blocksDown} down).</p>
    <ul>
      <li><strong>Finished quilt size:</strong> ${quiltWidth.toFixed(1)}" x ${quiltLength.toFixed(1)}"</li>
      <li><strong>Finished square quilt block size:</strong> ${blockSize}"</li>
      <li><strong>Sashing:</strong> ${sashing}"</li>
      <li><strong>Border:</strong> ${border}"</li>
    </ul>
  `;
  document.getElementById("output").innerHTML = output;
}

