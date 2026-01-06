const imageInput = document.getElementById('imageInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  fileNameDisplay.textContent = file ? `x ${file.name}` : '';
  fileNameDisplay.classList.toggle('d-none', !file);
});

fileNameDisplay.addEventListener('click', () => {
  imageInput.value = '';
  fileNameDisplay.textContent = '';
  fileNameDisplay.classList.add('d-none');
});
