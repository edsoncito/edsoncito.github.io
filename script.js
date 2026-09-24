const views = [...document.querySelectorAll("[data-view-panel]")];
const tabs = [...document.querySelectorAll("[data-view]")];
const openViewButtons = [...document.querySelectorAll("[data-open-view]")];
const activeProgram = document.querySelector("#active-program");
const commandInput = document.querySelector("#command-input");
const commandFeedback = document.querySelector("#command-feedback");
const runCommandButton = document.querySelector("#run-command");
const effectsToggle = document.querySelector("#effects-toggle");
const languageToggle = document.querySelector("#language-toggle");
const app = document.querySelector("#app");

const programNames = {
  home: "HOME.EXE",
  profile: "WHOAMI.TXT",
  experience: "EXPERIENCE.LOG",
  projects: "PROJECTS.DIR",
  stack: "STACK.JSON",
  contact: "CONTACT.SH",
};

const commandAliases = {
  home: "home",
  inicio: "home",
  perfil: "profile",
  profile: "profile",
  whoami: "profile",
  experiencia: "experience",
  experience: "experience",
  proyectos: "projects",
  projects: "projects",
  stack: "stack",
  skills: "stack",
  contacto: "contact",
  contact: "contact",
};

const translations = {
  es: {
    "nav.home": "INICIO",
    "nav.profile": "PERFIL",
    "nav.experience": "EXPERIENCIA",
    "nav.projects": "PROYECTOS",
    "nav.contact": "CONTACTO",
    "home.eyebrow": "SOFTWARE ENGINEER / BACKEND SPECIALIST",
    "home.copy": "Más de 6 años construyendo sistemas empresariales escalables, mantenibles y orientados al negocio.",
    "home.projects": "[ VER PROYECTOS ]",
    "home.available": "DISPONIBLE PARA NUEVOS RETOS",
    "profile.title": "INGENIERO QUE CONVIERTE COMPLEJIDAD EN SISTEMAS CLAROS.",
    "profile.p1": "Soy ingeniero de software con más de seis años de experiencia. Mi especialidad es diseñar backends robustos con Java y Spring Boot, aplicando arquitectura hexagonal, DDD y CQRS cuando el problema realmente lo requiere.",
    "profile.p2": "He participado desde el descubrimiento y modelado del dominio hasta la puesta en producción, trabajando con equipos ágiles y productos operativos y financieros.",
    "experience.architecture": "ARQUITECTURA Y DESARROLLO DE PRODUCTOS",
    "experience.architectureCopy": "Diseño de dominios, IAM multi-tenant, integraciones empresariales y plataformas transaccionales con foco en mantenibilidad y evolución.",
    "experience.backendCopy": "APIs, microservicios, procesamiento asíncrono, seguridad, persistencia y observabilidad en entornos productivos.",
    "experience.cycleCopy": "Participación en relevamiento, modelado, implementación, despliegue y mejora continua del producto.",
    "projects.erp": "ERP modular con dominio de productos, clientes y órdenes.",
    "projects.pos": "Sistema de punto de venta organizado por capas y unidad de trabajo.",
    "projects.transaction": "Servicios para pagos, conciliación e integración con proveedores.",
    "projects.insurance": "Modelado de organizaciones, roles, permisos y operación aseguradora.",
    "contact.title": "HABLEMOS DE SOFTWARE, ARQUITECTURA Y PRODUCTOS QUE NECESITAN CRECER BIEN.",
    "contact.copy": "Puedes revisar mi trabajo público y contactarme directamente desde GitHub.",
  },
  en: {
    "nav.home": "HOME",
    "nav.profile": "PROFILE",
    "nav.experience": "EXPERIENCE",
    "nav.projects": "PROJECTS",
    "nav.contact": "CONTACT",
    "home.eyebrow": "SOFTWARE ENGINEER / BACKEND SPECIALIST",
    "home.copy": "Over 6 years building scalable, maintainable enterprise systems aligned with business needs.",
    "home.projects": "[ VIEW PROJECTS ]",
    "home.available": "OPEN TO NEW CHALLENGES",
    "profile.title": "AN ENGINEER WHO TURNS COMPLEXITY INTO CLEAR SYSTEMS.",
    "profile.p1": "I am a software engineer with more than six years of experience. I specialize in robust backends with Java and Spring Boot, applying Hexagonal Architecture, DDD and CQRS when the problem genuinely calls for them.",
    "profile.p2": "I have contributed from discovery and domain modeling through production delivery, working with agile teams and operational and financial products.",
    "experience.architecture": "PRODUCT ARCHITECTURE AND ENGINEERING",
    "experience.architectureCopy": "Domain design, multi-tenant IAM, enterprise integrations and transactional platforms built for maintainability and evolution.",
    "experience.backendCopy": "APIs, microservices, asynchronous processing, security, persistence and observability in production environments.",
    "experience.cycleCopy": "Hands-on involvement in discovery, modeling, implementation, deployment and continuous product improvement.",
    "projects.erp": "A modular ERP covering products, customers and orders.",
    "projects.pos": "A layered point-of-sale system using a unit-of-work approach.",
    "projects.transaction": "Services for payments, reconciliation and provider integrations.",
    "projects.insurance": "Modeling organizations, roles, permissions and insurance operations.",
    "contact.title": "LET'S TALK ABOUT SOFTWARE, ARCHITECTURE AND PRODUCTS THAT NEED TO SCALE WELL.",
    "contact.copy": "Explore my public work and reach me directly through GitHub.",
  },
};

