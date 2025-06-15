document.addEventListener("DOMContentLoaded", function () {
  const steps = ["step-1", "step-2", "step-3"];
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((id, i) => {
      document.getElementById(id).classList.toggle("hidden", i !== index);
    });
  }

  function getSelected(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
  }

  // Step 1 -> 2
  document.querySelectorAll('input[name="purpose"]').forEach(input => {
    input.addEventListener("change", () => {
      const value = input.value;
      document.getElementById("bed-options").classList.toggle("hidden", value !== "bed");
      document.getElementById("throw-options").classList.toggle("hidden", value !== "throw");
      showStep(1);
    });
  });

  document.getElementById("back-step-1").addEventListener("click", () => showStep(0));
  document.getElementById("next-step-2").addEventListener("click", () => showStep(2));
  document.getElementById("back-step-2").addEventListener("click", () => showStep(1));

  // Block size custom input
  document.querySelectorAll('input[name="block-size"]').forEach(input => {
    input.addEventListener("change", () => {
      document.getElementById("custom-block-wrapper").classList.toggle("hidden", input.value !== "custom");
    });
  });

  // Submit form
  document.getElementById("quilt-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const purpose = getSelected("purpose");
    const size = purpose === "bed" ? getSelected("bed-size") : getSelected("throw-size");
    const overhang = purpose === "bed" ? document.getElementById("overhang").value : null;
    const blockSize = getSelected("block-size") === "custom"
      ? document.getElementById("custom-block-size").value
      : getSelected("block-size");

    const sashing = document.getElementById("sashing").value;
    const border = document.getElementById("border").value;

    document.getElementById("quilt-summary-text").textContent = purpose === "bed"
      ? `You are making a quilt to fit a ${size} size bed with a ${overhang} overhang.`
      : `You are making a ${size} throw blanket.`;

    document.getElementById("quilt-plan-text").textContent = `
Finished quilt blocks: ${blockSize}”
Sashing: ${sashing}
Border: ${border}
Blocks needed: 20 (example only)
...

(More detailed plan to be implemented)
`;

    showStep(3);
    document.getElementById("quilt-result").classList.remove("hidden");
  });

  document.getElementById("edit-button").addEventListener("click", () => {
    document.getElementById("quilt-result").classList.add("hidden");
    showStep(2);
  });

  document.getElementById("copy-button").addEventListener("click", () => {
    const plan = document.getElementById("quilt-plan-text").textContent;
    navigator.clipboard.writeText(plan);
    alert("Quilt plan copied!");
  });
});
