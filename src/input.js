const pressed = new Set();
const justPressed = new Set();

window.addEventListener('keydown', (e) => {
  if (!pressed.has(e.code)) {
    justPressed.add(e.code);
  }
  pressed.add(e.code);
});

window.addEventListener('keyup', (e) => {
  pressed.delete(e.code);
});

export function isPressed(code) {
  return pressed.has(code);
}

export function wasJustPressed(code) {
  return justPressed.has(code);
}

export function clearJustPressed() {
  justPressed.clear();
}