let language = "es";

function showView(viewName, updateHash = true) {
  if (!programNames[viewName]) return;

  views.forEach((view) => {
    const isCurrent = view.dataset.viewPanel === viewName;
    view.hidden = !isCurrent;
    view.classList.toggle("is-visible", isCurrent);
  });

  tabs.forEach((tab) => {
    const isCurrent = tab.dataset.view === viewName;
    tab.classList.toggle("is-active", isCurrent);
    tab.setAttribute("aria-selected", String(isCurrent));
  });

  activeProgram.textContent = `ACTIVE: ${programNames[viewName]}`;
  if (updateHash) history.replaceState(null, "", `#${viewName}`);
  document.title = `${programNames[viewName]} | Edson Gonzalo`;
}

function executeCommand() {
  const rawCommand = commandInput.value.trim();
  const command = rawCommand.toLowerCase();

  if (!command) {
    commandFeedback.textContent = "waiting for input...";
    return;
  }

  if (command === "help") {
    commandFeedback.textContent = "home · whoami · experience · projects · stack · contact · clear";
  } else if (command === "clear") {
    commandFeedback.textContent = "console cleared";
  } else if (command === "github") {
    window.open("https://github.com/edsoncito", "_blank", "noopener,noreferrer");
    commandFeedback.textContent = "opening github...";
  } else if (commandAliases[command]) {
    showView(commandAliases[command]);
    commandFeedback.textContent = `executed: ${programNames[commandAliases[command]]}`;
  } else {
    commandFeedback.textContent = `command not found: ${rawCommand}. try “help”`;
  }

  commandInput.value = "";
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translated = translations[language][element.dataset.i18n];
    if (translated) element.textContent = translated;
  });
  languageToggle.textContent = language.toUpperCase();
  languageToggle.setAttribute("aria-label", language === "es" ? "Cambiar a inglés" : "Switch to Spanish");
}

function updateClock() {
  const clock = document.querySelector("#system-clock");
  clock.textContent = new Intl.DateTimeFormat(language === "es" ? "es-BO" : "en-US", {
    timeZone: "America/La_Paz",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
  tab.addEventListener("keydown", (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    tabs[nextIndex].focus();
    showView(tabs[nextIndex].dataset.view);
  });
});

openViewButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.openView));
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".project-row").forEach((project) => {
      project.hidden = filter !== "all" && !project.dataset.tags.split(" ").includes(filter);
    });
  });
});

runCommandButton.addEventListener("click", executeCommand);
commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") executeCommand();
});

effectsToggle.addEventListener("click", () => {
  const effectsEnabled = !app.classList.toggle("effects-off");
  effectsToggle.textContent = `CRT: ${effectsEnabled ? "ON" : "OFF"}`;
  effectsToggle.setAttribute("aria-pressed", String(effectsEnabled));
});

languageToggle.addEventListener("click", () => {
  language = language === "es" ? "en" : "es";
  applyLanguage();
  updateClock();
});

window.addEventListener("hashchange", () => {
  const requestedView = window.location.hash.slice(1);
  if (programNames[requestedView]) showView(requestedView, false);
});

const initialView = window.location.hash.slice(1);
showView(programNames[initialView] ? initialView : "home", false);
applyLanguage();
updateClock();
setInterval(updateClock, 1000);
