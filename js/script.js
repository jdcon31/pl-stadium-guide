/* ==========================================================
   Premier League Stadium Guide - shared script
   Loaded on every page. Each feature checks that its elements
   exist before running, so one file works for all four pages.

   Sections: 1. Stadium data      2. Helpers
             3. Theme toggle      4. Mobile nav
             5. Grounds page      6. Gallery and lightbox
             7. FAQ accordion     8. Image credits
   ========================================================== */

/* ---------- 1. Stadium data ----------
   One entry per ground. "slug" matches the photo file name in
   images/ (for example images/anfield.jpg). Capacities are the
   figures listed for the start of the 2026-27 season. */
const STADIUMS = [
  { slug: "old-trafford", name: "Old Trafford", club: "Manchester United", city: "Manchester", region: "North West", capacity: 74158, opened: 1910,
    blurb: "The biggest club ground in the country and United's home since 1910. Sir Bobby Charlton gave it the nickname the Theatre of Dreams." },
  { slug: "tottenham-hotspur-stadium", name: "Tottenham Hotspur Stadium", club: "Tottenham Hotspur", city: "London", region: "London", capacity: 62850, opened: 2019,
    blurb: "Built on the site of the old White Hart Lane. The grass pitch slides out in sections to uncover an artificial one used for NFL games." },
  { slug: "anfield", name: "Anfield", club: "Liverpool", city: "Liverpool", region: "North West", capacity: 61276, opened: 1884,
    blurb: "Everton played here first, and Liverpool were formed in 1892 to fill the ground after they left. The Kop is one of the best-known stands in football." },
  { slug: "etihad-stadium", name: "Etihad Stadium", club: "Manchester City", city: "Manchester", region: "North West", capacity: 61038, opened: 2003,
    blurb: "Built for the 2002 Commonwealth Games and converted for football the year after. An expanded North Stand has pushed it past 60,000 seats." },
  { slug: "emirates-stadium", name: "Emirates Stadium", club: "Arsenal", city: "London", region: "London", capacity: 60704, opened: 2006,
    blurb: "Arsenal moved here in 2006 after 93 years at Highbury, which was only a few streets away. The old ground was turned into apartments." },
  { slug: "hill-dickinson-stadium", name: "Hill Dickinson Stadium", club: "Everton", city: "Liverpool", region: "North West", capacity: 52769, opened: 2025,
    blurb: "The newest ground in the league, built on the former Bramley-Moore Dock beside the River Mersey. It replaced Goodison Park, Everton's home for 133 years." },
  { slug: "st-james-park", name: "St James' Park", club: "Newcastle United", city: "Newcastle upon Tyne", region: "North East & Yorkshire", capacity: 52729, opened: 1892,
    blurb: "It sits on a hill right in the city centre, so the stands can be seen from all over Newcastle. Football was played on the site as early as 1880." },
  { slug: "stadium-of-light", name: "Stadium of Light", club: "Sunderland", city: "Sunderland", region: "North East & Yorkshire", capacity: 48095, opened: 1997,
    blurb: "Built on the site of the Wearmouth Colliery after Sunderland left Roker Park. A giant miner's lamp outside remembers the pit that stood there." },
  { slug: "stamford-bridge", name: "Stamford Bridge", club: "Chelsea", city: "London", region: "London", capacity: 40044, opened: 1877,
    blurb: "The oldest ground in the league. It opened as an athletics venue, and Chelsea were founded in 1905 to give it a football team." },
  { slug: "elland-road", name: "Elland Road", club: "Leeds United", city: "Leeds", region: "North East & Yorkshire", capacity: 37633, opened: 1897,
    blurb: "Leeds United have played here since the club was formed in 1919. The ground is older than the club and was first used for rugby." },
  { slug: "villa-park", name: "Villa Park", club: "Aston Villa", city: "Birmingham", region: "Midlands", capacity: 36887, opened: 1897,
    blurb: "Villa's home since 1897, and a regular FA Cup semi-final venue for most of the last century. The Holte End is one of the largest stands behind a goal in England." },
  { slug: "coventry-building-society-arena", name: "Coventry Building Society Arena", club: "Coventry City", city: "Coventry", region: "Midlands", capacity: 32609, opened: 2005,
    blurb: "Opened in 2005 to replace Highfield Road. Coventry are back in the top flight this season for the first time since 2001." },
  { slug: "amex-stadium", name: "American Express Stadium", club: "Brighton & Hove Albion", city: "Falmer, Brighton", region: "South & East", capacity: 32176, opened: 2011,
    blurb: "Usually just called the Amex. Brighton went 14 years without a permanent home after the Goldstone Ground was sold in 1997." },
  { slug: "city-ground", name: "The City Ground", club: "Nottingham Forest", city: "West Bridgford, Nottingham", region: "Midlands", capacity: 31212, opened: 1898,
    blurb: "It stands on the bank of the River Trent. Notts County's Meadow Lane is just across the water, which makes them the closest league grounds in England." },
  { slug: "portman-road", name: "Portman Road", club: "Ipswich Town", city: "Ipswich", region: "South & East", capacity: 30294, opened: 1884,
    blurb: "Ipswich have played here since 1884. Two of the stands are named after Sir Alf Ramsey and Sir Bobby Robson, who both managed the club and then England." },
  { slug: "craven-cottage", name: "Craven Cottage", club: "Fulham", city: "London", region: "London", capacity: 28107, opened: 1896,
    blurb: "A riverside ground on the Thames with a real cottage in one corner. The Johnny Haynes Stand dates from 1905 and is a listed building." },
  { slug: "selhurst-park", name: "Selhurst Park", club: "Crystal Palace", city: "London", region: "London", capacity: 25194, opened: 1924,
    blurb: "Palace's home in south London for more than a century. The two-tier Holmesdale Road Stand is where the loudest home support sits." },
  { slug: "mkm-stadium", name: "MKM Stadium", club: "Hull City", city: "Hull", region: "North East & Yorkshire", capacity: 24983, opened: 2002,
    blurb: "Hull City share the ground with the Hull FC rugby league side. It is back in the Premier League this season after a decade away." },
  { slug: "gtech-community-stadium", name: "Gtech Community Stadium", club: "Brentford", city: "London", region: "London", capacity: 17250, opened: 2020,
    blurb: "A compact ground squeezed between railway lines near Kew Bridge. It replaced Griffin Park, which was known for having a pub on each corner." },
  { slug: "vitality-stadium", name: "Vitality Stadium", club: "AFC Bournemouth", city: "Bournemouth", region: "South & East", capacity: 12357, opened: 1910,
    blurb: "The smallest ground in the league, also known as Dean Court. When it was rebuilt in 2001 the pitch was turned 90 degrees from its old position." }
];

