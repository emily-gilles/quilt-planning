// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quilt-form");

  // Step elements
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  // Navigation buttons
  const toStep2Btn = document.getElementById("to-step-2");
  const toStep3Btn = document.getElementById("to-step-3");
  const backToStep1Btn = document.getElementById("back-to-step-1");
  const backToStep2Btn = document.getElementById("back-to-step-2");
  const createPlanBtn = document.getElementById("create-plan");

  // Conditional sections in Step 2
  const bedQuestions = document.getElementById("bed-questions");
  const throwQuestions = document.getElementById("throw-questions");

  // Step 3 elements
  const customBlockRadio = document.getElementById("block-custom");
  const customBlockSizeWrapper = document.getElementById("custom-block-size-wrapper");
  const customBlockSizeInput = document.getElementById("custom-block-size");

  // Result section
  const quiltPlanSection = document.getElementById("quilt-plan");
  const planSummary = document.getElementById("plan-summary");
  const planDetails = document.getElementById("plan-details");
  const planSizes = document.getElementById("plan-sizes");
  const quiltVisual = document.getElementById("quilt-visual");

  const editPlanBtn = document.getElementById("edit-plan");
  const copyPlanBtn = document.getElementById("copy-plan");

  // Error message elements
  const bedSizeError = document.getElementById("bed-size-error");
  const overhangError = document.getElementById("overhang-error");
  const throwSizeError = document.getElementById("throw-size-error");
  const blockSizeError = document.getElementById("block-size-error");
  const customBlockSizeError = document.getElementById("custom-block-size-error");
  const sashingError = document.getElementById("sashing-error");
  const borderError = document.getElementById("border-error");

  // Utility: Show/hide elements
  function show(el) {
    el.classList.remove("hidden");
  }
  function hide(el) {
    el.classList.add("hidden");
  }

  // Step 1 validation and show Step 2
  toStep2Btn.addEventListener("click", () => {
    // Validate Step 1 - use
    const use = form.elements["use"].value;
    if (!use) {
      alert("Please select how you will use the quilt.");
      return;
    }

    // Show Step 2, hide Step 1
    hide(step1);
    show(step2);

    // Show relevant Step 2 questions
    if (use === "bed") {
      show(bedQuestions);
      hide(throwQuestions);
      // Mark bed-size and overhang required for bed
      form.elements["bed-size"].forEach(input => input.required = true);
      form.elements["overhang"].required = true;
      form.elements["throw-size"].forEach(input => input.required = false);
    } else if (use === "throw") {
      hide(bedQuestions);
      show(throwQuestions);
      // Mark throw-size required for throw
      form.elements["throw-size"].forEach(input => input.required = true);
      form.elements["bed-size"].forEach(input => input.required = false);
      form.elements["overhang"].required = false;
    }
  });

  backToStep1Btn.addEventListener("click", () => {
    hide(step2);
    show(step1);
  });

  // Step 2 validation and show Step 3
  toStep3Btn.addEventListener("click", () => {
    const use = form.elements["use"].value;

    // Validate based on use
    let valid = true;
    if (use === "bed") {
      // Bed size radio
      const bedSize = Array.from(form.elements["bed-size"]).find(r => r.checked);
      if (!bedSize) {
        show(bedSizeError);
        valid = false;
      } else {
        hide(bedSizeError);
      }

      // Overhang select
      const overhang = form.elements["overhang"].value;
      if (!overhang) {
        show(overhangError);
        valid = false;
      } else {
        hide(overhangError);
      }

      // Throw size errors hidden
      hide(throwSizeError);
    } else if (use === "throw") {
      // Throw size radio
      const throwSize = Array.from(form.elements["throw-size"]).find(r => r.checked);
      if (!throwSize) {
        show(throwSizeError);
        valid = false;
      } else {
        hide(throwSizeError);
      }

      // Bed size errors hidden
      hide(bedSizeError);
      hide(overhangError);
    }

    if (!valid) return;

    // Show Step 3, hide Step 2
    hide(step2);
    show(step3);
  });

  backToStep2Btn.addEventListener("click", () => {
    hide(step3);
    show(step2);
  });

  // Show/hide custom block size input
  form.elements["block-size"].forEach(radio => {
    radio.addEventListener("change", () => {
      if (customBlockRadio.checked) {
        show(customBlockSizeWrapper);
        customBlockSizeInput.required = true;
      } else {
        hide(customBlockSizeWrapper);
        customBlockSizeInput.required = false;
        hide(customBlockSizeError);
      }
      hide(blockSizeError);
    });
  });

  // Form submission: validate Step 3 and show result
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate Step 3
    let valid = true;
    const blockSizeRadio = Array.from(form.elements["block-size"]).find(r => r.checked);
    if (!blockSizeRadio) {
      show(blockSizeError);
      valid = false;
    } else {
      hide(blockSizeError);
    }

    if (blockSizeRadio && blockSizeRadio.value === "custom") {
      const customVal = customBlockSizeInput.value;
      if (!customVal || isNaN(customVal) || customVal < 1 || customVal > 100) {
        show(customBlockSizeError);
        valid = false;
      } else {
        hide(customBlockSizeError);
      }
    } else {
      hide(customBlockSizeError);
    }

    // Validate sashing
    if (!form.elements["sashing"].value) {
      show(sashingError);
      valid = false;
    } else {
      hide(sashingError);
    }

    // Validate border
    if (!form.elements["border"].value) {
      show(borderError);
      valid = false;
    } else {
      hide(borderError);
    }

    if (!valid) return;

    // All validation passed - prepare and show quilt plan
    generatePlan();
  });

  // Generate quilt plan results
  function generatePlan() {
    const use = form.elements["use"].value;
    let quiltWidth, quiltHeight;

    if (use === "bed") {
      const bedSize = Array.from(form.elements["bed-size"]).find(r => r.checked).value;
      const overhang = Number(form.elements["overhang"].value);

      // Bed sizes in inches from typical values
      const bedSizes = {
        "Crib": { width: 28, height: 52 },
        "Twin": { width: 38, height: 75 },
        "Twin XL": { width: 38, height: 80 },
        "Full": { width: 54, height: 75 },
        "Queen": { width: 60, height: 80 },
        "King": { width: 76, height: 80 },
        "California King": { width: 72, height: 84 }
      };

      const bedDim = bedSizes[bedSize];

      quiltWidth = bedDim.width + overhang * 2;
      quiltHeight = bedDim.height + overhang * 2;
    } else if (use === "throw") {
      const throwSize = Array.from(form.elements["throw-size"]).find(r => r.checked).value;

      // Throw sizes in inches from typical values
      const throwSizes = {
        "Small": { width: 36, height: 48 },
        "Standard": { width: 50, height: 60 },
        "Large": { width: 60, height: 80 },
        "Oversized": { width: 70, height: 90 }
      };

      const throwDim = throwSizes[throwSize];

      quiltWidth = throwDim.width;
      quiltHeight = throwDim.height;
    }

    // Block size
    let blockSize;
    const blockSizeRadio = Array.from(form.elements["block-size"]).find(r => r.checked);
    if (blockSizeRadio.value === "custom") {
      blockSize = Number(customBlockSizeInput.value);
    } else {
      blockSize = Number(blockSizeRadio.value);
    }

    // Sashing and border widths
    const sashingWidth = parseFloat(form.elements["sashing"].value) || 0;
    const borderWidth = parseFloat(form.elements["border"].value) || 0;

    // Calculate number of blocks in width and height:
    // Quilt width = (blocks * blockSize) + (blocks -1) * sashing + 2 * border
    // Solve for blocks:
    // blocks = floor( (quiltWidth - 2 * border + sashing) / (blockSize + sashing) )

    const blocksAcross = Math.floor((quiltWidth - 2 * borderWidth + sashingWidth) / (blockSize + sashingWidth));
    const blocksDown = Math.floor((quiltHeight - 2 * borderWidth + sashingWidth) / (blockSize + sashingWidth));

    const totalBlocks = blocksAcross * blocksDown;

    // Actual quilt size with the calculated number of blocks:
    const actualWidth = blocksAcross * blockSize + (blocksAcross - 1) * sashingWidth + 2 * borderWidth;
    const actualHeight = blocksDown * blockSize + (blocksDown - 1) * sashingWidth + 2 * borderWidth;

    // Prepare output text
    planSummary.textContent = `You will need approximately ${totalBlocks} quilt blocks (${blocksAcross} across by ${blocksDown} down).`;
    planDetails.textContent = `Each block is ${blockSize}” finished. Sashing width: ${sashingWidth}”. Border width: ${borderWidth}”.`;
    planSizes.textContent = `The finished quilt will be about ${actualWidth.toFixed(1)}” wide and ${actualHeight.toFixed(1)}” tall.`;

    // Simple quilt visual (colored grid)
    drawQuiltVisual(blocksAcross, blocksDown, blockSize, sashingWidth, borderWidth);

    // Show result, hide form
    hide(form);
    show(quiltPlanSection);

    // Scroll to results
    quiltPlanSection.scrollIntoView({ behavior: "smooth" });
  }

  // Draw simple quilt visual using HTML inside #quilt-visual
  function drawQuiltVisual(cols, rows, blockSize, sash, border) {
    // Clear previous
    quiltVisual.innerHTML = "";

    const maxDimension = 400; // max pixels for width or height in visual
    // Calculate scale for visual representation
    const quiltWidthInches = cols * blockSize + (cols - 1) * sash + 2 * border;
    const quiltHeightInches = rows * blockSize + (rows - 1) * sash + 2 * border;
    const scale = Math.min(maxDimension / quiltWidthInches, maxDimension / quiltHeightInches);

    const visualWidth = quiltWidthInches * scale;
    const visualHeight = quiltHeightInches * scale;

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = visualWidth + "px";
    container.style.height = visualHeight + "px";
    container.style.border = "2px solid #333";
    container.style.backgroundColor = "#eee";
    container.style.margin = "0 auto";
    container.style.boxSizing = "border-box";

    // Draw border
    if (border > 0) {
      const borderDiv = document.createElement("div");
      borderDiv.style.position = "absolute";
      borderDiv.style.top = "0";
      borderDiv.style.left = "0";
      borderDiv.style.width = visualWidth + "px";
      borderDiv.style.height = visualHeight + "px";
      borderDiv.style.boxSizing = "border-box";
      borderDiv.style.border = `${border * scale}px solid #666`;
      container.appendChild(borderDiv);
    }

    // Draw blocks and sashings
    const blockAndSashWidth = (blockSize + sash) * scale;
    const sashPx = sash * scale;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const blockDiv = document.createElement("div");
        blockDiv.style.position = "absolute";
        blockDiv.style.width = blockSize * scale + "px";
        blockDiv.style.height = blockSize * scale + "px";
        blockDiv.style.top = border * scale + r * blockAndSashWidth + "px";
        blockDiv.style.left = border * scale + c * blockAndSashWidth + "px";
        blockDiv.style.backgroundColor = (r + c) % 2 === 0 ? "#cce5ff" : "#99ccff"; // alternating color
        blockDiv.style.borderRadius = "4px";
        blockDiv.style.boxSizing = "border-box";
        blockDiv.style.border = "1px solid #666";

        container.appendChild(blockDiv);
      }
    }

    quiltVisual.appendChild(container);
  }

  // Edit plan button: hide result, show form at step 3
  editPlanBtn.addEventListener("click", () => {
    hide(quiltPlanSection);
    show(form);
    hide(step1);
    hide(step2);
    show(step3);
  });

  // Copy plan button: copy plan summary, details, and sizes to clipboard
  copyPlanBtn.addEventListener("click", () => {
    const textToCopy = `${planSummary.textContent}\n${planDetails.textContent}\n${planSizes.textContent}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Quilt plan copied to clipboard!");
    }, () => {
      alert("Failed to copy quilt plan.");
    });
  });
});

