const scorpion = document.getElementById("scorpion");
const carriedTangerine = document.getElementById("tangerine-carried");
let carried = true; // tangerine starts on scorpion

let scorpionX = -150;
const speed = 1.2;

let dragging = false;
let activeTangerine = carriedTangerine;
let offsetX = 0;
let offsetY = 0;

// ---- DRAGGING ----
carriedTangerine.addEventListener("pointerdown", e => {
  if (!carried) return;
  dragging = true;
  carried = false;

  carriedTangerine.style.pointerEvents = "auto";
  offsetX = e.offsetX;
  offsetY = e.offsetY;

  carriedTangerine.setPointerCapture(e.pointerId);
});

carriedTangerine.addEventListener("pointermove", e => {
  if (!dragging) return;

  carriedTangerine.style.position = "absolute";
  carriedTangerine.style.left = (e.pageX - offsetX) + "px";
  carriedTangerine.style.top = (e.pageY - offsetY) + "px";
});

carriedTangerine.addEventListener("pointerup", e => {
  if (!dragging) return;
  dragging = false;

  carriedTangerine.style.pointerEvents = "auto";
  carriedTangerine.classList.add("tangerine-dropped");
});

// ---- SCORPION MOVEMENT ----
function moveScorpion() {
  scorpionX += speed;

  if (scorpionX > window.innerWidth + 150) {
    scorpionX = -150;
  }

  scorpion.style.left = scorpionX + "px";

  // check pickup collision
  if (!carried) {
    const tRect = carriedTangerine.getBoundingClientRect();
    const sRect = scorpion.getBoundingClientRect();

    const overlap = !(
      tRect.right < sRect.left ||
      tRect.left > sRect.right ||
      tRect.bottom < sRect.top ||
      tRect.top > sRect.bottom
    );

    if (overlap) {
      // Reattach tangerine
      carried = true;
      carriedTangerine.classList.remove("tangerine-dropped");

      carriedTangerine.style.position = "absolute";
      carriedTangerine.style.top = "-10px";
      carriedTangerine.style.left = "40px";
      scorpion.appendChild(carriedTangerine);
    }
  }

  requestAnimationFrame(moveScorpion);
}

moveScorpion();
