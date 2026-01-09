const scorpion = document.getElementById("scorpion");
const carriedTangerine = document.getElementById("tangerine-carried");
const tangerineWorld = document.getElementById("tangerine-world");

let carried = true;
let dragging = false;

// Scorpion movement
let scorpionX = -150;
const speed = 1.2;

// Drag offsets
let offsetX = 0;
let offsetY = 0;

// Gravity
let falling = false;
let velocityY = 0;
const gravity = 0.6;

// --------------------
// DRAGGING
// --------------------
carriedTangerine.addEventListener("pointerdown", e => {
  if (!carried) return;

  carried = false;
  dragging = true;
  falling = false;
  velocityY = 0;

  // Move tangerine to world layer
  const rect = carriedTangerine.getBoundingClientRect();
  tangerineWorld.appendChild(carriedTangerine);

  carriedTangerine.style.position = "fixed";
  carriedTangerine.style.left = rect.left + "px";
  carriedTangerine.style.top = rect.top + "px";
  carriedTangerine.classList.add("tangerine-dragging");

  offsetX = e.offsetX;
  offsetY = e.offsetY;

  carriedTangerine.setPointerCapture(e.pointerId);
});

carriedTangerine.addEventListener("pointermove", e => {
  if (!dragging) return;

  carriedTangerine.style.left = (e.clientX - offsetX) + "px";
  carriedTangerine.style.top = (e.clientY - offsetY) + "px";
});

carriedTangerine.addEventListener("pointerup", () => {
  if (!dragging) return;

  dragging = false;
  falling = true;
  carriedTangerine.classList.remove("tangerine-dragging");
});

// --------------------
// GRAVITY LOOP
// --------------------
function applyGravity() {
  if (!falling) return;

  velocityY += gravity;

  let top = carriedTangerine.offsetTop + velocityY;
  const maxY = window.innerHeight - carriedTangerine.offsetHeight - 10;

  if (top >= maxY) {
    top = maxY;
    velocityY = 0;
    falling = false;
  }

  carriedTangerine.style.top = top + "px";
}

// --------------------
// SCORPION MOVEMENT + COLLISION
// --------------------
function moveScorpion() {
  scorpionX += speed;

  if (scorpionX > window.innerWidth + 150) {
    scorpionX = -150;
  }

  scorpion.style.left = scorpionX + "px";

  // Pickup check
  if (!carried && !dragging) {
    const tRect = carriedTangerine.getBoundingClientRect();
    const sRect = scorpion.getBoundingClientRect();

    const overlap = !(
      tRect.right < sRect.left ||
      tRect.left > sRect.right ||
      tRect.bottom < sRect.top ||
      tRect.top > sRect.bottom
    );

    if (overlap) {
      // Reattach to scorpion
      carried = true;
      falling = false;

      scorpion.appendChild(carriedTangerine);

      carriedTangerine.style.position = "absolute";
      carriedTangerine.style.left = "40px";
      carriedTangerine.style.top = "-10px";
    }
  }

  applyGravity();
  requestAnimationFrame(moveScorpion);
}

moveScorpion();
