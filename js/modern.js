/* Progressive enhancement for the refreshed BrandFlow interface. */
(() => {
 const descriptions = {connect: ['Your platforms, connected. Your information, in sync.', '01 / 04'], think: ['Practical intelligence. Better-informed decisions.', '02 / 04'], automate: ['Less repetitive work. More time for what matters.', '03 / 04'], grow: ['A stronger foundation for your next stage of growth.', '04 / 04']};
 document.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-flow]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
  const [description, index] = descriptions[button.dataset.flow];
  document.getElementById('flow-description').textContent = description;
  document.querySelector('.bf-system-bottom > span:last-child').textContent = index;
 }));
 document.addEventListener('keydown', event => {
  const toggle = document.getElementById('nav-toggle');
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
   document.getElementById('nav-menu').classList.remove('show');
   toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
  }
 });
})();
