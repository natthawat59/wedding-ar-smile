const image = document.querySelector('#targetImage');
const hint = document.querySelector('#cardHint');
const cards = {
  front: { src: './assets/card-user-front-v14.png', alt: 'ด้านหน้าของการ์ดสำหรับส่อง AR', hint: 'ใช้ด้านหน้านี้สำหรับส่อง AR · เปิดให้เห็นทั้งใบโดยไม่ตัดขอบ' },
  back: { src: './assets/card-user-back-v14.png', alt: 'ด้านหลังของการ์ด แสดงข้อมูลวันและสถานที่', hint: 'ด้านหลังแสดงข้อมูลวันและสถานที่ · ส่อง AR ด้วยการ์ดด้านหน้า' },
};
document.querySelectorAll('[data-card]').forEach(button => {
  button.addEventListener('click', () => {
    const card = cards[button.dataset.card];
    image.src = card.src;
    image.alt = card.alt;
    hint.textContent = card.hint;
    document.querySelectorAll('[data-card]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  });
});
document.querySelector('#startAgain').addEventListener('click', () => document.querySelector('#start').click());
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  document.documentElement.classList.add('js-motion');
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