/* ---------- 2. Helpers ---------- */

function imagePath(stadium) {
  return "images/" + stadium.slug + ".jpg";
}

/* Alt text describes the photo's subject for screen readers. */
function imageAlt(stadium) {
  return stadium.name + ", home of " + stadium.club;
}

/* If a photo file is missing, swap the broken image for a green
   placeholder with the stadium name so the layout stays intact. */
function addImageFallback(img) {
  function showPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "image-placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", img.alt);
    placeholder.textContent = img.alt;
    img.replaceWith(placeholder);
  }

  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
    showPlaceholder(); // the image already failed before this script ran
  } else {
    img.addEventListener("error", showPlaceholder, { once: true });
  }
}

/* localStorage can be blocked (private browsing, strict settings),
   so reads and writes are wrapped to keep the page working. */
function readSetting(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    /* The setting just won't be remembered. */
  }
}

/* ---------- 3. Theme toggle ---------- */
function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }

  // Use the saved choice, or fall back to the system setting.
  const saved = readSetting("theme");
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved === "dark" || saved === "light" ? saved : (systemDark ? "dark" : "light"));

  button.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveSetting("theme", next);
  });
}

/* ---------- 4. Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------- 5. Grounds page: search, filter and sort ---------- */
function createStadiumCard(stadium) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML =
    '<img class="card-image" loading="lazy" width="1280" height="853">' +
    '<div class="card-body">' +
      "<h2></h2>" +
      '<p class="card-meta"></p>' +
      '<dl class="card-facts">' +
        "<div><dt>Capacity</dt><dd></dd></div>" +
        "<div><dt>Opened</dt><dd></dd></div>" +
      "</dl>" +
      "<p></p>" +
    "</div>";

  const img = card.querySelector("img");
  img.alt = imageAlt(stadium);
  img.src = imagePath(stadium);
  addImageFallback(img);

  // textContent keeps the data as plain text rather than HTML.
  card.querySelector("h2").textContent = stadium.name;
  card.querySelector(".card-meta").textContent = stadium.club + " · " + stadium.city;
  const facts = card.querySelectorAll("dd");
  facts[0].textContent = stadium.capacity.toLocaleString("en-GB");
  facts[1].textContent = stadium.opened;
  card.querySelector(".card-body > p:last-child").textContent = stadium.blurb;

  return card;
}

