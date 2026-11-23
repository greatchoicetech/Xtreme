(function () {
  document.documentElement.classList.add("js");

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var menus = nav ? nav.querySelectorAll("details") : [];

  function closeMenus(except) {
    for (var i = 0; i < menus.length; i++) {
      if (menus[i] !== except) menus[i].open = false;
    }
  }

  function topItem(node) {
    var el = node;
    while (el && el !== nav) {
      if (el.parentElement && el.parentElement.parentElement === nav) return el;
      el = el.parentElement;
    }
    return null;
  }

  var hoverNav = window.matchMedia("(min-width: 981px)");

  if (nav) {
    nav.addEventListener("mouseover", function (event) {
      if (!hoverNav.matches) return;
      var item = topItem(event.target);
      if (!item) return;
      var current = item.querySelector("details");
      closeMenus(current);
      if (current) current.open = true;
    });

    nav.addEventListener("mouseleave", function () {
      if (!hoverNav.matches) return;
      closeMenus(null);
    });

    for (var i = 0; i < menus.length; i++) {
      (function (menu) {
        var summary = menu.querySelector("summary");
        if (summary) {
          summary.addEventListener("click", function (event) {
            if (hoverNav.matches) event.preventDefault();
          });
        }
        menu.addEventListener("mouseleave", function () {
          if (!hoverNav.matches) return;
          menu.open = false;
          if (document.activeElement && menu.contains(document.activeElement)) {
            document.activeElement.blur();
          }
        });
        menu.addEventListener("toggle", function () {
          if (this.open) closeMenus(this);
        });
      })(menus[i]);
    }
  }

  document.addEventListener("click", function (event) {
    if (!nav || !toggle) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      closeMenus(null);
    }
  });

  var bar = document.querySelector(".gallery-bar");
  if (bar) {
    bar.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var filter = button.getAttribute("data-filter");
      bar.querySelectorAll("button").forEach(function (item) {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      document.querySelectorAll(".gallery figure").forEach(function (figure) {
        var show = filter === "all" || figure.getAttribute("data-cat") === filter;
        figure.classList.toggle("is-hidden", !show);
      });
    });
  }

  var dialog = document.getElementById("lightbox");
  if (dialog) {
    document.querySelectorAll("[data-full]").forEach(function (button) {
      button.addEventListener("click", function () {
        var img = dialog.querySelector("img");
        img.src = button.getAttribute("data-full");
        img.alt = button.getAttribute("data-alt") || "";
        dialog.showModal();
      });
    });
  }

  document.querySelectorAll(".video-card").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-video");
      var frame = document.createElement("div");
      frame.className = "video-frame";
      frame.innerHTML = '<iframe title="' + (button.textContent || "Video").trim() +
        '" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      button.replaceWith(frame);
    });
  });

})();
