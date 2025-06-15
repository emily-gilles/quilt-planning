document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quilt-form");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  const planSection = document.getElementById("quilt-plan");
  const planSummary = document.getElementById("plan-summary");
  const planDetails = document.getElementById("plan-details");

  const bedSizeGroup = document.getElementById("bed-size-group");
  const overhangGroup = document.getElementById("overhang-group");
  const throwSizeGroup = document.getElementById("throw-size-group");

  const backToPurposeBtn = document.getElementById("backToPurpose");
  const saveAndContinueBtn = document.getElementById("saveAndContinueToDesign");
  const backToSizeBtn = document.getElementById("backToSize");
  const createPlanBtn = document.getElementById("createQuiltPlan");
  const editPlanBtn = document.getElementById("editPlan");
  const copyPlanBtn = document.getElementById("copyPlan");

  const blockCustomRadio = document.getElementById("block-custom");
  const customBlockSizeGroup = document.getElementById("custom-block-size-group");
  const customBlockSizeInput = document.getElementById("customBlockSize");

  // Show step 2 with correct sub-fields depending on purpose
  function updateStep2Fields() {
    const use = form.quiltUse.value;
    if (use === "bed") {
      bedSizeGroup.hidden = false;
      overhangGroup.hidden = false;
      throwSizeGroup.hidden = true;
    } else if (use === "throw") {
      bedSizeGroup.hidden = true;
      overhangGroup.hidden = true;
      throwSizeGroup.hidden = false;
    } else {
      bedSizeGroup.hidden = true;
      overhangGroup.hidden = true;
      throwSizeGroup.hidden = true;
    }
  }

  // Show/hide custom block size input
  function updateCustomBlockSize() {
    if (blockCustomRadio.checked) {
      customBlockSizeGroup.hidden = false;
    } else {
      customBlockSizeGroup.hidden = true;
      customBlockSizeInput.value = "";
      hideError("customBlockSizeError");
    }
  }

  // Show an error message by ID
  function showError(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  }
  // Hide error message by ID
  function hideError(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  // Validate Step 1: Purpose
  function validateStep1() {
    if (!form.quiltUse.value) {
      alert("Please select how you will use the quilt.");
      return false;
    }
    return true;
  }

  // Validate Step 2: Size
  function validateStep2() {
    const use = form.quiltUse.value;

    if (use === "bed") {
      if (!form.bedSize.value) {
        showError("bedSizeError");
        return false;
      } else {
        hideError("bedSizeError");
      }
      if (!form.overhang.value) {
        showError("overhangError");
        return false;
      } else {
        hideError("overhangError");
      }
    } else if (use === "throw") {
      if (!form.throwSize.value) {
        showError("throwSizeError");
        return false;
      } else {
        hideError("throwSizeError");
      }
    }
    return true;
  }

  // Validate Step 3: Design
  function validateStep3() {
    if (!form.blockSize.value) {
      showError("blockSizeError");
      return false;
    } else {
      hideError("blockSizeError");
    }
    if (blockCustomRadio.checked) {
      const val = Number(customBlockSizeInput.value);
      if (!val || val < 1 || val > 100) {
        showError("customBlockSizeError");
        return false;
      } else {
        hideError("customBlockSizeError");
      }
    }

    // Sashing and border can be empty (means none), so no validation error needed

    return true;
  }

  // Update step indicator UI
  function updateStepIndicator(currentStep) {
    const steps = document.querySelectorAll(".usa-step-indicator__segment");
    steps.forEach((step, idx) => {
      step.classList.remove("usa-step-indicator__segment--current");
      if (idx === currentStep - 1) step.classList.add("usa-step-indicator__segment--current");
    });
  }

  // Navigation handlers

  // From step 1 to step 2
  saveAndContinueBtn.addEventListener("click", () => {
    if (!validateStep1()) return;
    updateStep2Fields();
    step1.hidden = true;
    step2.hidden = false;
    step3.hidden = true;
    planSection.hidden = true;
    updateStepIndicator(2);
  });

  backToPurposeBtn.addEventListener("click", () => {
    step1.hidden = false;
    step2.hidden = true;
    step3.hidden = true;
    planSection.hidden = true;
    updateStepIndicator(1);
  });

  // From step 2 to step 3
  backToSizeBtn.addEventListener("click", () => {
    step1.hidden = true;
    step2.hidden = false;
    step3.hidden = true;
    planSection.hidden = true;
    updateStepIndicator(2);
  });

  // When block size radios change
  form.blockSize.forEach((radio) => {
    radio.addEventListener("change", updateCustomBlockSize);
  });

  // On form submit (step 3)
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStep3()) return;

    // Collect all data
    const use = form.quiltUse.value;

    let quiltWidth = 0;
    let quiltHeight = 0;

    if (use === "bed") {
      const bedSize = form.bedSize.value;
      const overhang = Number(form.overhang.value);

      // Standard bed sizes in inches width x height (approximate)
      const bedSizes = {
        Crib: { width: 28, height: 52 },
        Twin: { width: 39, height: 75 },
        "Twin XL": { width: 39, height: 80 },
        Full: { width: 54, height: 75 },
        Queen: { width: 60, height: 80 },
        King: { width: 76, height: 80 },
        "California King": { width: 72, height: 84 },
      };
      const size = bedSizes[bedSize];
      quiltWidth = size.width + overhang * 2;
      quiltHeight = size.height + overhang * 2;
    } else if (use === "throw") {
      const throwSize = form.throwSize.value;

      // Throw sizes in inches width x height (approximate)
      const throwSizes = {
        Small: { width: 36, height: 48 },
        Standard: { width: 50, height: 60 },
        Large: { width: 60, height: 80 },
        Oversized: { width: 72, height: 90 },
      };
      const size = throwSizes[throwSize];
      quiltWidth = size.width;
      quiltHeight = size.height;
    }

    // Block size
    let blockSizeInches = 0;
    if (form.blockSize.value === "custom") {
      blockSizeInches = Number(customBlockSizeInput.value);
    } else {
      blockSizeInches = Number(form.blockSize.value);
    }

    // Sashing and border
    const sashingWidth = Number(form.sashing.value) || 0;
    const borderWidth = Number(form.border.value) || 0;

    // Calculate number of blocks wide and tall
    // Quilt includes border, then blocks and sashing
    // total width = border*2 + (blocksWide * blockSize) + ((blocksWide -1) * sashing)
    // solve blocksWide by trial until total width >= quiltWidth
    function calcBlocks(dimension) {
      let blocks = 1;
      while (
        borderWidth * 2 +
          blocks * blockSizeInches +
          (blocks - 1) * sashingWidth <
        dimension
      ) {
        blocks++;
      }
      return blocks;
    }
    const blocksWide = calcBlocks(quiltWidth);
    const blocksTall = calcBlocks(quiltHeight);

    // Final quilt size in inches
    const finalWidth =
      borderWidth * 2 +
      blocksWide * blockSizeInches +
      (blocksWide - 1) * sashingWidth;
    const finalHeight =
      borderWidth * 2 +
      blocksTall * blockSizeInches +
      (blocksTall - 1) * sashingWidth;

    // Summary text
    planSummary.textContent = `Your quilt will be approximately ${finalWidth.toFixed(
      1
    )}” wide by ${finalHeight.toFixed(1)}” tall.`;

    // Details
    planDetails.innerHTML = `
      <strong>Quilt use:</strong> ${use === "bed" ? "Bed cover" : "Throw blanket"}<br />
      ${
        use === "bed"
          ? `<strong>Bed size:</strong> ${form.bedSize.value} with ${form.overhang.value}” overhang<br />`
          : `<strong>Throw size:</strong> ${form.throwSize.value}<br />`
      }
      <strong>Block size:</strong> ${blockSizeInches}” square<br />
      <strong>Blocks wide:</strong> ${blocksWide}<br />
      <strong>Blocks tall:</strong> ${blocksTall}<br />
      <strong>Sashing:</strong> ${sashingWidth ? sashingWidth + "”" : "None"}<br />
      <strong>Border:</strong> ${borderWidth ? borderWidth + "”" : "None"}
    `;

    step1.hidden = true;
    step2.hidden = true;
    step3.hidden = true;
    planSection.hidden = false;
    updateStepIndicator(3);
  });

  // Edit button to go back to step 1
  editPlanBtn.addEventListener("click", () => {
    step1.hidden = false;
    step2.hidden = true;
    step3.hidden = true;
    planSection.hidden = true;
    updateStepIndicator(1);
  });

  // Copy button copies plan summary and details to clipboard
  copyPlanBtn.addEventListener("click", () => {
    const textToCopy = `${planSummary.textContent}\n\n${planDetails.textContent}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Quilt plan copied to clipboard!");
    });
  });

  // Update step indicator initially
  updateStepIndicator(1);
});

