document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const purposeRadios = document.querySelectorAll('input[name="purpose"]');
  const bedOptions = document.getElementById("bed-options");
  const throwOptions = document.getElementById("throw-options");
  const stepLabels = document.querySelectorAll(".usa-step-indicator__segment");

  function showStep(stepNumber) {
    steps.forEach((step, index) => {
      if (index === stepNumber - 1) {
        step.classList.remove("hidden");
        stepLabels[index].classList.add("usa-current");
      } else {
        step.classList.add("hidden");
        stepLabels[index].classList.remove("usa-current");
      }
    });
  }

  purposeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      showStep(2);

      if (this.value === "bed") {
        bedOptions.classList.remove("hidden");
        throwOptions.classList.add("hidden");
      } else if (this.value === "throw") {
        throwOptions.classList.remove("hidden");
        bedOptions.classList.add("hidden");
      }
    });
  });

  document.querySelectorAll(".next-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const nextStep = parseInt(this.getAttribute("data-next"));
      showStep(nextStep);
    });
  });

  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const backStep = parseInt(this.getAttribute("data-back"));
      showStep(backStep);
    });
  });

  // Initialize on step 1
  showStep(1);
});
