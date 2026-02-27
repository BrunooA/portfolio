const projectsGrid = document.getElementById("projects-grid");
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalLink = document.getElementById("modal-link");
const closeModal = document.getElementById("close-modal");
const themeToggle = document.getElementById("theme-toggle");

const GITHUB_USER = "BrunooA";
const MAX_PROJECTS = 4;
const FEATURED_TOPIC = "featured";

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.innerHTML = document.body.classList.contains("light")
      ? `<i class="bi bi-moon"></i>`
      : `<i class="bi bi-sun"></i>`;
  });
}

if (closeModal && modal) {
  closeModal.onclick = () => (modal.style.display = "none");

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}


async function loadProjects() {
  if (!projectsGrid) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.mercy-preview+json",
        },
      }
    );

    const repos = await res.json();

    const featuredRepos = repos.filter(
      (repo) =>
        Array.isArray(repo.topics) &&
        repo.topics.includes(FEATURED_TOPIC)
    );

    featuredRepos.slice(0, MAX_PROJECTS).forEach((repo) => {
      const card = document.createElement("div");
      card.className = "project-card reveal";

      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description ?? "Projeto sem descrição."}</p>
        <i class="bi bi-box-arrow-up-right"></i>
      `;

      card.onclick = () => {
        if (!modal) return;

        modal.style.display = "flex";
        modalTitle.textContent = repo.name;
        modalDesc.textContent =
          repo.description ?? "Projeto sem descrição.";
        modalLink.href = repo.html_url;
      };

      projectsGrid.appendChild(card);
    });

    revealOnScroll();
  } catch (err) {
    console.error("Erro ao carregar projetos:", err);
  }
}

function revealOnScroll() {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
loadProjects();
