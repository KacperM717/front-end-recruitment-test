/* eslint-disable linebreak-style */
/* eslint-disable quotes */

const form = document.querySelector("#checkout form");
const checkoutInputs = form.querySelectorAll(":is(input, select)");
const submitBtn = form.querySelector("button[type=submit]");

// Cannot use event delegation - invalid event does not bubble up
checkoutInputs.forEach((input) => input.addEventListener("invalid", invalid));
form.addEventListener("input", resetInputError);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitOrder(submitBtn);
});

/**
 * Inform user when inputs are invalid
 * @param {InputEvent} event
 */
function invalid(event) {
  const parent = event.target.parentElement;
  parent.classList.add("error");
  const errorSpan = parent.querySelector(`.checkout-form-error`);
  const errors = mapValidation(event.target.validity).join("<br>");
  errorSpan.textContent = errors;
  console.log(event.target.name, event.target.validity);
}

/**
 * Reset error classes for input
 * @param {InputEvent} event
 */
function resetInputError(event) {
  const parent = event.target.parentElement;
  parent.classList.remove("error");
  const errorSpan = parent.querySelector(`.checkout-form-error`);
  errorSpan.textContent = "";
}

async function submitOrder(btn) {
  btn.textContent = "";
  pendingStateBtn(btn);

  const res = await mockOrder(2000);

  successStateBtn(btn);
}

function pendingStateBtn(btn) {
  btn.disabled = true;
  btn.style.setProperty("--icon-url", `url('../images/spinner.png')`);
  btn.classList.add("rotation-inf");
}

function successStateBtn(btn) {
  btn.disabled = false;
  btn.classList.remove("rotation-inf");
  btn.style.setProperty("--icon-url", `url('../images/success.png')`);
  btn.classList.add("whirly-1");
}

/**
 * Maps needed fields of ValidityState to user friendly messages
 * @param {ValidityState} state
 * @return {[]}
 */
function mapValidation(state) {
  const rules = [
    ["patternMismatch", "Provided value is not valid"],
    ["typeMismatch", "Incorrect format"],
    ["tooShort", "It is too short :("],
    ["tooLong", "It is too long :("],
    ["valueMissing", "Field is required"],
    ["valid", "Field is invalid"],
  ];
  return rules.filter(([name]) => state[name]).map(([_, msg]) => msg);
}

/**
 * Simple function for mocking request order
 * @param {number} time
 * @return {Promise}
 */
function mockOrder(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
