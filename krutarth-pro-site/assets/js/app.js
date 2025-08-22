
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu){
    navToggle.addEventListener('click', ()=>{
      const open = navMenu.style.display === 'flex';
      navMenu.style.display = open ? 'none' : 'flex';
      navToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  if (navMenu){
    const here = location.pathname.split('/').pop() || 'index.html';
    [...navMenu.querySelectorAll('a')].forEach(a=>{
      const page = a.getAttribute('href');
      if (page === here) a.classList.add('active');
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const user = JSON.parse(sessionStorage.getItem('kc_user') || 'null');
  if (logoutBtn){
    if (user){ logoutBtn.classList.remove('hidden'); }
    logoutBtn?.addEventListener('click',()=>{
      sessionStorage.removeItem('kc_user');
      location.href = 'index.html';
    });
  }

  // Registration with role
  const regForm = document.getElementById('registerForm');
  if (regForm){
    regForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData(regForm);
      const name = fd.get('name')?.toString().trim();
      const email= fd.get('email')?.toString().trim().toLowerCase();
      const pass = fd.get('password')?.toString();
      const grade= fd.get('grade')?.toString();
      const phone= fd.get('phone')?.toString();
      const branch= fd.get('branch')?.toString();
      const role = fd.get('role')?.toString() || 'student';
      if (!name || !email || !pass) return msg('regMsg','Please fill all required fields','err');
      const users = JSON.parse(localStorage.getItem('kc_users') || '[]');
      if (users.some(u=>u.email===email)) return msg('regMsg','Email already registered. Please login.','err');
      users.push({name,email,pass,grade,phone,branch,role,created:new Date().toISOString()});
      localStorage.setItem('kc_users', JSON.stringify(users));
      msg('regMsg','Registration successful! Redirecting to login…','ok');
      setTimeout(()=>location.href='login.html',900);
    });
  }

  // Login with role
  const loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email= fd.get('email')?.toString().trim().toLowerCase();
      const pass = fd.get('password')?.toString();
      const role = fd.get('role')?.toString();
      const users = JSON.parse(localStorage.getItem('kc_users') || '[]');
      const match = users.find(u=>u.email===email && u.pass===pass && u.role===role);
      if (!match){
        return msg('loginMsg','Invalid email, password, or role.','err');
      }
      sessionStorage.setItem('kc_user', JSON.stringify({name:match.name,email:match.email,role:match.role}));
      msg('loginMsg','Login successful! Redirecting…','ok');
      const target = role==='admin' ? 'admin-dashboard.html' : role==='teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
      setTimeout(()=>location.href=target,700);
    });
  }

  // Dashboards
  if (document.body.dataset.page === 'student'){
    if (!user || user.role!=='student'){ location.href='login.html'; return; }
    document.getElementById('userName').textContent = user.name;
    renderUsers('#myInfo');
  }
  if (document.body.dataset.page === 'teacher'){
    if (!user || user.role!=='teacher'){ location.href='login.html'; return; }
    document.getElementById('userName').textContent = user.name;
    renderUsers('#listBody');
  }
  if (document.body.dataset.page === 'admin'){
    if (!user || user.role!=='admin'){ location.href='login.html'; return; }
    document.getElementById('userName').textContent = user.name;
    renderUsers('#listBody');
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      contactForm.reset();
      msg('contactMsg','Thanks! We will reach out shortly.','ok');
    });
  }

  function msg(id,text,type){
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'alert ' + (type==='ok'?'ok':'err');
    el.textContent = text;
    el.style.display = 'block';
  }

  function renderUsers(target){
    const users = JSON.parse(localStorage.getItem('kc_users') || '[]');
    const tb = document.querySelector(target);
    if (!tb) return;
    tb.innerHTML = users.map((u,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role||'-'}</td>
        <td>${u.grade||'-'}</td>
        <td>${u.branch||'-'}</td>
        <td>${new Date(u.created).toLocaleDateString()}</td>
      </tr>
    `).join('');
  }
})();
