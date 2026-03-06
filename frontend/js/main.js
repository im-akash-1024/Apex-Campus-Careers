// ── Navbar shrink ────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.padding = window.scrollY > 50 ? '12px 6%' : '18px 6%';
});

// ── Mobile menu ───────────────────────────────────────
function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ── Scroll fade-in ────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Tab switching ─────────────────────────────────────
function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name)?.classList.add('active');
  btn?.classList.add('active');
}

// ── Accordion ─────────────────────────────────────────
function toggleAcc(header) {
  header.parentElement.classList.toggle('open');
}

// ── Toast ─────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = 'toast'; }, 4500);
}

// ── Prefill topic shortcut ────────────────────────────
function prefillTopic(topic) {
  const el = document.getElementById('cfTopic');
  if (el) {
    el.value = topic;
    el.focus();
    document.getElementById('cfTopic')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ── Reset form after success ──────────────────────────
function resetForm() {
  document.getElementById('formSuccess').style.display = 'none';
  document.getElementById('formFields').style.display = 'block';
}

// ── Contact Form Submit → sends to backend → emails apexcampuscareers@gmail.com ──
async function submitContactForm() {
  const firstName = document.getElementById('cfFirst')?.value.trim();
  const lastName  = document.getElementById('cfLast')?.value.trim();
  const email     = document.getElementById('cfEmail')?.value.trim();
  const message   = document.getElementById('cfMessage')?.value.trim();

  if (!firstName || !lastName || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const phone    = document.getElementById('cfPhone')?.value.trim()    || '';
  const college  = document.getElementById('cfCollege')?.value.trim()  || '';
  const topic    = document.getElementById('cfTopic')?.value.trim()    || '';
  const category = document.getElementById('cfCategory')?.value        || '';

  const btn = document.getElementById('cfBtn');
  if (btn) { btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true; }

  try {
    const res  = await fetch('http://localhost:5000/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, phone, college, topic, category, message }),
    });
    const data = await res.json();

    if (data.success) {
      // Show success state
      document.getElementById('formFields').style.display  = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    } else {
      showToast(data.message || 'Something went wrong. Please try again.', 'error');
    }
  } catch {
    // If server is unreachable, fallback to mailto
    const subject = encodeURIComponent(`[Apex Inquiry] ${category || topic || 'General'} – ${firstName} ${lastName}`);
    const body    = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nCollege: ${college}\nTopic: ${topic || category}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:apexcampuscareers@gmail.com?subject=${subject}&body=${body}`;
  }

  if (btn) { btn.innerHTML = 'Send Message &nbsp;<i class="fas fa-paper-plane"></i>'; btn.disabled = false; }
}

// ── Close nav on link click (mobile) ─────────────────
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.remove('open');
  });
});
