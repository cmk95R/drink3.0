document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('form1');
  if (!searchInput) return;

  searchInput.addEventListener('keyup', function () {
    const searchValue = this.value.toLowerCase();
    const productCards = document.querySelectorAll('.row .col');

    productCards.forEach(card => {
      const name = card.getAttribute('data-name');
      if (name && name.includes(searchValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});