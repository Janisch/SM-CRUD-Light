document.addEventListener('click', async (e) => {
  const button = e.target.closest('.heart');
  if (!button) return;

  const postId = button.dataset.postId;
  const likesAmount = button.querySelector('.like-count');

  if (button.dataset.loading === '1') return;
  button.dataset.loading = '1';

  try {
    const res = await fetch(`/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'same-origin',
    });

    if (!res.ok) {
      if (res.status === 401) window.location.href = '/login';
      throw new Error('Like failed');
    }

    const data = await res.json();

    button.classList.toggle('liked', data.liked);
    likesAmount.textContent = data.likesAmount;
  } catch (err) {
    console.error(err);
  } finally {
    button.dataset.loading = '0';
  }
});
