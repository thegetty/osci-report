// Use this to wrap selectors that contain : characters
function jq(myid) { return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );}

function anchorScroll(href) {
  href = typeof(href) == "string" ? href : $(this).attr("href");
  var fromTop = 60;

  if(href.indexOf("#") == 0) {
    var $target = $(href);

    if($target.length) {
      $("html, body").animate({ scrollTop: $target.offset().top - fromTop });
      if (history && "pushState" in history) {
        history.pushState({}, document.title, window.location.pathname + href);
        return false;
      }
    }
  }
}

// Get today's current date, using Moment JS
function citationDate() {
  var today = moment().format("D MMM. YYYY");
  $(".cite-current-date").empty();
  $(".cite-current-date").text(today);
}

function footnoteScroll() {
  $(".footnote, .reversefootnote, .section-link").click(function(event){

    var target = $(this).attr("href");
    var distance = $(jq(target)).offset().top;

    $("html, body").animate({
      scrollTop: distance - 70
    }, 250);

  });
}

function keyboardNav(){
  $(document).keydown(function(event) {
    var prev, next, photoswipeActive;
    prev = document.getElementById("prev-link");
    next = document.getElementById("next-link");

    // Make sure photoswipe is not active
    photoswipeActive = $(".pswp").hasClass("pswp--visible");
    if (!(photoswipeActive)) {
      // 37 = left arrow key
      if (event.which === 37 && prev) {
        prev.click();
        event.preventDefault();
      }
      // 39 = right arrow key
      else if (event.which === 39 && next) {
        next.click();
        event.preventDefault();
      }
    }
  });
}

function offCanvasNav() {
  var $sidebar = $(".nav-sidebar");
  var $menuButton = $("#navbar-menu");
  var $closeButton = $("#nav-menu-close");
  var $curtain = $(".sliding-panel-fade-screen");

  $menuButton.on("click", function() {
    $sidebar.toggleClass("visible");
    $curtain.toggleClass("visible");
    // Force css repaint to deal with webkit "losing" the menu contents
    // on mobile devices
    $('<style></style>').appendTo($(document.body)).remove();
  });

  $closeButton.on("click", function() {
    $sidebar.removeClass("visible");
    $curtain.removeClass("visible");
  });

  $curtain.on("click", function() {
    $sidebar.removeClass("visible");
    $curtain.removeClass("visible");
  });

  // bind escape key to menu close if menu is open
  $(document).keydown(function(event) {
    if (event.which === 27 && $sidebar.hasClass("visible")) {
      $sidebar.removeClass("visible");
      $curtain.removeClass("visible");
    }
  });
}

function expanderSetup() {
  var $expanderContent  = $(".expander-content");
  var $expanderTriggers = $(".expander-trigger");

  $($expanderContent).addClass("expander--hidden");

  $expanderTriggers.on("click", function() {
    var $target = $(this).parent().find(".expander-content");
    $target.slideToggle("fast", function() {
      $target.toggleClass("expander--hidden");
    });
  });
}

// function searchSetup() {
//   var $searchButton = $("#navbar-search");
//   var $searchCloseButton = $("#search-close");
//   var $navbar = $(".navbar");
//   var $results = $(".search-results");

//   $searchButton.on("click", function() {
//     $navbar.toggleClass("search-active");
//     $results.toggleClass("search-active");
//   });

//   $searchCloseButton.on("click touchstart", function() {
//     $navbar.removeClass("search-active");
//     $results.removeClass("search-active");
//   });

//   // bind escape key to search close if search is active
//   $(document).keydown(function(event) {
//     if (event.which === 27 && $navbar.hasClass("search-active")) {
//       $navbar.removeClass("search-active");
//       $results.removeClass("search-active");
//     }
//   });
// }

function lightBoxSetup() {
  if ($(".inline-figure")) {
    $figures = $(".inline-figure img");
    $figures.on("click", function(e) {
      var figs = document.querySelectorAll(".inline-figure");
      var target = _.findIndex(figs, function(figure) {
        return figure.id == e.target.parentNode.id;
      });

      console.log(target);
      lightBox(target);
    });

  }
}

// make sure to provide $navbar-height as an offset value
function stickySetup() {
  $(".page-sidebar-inner").stick_in_parent({
    offset_top: 70
  });
}

function sidebarSetup() {
  if ($(".section-nav")) {
    $(".section-heading").each(function(index, section) {
      var listItem    = document.createElement("li");
      var sectionLink = document.createElement("a");
      var sectionText = document.createTextNode(section.innerHTML);
      var target      = "#" + section.id;

      sectionLink.setAttribute("href", target);
      sectionLink.setAttribute("class", "section-link");
      sectionLink.appendChild(sectionText);
      listItem.appendChild(sectionLink);

      $(".section-nav").append(listItem);
    });
  }
}

// Use this function as "export"
// Calls all other functions defined here inside of this one
function uiSetup() {
  sidebarSetup();
  keyboardNav();
  offCanvasNav();
  expanderSetup();
  lightBoxSetup();
  footnoteScroll();
  anchorScroll(window.location.hash);
  citationDate();
  stickySetup();
}
