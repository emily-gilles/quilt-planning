(() => {
  // Constants for sizes in inches
  const bedSizes = {
    twin: [68, 86],
    full: [84, 90],
    queen: [90, 96],
    king: [106, 96],
  };

  const throwSizes = {
    small: [50, 65],
    medium: [60, 70],
    large: [70, 80],
  };

  // DOM elements
  const form = document.getElementById("quiltForm");
  const steps = form.querySelectorAll(".step-section");
  const stepIndicatorSpans = document.querySelectorAll("#stepIndicator .step");

  // Step 1 elements
  const purposeRadios = form.elements["purpose"];
  const purposeError = document.getElementById("purposeError");

  // Step 2 elements
  const bedSizeSection = document.getElementById("bedSizeSection");
  const throwSizeSection = document.getElementById("throwSizeSection");
  const bedSizeSelect = form.elements["bedSize"];
  const overhangSelect = form.elements["overhang"];
  const throwSizeSelect = form.elements["throwSize"];
  const bedSizeError = document.getElementById("bedSizeError");
  const overhangError = document.getElementById("overhangError");
  const throwSizeError = document.getElementById("throwSizeError");

  // Step 3 elements
  const blockSizeRadios = form.elements["blockSize"];
  const customBlockSizeInput = document.getElementById("customBlockSizeInput");
  const customBlockSizeLabel = document.getElementById("customBlockSizeLabel");
  const blockSizeError = document.getElementById("blockSizeError");
  const customBlockSizeError = document.getElementById("customBlockSizeError");
  const sashingSelect = document.getElementById("sashingSelect");
  const borderSelect = document.getElementById("borderSelect");
  const sashingError = document.getElementById("sashingError");
  const borderError = document.getElementById("borderError");

  // Step 4 elements
  const planSummary = document.getElementById("planSummary");
  const sizesBeforeAssembly = document.getElementById("sizesBeforeAssembly");
  const quiltVisual = document.getElementById("quiltVisual");

  // Buttons
  const toSizeBtn = document.getElementById("toSizeBtn");
  const backToPurposeBtn = document.getElementById("backToPurposeBtn");
  const toDesignBtn = document.getElementById("toDesignBtn");
  const backToSizeBtn = document.getElementById("backToSizeBtn");
  const createPlanBtn = document.getElementById("createPlanBtn");
  const editPlanBtn = document.getElementById("editPlanBtn");
  const copyPlanBtn = document.getElementById("copyPlanBtn");

  let currentStep = 0;

  // Utility: show/hide helpers
  const show = (el) => (el.style.display = "");
  const hide = (el) => (el.style.display = "none");

  // Show step by index, update step indicator
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("hidden", i !== index);
      stepIndicatorSpans[i].classList.toggle("active", i === index);
    });
    currentStep = index;
  }

  // Validate Step 1: Purpose
  function validateStep1() {
    const selectedPurpose = Array.from(purposeRadios).find((r) => r.checked);
    if (!selectedPurpose) {
      purposeError.classList.remove("hidden");
      return false;
    }
    purposeError.classList.add("hidden");
    return true;
  }

  // Show Step 2 fields based on purpose
  function updateStep2Fields() {
    const selectedPurpose = Array.from(purposeRadios).find((r) => r.checked)?.value;
    if (selectedPurpose === "bed") {
      bedSizeSection.classList.remove("hidden");
      overhangSelect.parentElement.style.display = "";
      throwSizeSection.classList.add("hidden");
    } else if (selectedPurpose === "throw") {
      bedSizeSection.classList.add("hidden");
      overhangSelect.parentElement.style.display = "none";
      throwSizeSection.classList.remove("hidden");
    } else {
      bedSizeSection.classList.add("hidden");
      overhangSelect.parentElement.style.display = "none";
      throwSizeSection.classList.add("hidden");
    }
  }

  // Validate Step 2
  function validateStep2() {
    const selectedPurpose = Array.from(purposeRadios).find((r) => r.checked)?.value;
    if (selectedPurpose === "bed") {
      if (!bedSizeSelect.value) {
        bedSizeError.classList.remove("hidden");
        return false;
      }
      bedSizeError.classList.add("hidden");

      if (!overhangSelect.value) {
        overhangError.classList.remove("hidden");
        return false;
      }
      overhangError.classList.add("hidden");
    } else if (selectedPurpose === "throw") {
      if (!throwSizeSelect.value) {
        throwSizeError.classList.remove("hidden");
        return false;
      }
      throwSizeError.classList.add("hidden");
    } else {
      return false;
    }
    return true;
  }

  // Validate Step 3
  function validateStep3() {
    const blockSizeValue = Array.from(blockSizeRadios).find((r) => r.checked)?.value;
    if (!blockSizeValue) {
      blockSizeError.classList.remove("hidden");
      return false;
    }
    blockSizeError.classList.add("hidden");

    if (blockSizeValue === "custom") {
      const val = customBlockSizeInput.value.trim();
      const num = Number(val);
      if (!val || isNaN(num) || num < 1 || num > 100) {
        customBlockSizeError.classList.remove("hidden");
        return false;
      }
      customBlockSizeError.classList.add("hidden");
    } else {
      customBlockSizeError.classList.add("hidden");
    }

    if (!sashingSelect.value) {
      sashingError.classList.remove("hidden");
      return false;
    }
    sashingError.classList.add("hidden");

    if (!borderSelect.value) {
      borderError.classList.remove("hidden");
      return false;
    }
    borderError.classList.add("hidden");

    return true;
  }

  // Show/hide custom block size input
  function handleBlockSizeChange() {
    const blockSizeValue = Array.from(blockSizeRadios).find((r) => r.checked)?.value;
    if (blockSizeValue === "custom") {
      show(customBlockSizeInput);
      show(customBlockSizeLabel);
      customBlockSizeInput.setAttribute("required", "true");
    } else {
      hide(customBlockSizeInput);
      hide(customBlockSizeLabel);
      customBlockSizeInput.removeAttribute("required");
      customBlockSizeError.classList.add("hidden");
      customBlockSizeInput.value = "";
    }
  }

  // Calculate quilt plan
  function calculateQuiltPlan() {
    const selectedPurpose = Array.from(purposeRadios).find((r) => r.checked).value;

    let quiltWidth = 0,
      quiltHeight = 0;

    if (selectedPurpose === "bed") {
      const bedSizeKey = bedSizeSelect.value;
      const bedDim = bedSizes[bedSizeKey];
      const overhangInches = overhangSelect.value ? parseInt(overhangSelect.value, 10) : 0;
      quiltWidth = bedDim[0] + 2 * overhangInches;
      quiltHeight = bedDim[1] + 2 * overhangInches;
    } else if (selectedPurpose === "throw") {
      const throwSizeKey = throwSizeSelect.value;
      const throwDim = throwSizes[throwSizeKey];
      quiltWidth = throwDim[0];
      quiltHeight = throwDim[1];
    }

    let blockSizeValue = Array.from(blockSizeRadios).find((r) => r.checked).value;
    if (blockSizeValue === "custom") {
      blockSizeValue = Number(customBlockSizeInput.value);
    } else {
      blockSizeValue = Number(blockSizeValue);
    }

    const sashingWidth = sashingSelect.value === "None" ? 0 : Number(sashingSelect.value);
    const borderWidth = borderSelect.value === "None" ? 0 : Number(borderSelect.value);

    const availableWidth = quiltWidth - 2 * borderWidth;
    const availableHeight = quiltHeight - 2 * borderWidth;

    let blocksHoriz = Math.floor((availableWidth + sashingWidth) / (blockSizeValue + sashingWidth));
    let blocksVert = Math.floor((availableHeight + sashingWidth) / (blockSizeValue + sashingWidth));

    const totalBlocks = blocksHoriz * blocksVert;

    const actualWidth =
      blocksHoriz * blockSizeValue + (blocksHoriz - 1) * sashingWidth + 2 * borderWidth;
    const actualHeight =
      blocksVert * blockSizeValue + (blocksVert - 1) * sashingWidth + 2 * borderWidth;

    return {
      selectedPurpose,
      quiltWidth,
      quiltHeight,
      blockSize: blockSizeValue,
      sashingWidth,
      borderWidth,
      blocksHoriz,
      blocksVert,
      totalBlocks,
      actualWidth,
      actualHeight,
    };
  }

  // Render summary text
  function renderSummary(plan) {
    const purposeStr = plan.selectedPurpose === "bed" ? "Bed Quilt" : "Throw Blanket";
    return `
Purpose: ${purposeStr}
Finished Quilt Size: ${plan.actualWidth.toFixed(1)}" wide x ${plan.actualHeight.toFixed(1)}" high
Block Size (finished): ${plan.blockSize}" square
Sashing Width: ${plan.sashingWidth}" 
Border Width: ${plan.borderWidth}" 
Blocks Across: ${plan.blocksHoriz}
Blocks Down: ${plan.blocksVert}
Total Blocks Needed: ${plan.totalBlocks}

*Note:* Sizes include sashing and border. Actual size may vary slightly due to block construction.
    `.trim();
  }

  // Render visual grid of quilt blocks and borders
  function renderVisual(plan) {
    const totalRows = plan.blocksVert + 2 * plan.borderWidth > 0 ? plan.blocksVert + 2 : plan.blocksVert + 2;
    const totalCols = plan.blocksHoriz + 2;

    // We'll build a grid: first and last row & col are border, inside are blocks and sashings
    // But for simplicity, we just show blocks with sashing and border visually.

    // Setup grid
    quiltVisual.innerHTML = "";
    const gridCols = plan.blocksHoriz * 2 + 1;
    const gridRows = plan.blocksVert * 2 + 1;

    quiltVisual.style.display = "grid";
    quiltVisual.style.gridTemplateColumns = `repeat(${gridCols}, 30px)`;
    quiltVisual.style.gridTemplateRows = `repeat(${gridRows}, 30px)`;
    quiltVisual.style.justifyContent = "center";

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const cell = document.createElement("div");

        // Even rows and even cols are border or block
        if (r % 2 === 0 && c % 2 === 0) {
          // Block
          cell.className = "quilt-block";
          cell.style.backgroundColor = "#f3f3f3";
          cell.style.borderColor = "#ccc";
        } else if (r % 2 === 0 || c % 2 === 0) {
          // Sashing or border (dark color)
          cell.className = "border-strip";
        } else {
          // intersection sashings (small square)
          cell.className = "border-strip";
        }
        quiltVisual.appendChild(cell);
      }
    }
  }

  // Copy plan summary to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      () => alert("Plan copied to clipboard!"),
      () => alert("Failed to copy plan.")
    );
  }

  // Event listeners

  toSizeBtn.addEventListener("click", () => {
    if (validateStep1()) {
      updateStep2Fields();
      showStep(1);
    }
  });

  backToPurposeBtn.addEventListener("click", () => {
    showStep(0);
  });

  toDesignBtn.addEventListener("click", () => {
    if (validateStep2()) {
      showStep(2);
    }
  });

  backToSizeBtn.addEventListener("click", () => {
    showStep(1);
  });

  // Block size radios change event to show/hide custom input
  Array.from(blockSizeRadios).forEach((radio) =>
    radio.addEventListener("change", () => {
      handleBlockSizeChange();
    })
  );

  createPlanBtn.addEventListener("click", () => {
    if (validateStep3()) {
      const plan = calculateQuiltPlan();
      planSummary.textContent = renderSummary(plan);
      sizesBeforeAssembly.textContent = `Original Quilt Size Before Assembly: ${plan.quiltWidth}" wide × ${plan.quiltHeight}" high`;

      renderVisual(plan);

      showStep(3);
    }
  });

  editPlanBtn.addEventListener("click", () => {
    showStep(0);
  });

  copyPlanBtn.addEventListener("click", () => {
    copyToClipboard(planSummary.textContent);
  });

  // Initialization
  showStep(0);
  handleBlockSizeChange();
})();

