async function loadProjects() {
  const res = await fetch("/projects/projects.json");
  const projects = await res.json();

  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = projects.map(p => `
    <a class="card" href="/projects/${p.slug}/index.html">
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
    </a>
  `).join("");
}

loadProjects().catch(console.error);