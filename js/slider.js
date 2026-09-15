/* =========================================================
   3D GUIDEBOOK / GALLERY SLIDER
   Cyan Academic Competition 2026 — Departemen Aksi
========================================================= */

(function () {
  const slides = [
    {
      title: "Ketentuan Umum & Syarat Peserta",
      desc: "Panduan lengkap mengenai kriteria peserta SMA/SMK/MA sederajat dan Mahasiswa aktif se-Indonesia.",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      tag: "GUIDEBOOK PAGE 1"
    },
    {
      title: "Format Proposal & Berkas Karya",
      desc: "Petunjuk penyusunan makalah, esai ilmiah, serta spesifikasi teknis untuk cabang AI & STEM Robotics.",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      tag: "GUIDEBOOK PAGE 2"
    },
    {
      title: "Timeline & Tahapan Pendaftaran",
      desc: "Jadwal resmi Open Registration (1-20 Okt), Extended (21-22 Okt), Penyisihan (23 Okt - 28 Nov), Final (29 Nov).",
      img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
      tag: "GUIDEBOOK PAGE 3"
    },
    {
      title: "Kriteria Penilaian & Dewan Juri",
      desc: "Bobot penilaian orisinalitas, dampak ilmiah, keberlanjutan, serta kualitas presentasi final.",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      tag: "GUIDEBOOK PAGE 4"
    },
    {
      title: "Hadiah, Sertifikat & Awarding",
      desc: "Total Prize Pool Rp 50.000.000, Trophy Bergilir, E-Sertifikat Nasional, serta Publication Opportunities.",
      img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
      tag: "GUIDEBOOK PAGE 5"
    }
  ];

  let currentIndex = 0;

  const currentImg = document.getElementById('slideImg');
  const slideTitle = document.getElementById('slideTitle');
  const slideDesc = document.getElementById('slideDesc');
  const slideTag = document.getElementById('slideTag');
  const thumbStrip = document.getElementById('thumbStrip');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  function initSlider() {
    if (!thumbStrip) return;

    // Render thumbnails
    thumbStrip.innerHTML = '';
    slides.forEach((slide, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `docs-thumb ${idx === currentIndex ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${slide.img}" alt="${slide.title}">`;
      thumb.addEventListener('click', () => goToSlide(idx));
      thumbStrip.appendChild(thumb);
    });

    updateSlideView();
  }

  function updateSlideView() {
    const slide = slides[currentIndex];
    if (currentImg) {
      currentImg.style.opacity = '0';
      setTimeout(() => {
        currentImg.src = slide.img;
        currentImg.style.opacity = '1';
      }, 150);
    }
    if (slideTitle) slideTitle.textContent = slide.title;
    if (slideDesc) slideDesc.textContent = slide.desc;
    if (slideTag) slideTag.textContent = slide.tag;

    // Update active thumb
    const thumbs = thumbStrip ? thumbStrip.children : [];
    Array.from(thumbs).forEach((thumb, idx) => {
      if (idx === currentIndex) thumb.classList.add('active');
      else thumb.classList.remove('active');
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlideView();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Initialize on load
  document.addEventListener('DOMContentLoaded', initSlider);
})();
