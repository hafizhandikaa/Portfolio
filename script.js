document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('open-ai-modal-btn');
  const modal = document.getElementById('ai-process-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (trigger && modal && closeBtn) {
    // Open Modal
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    // Close Modal
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);

    // Close Modal on clicking background overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close Modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
});