function initGroundsPage() {
  const grid = document.getElementById("grounds-grid");
  if (!grid) return;

  const form = document.getElementById("grounds-controls");
  const searchInput = document.getElementById("ground-search");
  const regionSelect = document.getElementById("ground-region");
  const sortSelect = document.getElementById("ground-sort");
  const count = document.getElementById("grounds-count");

  const sorters = {
    "capacity-desc": function (a, b) { return b.capacity - a.capacity; },
    "capacity-asc": function (a, b) { return a.capacity - b.capacity; },
    "opened-asc": function (a, b) { return a.opened - b.opened; },
    "opened-desc": function (a, b) { return b.opened - a.opened; },
    "name-asc": function (a, b) { return a.name.localeCompare(b.name); }
  };

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const region = regionSelect.value;

    const matches = STADIUMS.filter(function (stadium) {
      const text = (stadium.name + " " + stadium.club + " " + stadium.city).toLowerCase();
      const matchesQuery = query === "" || text.includes(query);
      const matchesRegion = region === "all" || stadium.region === region;
      return matchesQuery && matchesRegion;
    }).sort(sorters[sortSelect.value] || sorters["capacity-desc"]);

    grid.innerHTML = "";

    if (matches.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "No grounds match that search. Try a different name or region.";
      grid.appendChild(empty);
    } else {
      matches.forEach(function (stadium) {
        grid.appendChild(createStadiumCard(stadium));
      });
    }

    count.textContent = "Showing " + matches.length + " of " + STADIUMS.length + " grounds";
  }

  // Pressing Enter in the search box should not reload the page.
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  searchInput.addEventListener("input", render);
  regionSelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);

  render();
}

/* ---------- 6. Gallery and lightbox ---------- */
function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const figure = lightbox.querySelector(".lightbox-figure");
  const caption = document.getElementById("lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  let lastFocused = null; // the thumbnail to return focus to on close

  // Build one thumbnail button per stadium.
  STADIUMS.forEach(function (stadium, index) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.setAttribute("aria-label", "View larger photo of " + stadium.name);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = imageAlt(stadium);
    img.src = imagePath(stadium);
    addImageFallback(img);

    const label = document.createElement("span");
    label.className = "gallery-label";
    label.textContent = stadium.name;

    button.append(img, label);
    button.addEventListener("click", function () {
      openLightbox(index);
    });
    item.appendChild(button);
    grid.appendChild(item);
  });

  function showPhoto(index) {
    // Wrap around at both ends of the list.
    currentIndex = (index + STADIUMS.length) % STADIUMS.length;
    const stadium = STADIUMS[currentIndex];

    // Use a fresh <img> each time so the missing-file fallback can run again.
    const img = document.createElement("img");
    img.id = "lightbox-image";
    img.alt = imageAlt(stadium);
    img.src = imagePath(stadium);
    figure.firstElementChild.replaceWith(img);
    addImageFallback(img);

    caption.textContent = stadium.name + " · " + stadium.club +
      " (" + (currentIndex + 1) + " of " + STADIUMS.length + ")";
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden"; // stop the page scrolling behind
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", function () { showPhoto(currentIndex - 1); });
  nextButton.addEventListener("click", function () { showPhoto(currentIndex + 1); });

  // Clicking the dark backdrop (not the photo or buttons) closes it.
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      showPhoto(currentIndex + 1);
    } else if (event.key === "Tab") {
      // Keep keyboard focus inside the lightbox while it is open.
      const buttons = [closeButton, prevButton, nextButton];
      const position = buttons.indexOf(document.activeElement);
      const step = event.shiftKey ? -1 : 1;
      event.preventDefault();
      buttons[(position + step + buttons.length) % buttons.length].focus();
    }
  });
}

/* ---------- 7. FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll(".faq-question").forEach(function (button) {
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    if (!answer) return;

    button.addEventListener("click", function () {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      answer.hidden = isOpen;
    });
  });
}

/* ---------- 8. Image credits (About page) ----------
   IMAGE_CREDITS is defined in js/credits.js, which is written by
   tools/fetch_images.py when the photos are downloaded. */
function initCredits() {
  const list = document.getElementById("credits-list");
  if (!list) return;

  const credits = typeof IMAGE_CREDITS === "object" && IMAGE_CREDITS !== null ? IMAGE_CREDITS : {};

  STADIUMS.forEach(function (stadium) {
    const credit = credits[stadium.slug];
    if (!credit) return;

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = credit.source;
    link.textContent = stadium.name;
    item.append(link, ": photo by " + credit.author + ", " + credit.license + ", via Wikimedia Commons.");
    list.appendChild(item);
  });

  if (list.children.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Credits will be listed here once the photos have been added.";
    list.appendChild(item);
  }
}

/* ---------- Start everything ---------- */
initThemeToggle();
initMobileNav();
initGroundsPage();
initGallery();
initFaq();
initCredits();
document.querySelectorAll("main img").forEach(function (img) {
  // Covers the images written directly in the HTML (home page).
  if (!img.closest("#grounds-grid, #gallery-grid, #lightbox")) addImageFallback(img);
});
