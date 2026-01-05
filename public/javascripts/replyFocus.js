document.addEventListener('show.bs.collapse', function (event) {
  const input = event.target.querySelector('.reply-input');
  if (input) {
    const username = event.target.dataset.username;
    if (username) input.value = `@${username} `;
    input.focus();
  }
});

document.addEventListener('shown.bs.collapse', function (event) {
  const input = event.target.querySelector('.reply-input');
  if (input) {
    input.focus();
  }
});
