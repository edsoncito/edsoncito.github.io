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
    "home.copy": "Ingeniero de Sistemas con más de 6 años desarrollando soluciones backend, financieras y transaccionales con Java y Spring Boot.",
    "home.projects": "[ VER PROYECTOS ]",
    "home.available": "DISPONIBLE PARA NUEVOS RETOS",
    "profile.title": "INGENIERO DE SISTEMAS ESPECIALIZADO EN BACKEND Y ARQUITECTURA.",
    "profile.p1": "Cuento con más de seis años de experiencia desarrollando software, con especialización en Java, Spring Boot y sistemas basados en microservicios, arquitectura hexagonal, DDD y CQRS.",
    "profile.p2": "He construido soluciones para pagos, prevención de lavado de activos, banca digital, ERP, salud, movilidad y comercio electrónico, participando desde la concepción hasta la puesta en producción.",
    "experience.zensy.role": "INGENIERO BACKEND",
    "experience.zensy.copy": "Lideré un middleware transaccional con Java y Spring Boot para pagos QR que procesó cerca de USD 2 millones en su primer mes. También implementé un nuevo onboarding KYC y workflows idempotentes para transferencias y pagos.",
    "experience.ganadero.role": "DESARROLLADOR DE SOFTWARE",
    "experience.ganadero.copy": "Desarrollé un middleware AML con Java y Spring Batch, participé en la arquitectura y rediseño de la app bancaria e implementé CI/CD con Azure DevOps, Docker y Jenkins.",
    "experience.digitalHarbor.role": "DESARROLLADOR DE SOFTWARE",
    "experience.digitalHarbor.copy": "Implementé funcionalidades de negocio y un componente reutilizable para gestionar datos temporales compartidos entre módulos con Angular y Spring Boot.",
    "experience.servisis.role": "DESARROLLADOR FULL STACK",
    "experience.servisis.copy": "Desarrollé aplicaciones web y móviles con React.js y React Native para salud, movilidad y comercio electrónico.",
    "experience.tdep.role": "DESARROLLADOR DE SOFTWARE",
    "experience.tdep.copy": "Elaboré reportes con SQL Server y BIRT, e integré servicios REST para la implementación, mantenimiento y soporte de un ERP.",
    "projects.erp": "ERP modular con dominio de productos, clientes y órdenes.",
    "projects.pos": "Sistema de punto de venta organizado por capas y unidad de trabajo.",
    "projects.transaction": "Servicios para pagos, conciliación e integración con proveedores.",
    "projects.insurance": "Modelado de organizaciones, roles, permisos y operación aseguradora.",
    "contact.title": "HABLEMOS DE SOFTWARE, ARQUITECTURA Y PRODUCTOS QUE NECESITAN CRECER BIEN.",
    "contact.copy": "Conecta conmigo en LinkedIn, revisa mi trabajo público en GitHub o escríbeme por correo.",
  },
  en: {
    "nav.home": "HOME",
    "nav.profile": "PROFILE",
    "nav.experience": "EXPERIENCE",
    "nav.projects": "PROJECTS",
    "nav.contact": "CONTACT",
    "home.eyebrow": "SOFTWARE ENGINEER / BACKEND SPECIALIST",
    "home.copy": "Systems Engineer with over 6 years building backend, financial and transactional solutions with Java and Spring Boot.",
    "home.projects": "[ VIEW PROJECTS ]",
    "home.available": "OPEN TO NEW CHALLENGES",
    "profile.title": "SYSTEMS ENGINEER SPECIALIZED IN BACKEND AND SOFTWARE ARCHITECTURE.",
    "profile.p1": "I have over six years of software development experience, specializing in Java, Spring Boot and systems based on microservices, Hexagonal Architecture, DDD and CQRS.",
    "profile.p2": "I have built solutions for payments, anti-money laundering, digital banking, ERP, healthcare, mobility and e-commerce, contributing from inception through production delivery.",
    "experience.zensy.role": "BACKEND ENGINEER",
    "experience.zensy.copy": "I led a Java and Spring Boot transactional middleware for QR payments that processed nearly USD 2 million in its first month. I also delivered a new KYC onboarding flow and idempotent workflows for transfers and payments.",
    "experience.ganadero.role": "SOFTWARE DEVELOPER",
    "experience.ganadero.copy": "I built an AML middleware with Java and Spring Batch, contributed to the banking app architecture and redesign, and implemented CI/CD with Azure DevOps, Docker and Jenkins.",
    "experience.digitalHarbor.role": "SOFTWARE DEVELOPER",
    "experience.digitalHarbor.copy": "I delivered business features and a reusable component for temporary data shared across modules using Angular and Spring Boot.",
    "experience.servisis.role": "FULL-STACK DEVELOPER",
    "experience.servisis.copy": "I developed web and mobile applications with React.js and React Native for healthcare, mobility and e-commerce.",
    "experience.tdep.role": "SOFTWARE DEVELOPER",
    "experience.tdep.copy": "I created reports with SQL Server and BIRT and integrated REST services for ERP implementation, maintenance and support.",
    "projects.erp": "A modular ERP covering products, customers and orders.",
    "projects.pos": "A layered point-of-sale system using a unit-of-work approach.",
    "projects.transaction": "Services for payments, reconciliation and provider integrations.",
    "projects.insurance": "Modeling organizations, roles, permissions and insurance operations.",
    "contact.title": "LET'S TALK ABOUT SOFTWARE, ARCHITECTURE AND PRODUCTS THAT NEED TO SCALE WELL.",
    "contact.copy": "Connect with me on LinkedIn, explore my public work on GitHub, or send me an email.",
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
    commandFeedback.textContent = "home · whoami · experience · projects · stack · contact · linkedin · github · clear";
  } else if (command === "clear") {
    commandFeedback.textContent = "console cleared";
  } else if (command === "github") {
    window.open("https://github.com/edsoncito", "_blank", "noopener,noreferrer");
    commandFeedback.textContent = "opening github...";
  } else if (command === "linkedin") {
    window.open("https://www.linkedin.com/in/edson-gonzalo", "_blank", "noopener,noreferrer");
    commandFeedback.textContent = "opening linkedin...";
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
