@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  background-color: #0a1120;
  color: #f4f7fa;
}

body {
  font-family: var(--font-body);
}

::selection {
  background: #c9a227;
  color: #0a1120;
}

.scoreboard-text {
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}

.flap {
  border-bottom: 1px solid rgba(244, 247, 250, 0.06);
}

.flap:last-child {
  border-bottom: none;
}

.status-dot {
  box-shadow: 0 0 0 3px currentColor / 15%;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #25314a;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
