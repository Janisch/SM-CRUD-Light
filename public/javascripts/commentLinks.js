function addUsernameLinkMarkup() {
  const comments = document.querySelectorAll('.commentBody');

  comments.forEach((comment) => {
    let text = comment.innerHTML;
    // Regex: jedes Wort, das mit @ beginnt
    text = text.replace(/@(\w+)/g, (match, username) => {
      return `<a href="/profile/${username}">${match}</a>`;
    });

    // Kommentartext ersetzen
    comment.innerHTML = text;
  });
}

// Funktion einmal beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', () => {
  addUsernameLinkMarkup();
});
