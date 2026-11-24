import './styles.css';

// --- issue: #268
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add('theme-transition');
  });
});
