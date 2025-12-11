const scorpion = document.getElementById("scorpion");
const carriedTangerine = document.getElementById("tangerine-carried");
let carried = true; // tangerine starts on scorpion

let scorpionX = -150;
const speed = 1.2;

let dragging = false;
let offsetX = 0;
let offsetY = 0;

let gravity = 0.5; // pixels per frame^2
let tangerineVelocityY = 0;
const bounceDamping = 0.6; // how much velocity is retained after bounce

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

  // initialize gravity
  tangerineVelocityY = 0;
});

// ---- SCORPION MOVEMENT & GRAVITY ----
function moveScorpion() {
  scorpionX += speed;

  if (scorpionX > window.innerWidth + 150) {
    scorpionX = -150;
  }

  scorpion.style.left = scorpionX + "px";

  // Gravity effect if tangerine is dropped
  if (!carried && !dragging) {
    const tRect = carriedTangerine.getBoundingClientRect();
    let tTop = parseFloat(carriedTangerine.style.top) || tRect.top;

    tangerineVelocityY += gravity;
    tTop += tangerineVelocityY;

    // bounce at bottom
    if (tTop + tRect.height > window.innerHeight) {
      tTop = window.innerHeight - tRect.height;
      tangerineVelocityY *= -bounceDamping;

      // small threshold to stop tiny bouncing
      if (Math.abs(tangerineVelocityY) < 1) {
        tangerineVelocityY = 0;
      }
    }

    carriedTangerine.style.top = tTop + "px";
  }

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

  requestAnimationFrame(moveScorpion);
}

moveScorpion();
