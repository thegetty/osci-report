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

function popupSetup() {
  var $popups = $(".popup");
  $popups.each(function(index) {

    var $popup = $(this);

    // Definition Popup--------------------------------------------------------
    // ------------------------------------------------------------------------
    if ($popup.data("definition")) {
      var $el = $("<div>", {class: "popup-content"});
      $el.html($popup.data("definition"));
      $popup.append($el);
      $popup.on("click", function() {
        $popup.find(".popup-content").toggleClass("visible");
      });

    // Location Popup ---------------------------------------------------------
    // ------------------------------------------------------------------------
    } else if ($popup.data("location")) {
      var mapLocation;
      // Look for location that corresponds to data-location ID
      mapLocation = _.find(geojsonFeature.features, function(loc) {
        return loc.properties.id == $popup.data("location");
      });

      if (mapLocation == undefined) {
        console.log("No location data for " + $popup.text());
        $popup.removeClass("popup popup-location");

      } else {
        var $el, map, coords, label, marker;
        $el = $("<div>", {class: "popup-content"});
        $popup.append($el);

        coords = L.latLng([ mapLocation.geometry.coordinates[1], mapLocation.geometry.coordinates[0]]);
        map    = new PopupMap(coords, $popup.find(".popup-content")[0]).map;
        marker = L.marker(coords).addTo(map);

        marker.bindPopup(mapLocation.properties.custom_name);
        $popup.on("click", function() {
          if (!$popup.find(".popup-content").hasClass("visible")) {
            map.setView(coords, 6);
            $popup.find(".popup-content").addClass("visible");
            window.setTimeout(function() { map.invalidateSize(); }, 300);
          }
        });
      }

    // Image Popup ------------------------------------------------------------
    // ------------------------------------------------------------------------
    } else if ($popup.data("pic")) {
      var picData = JSON.parse($popup.data("pic"));
      var $el     = $("<figure>", {class: "popup-content"});
      var $img    = $("<img>", {src: "/publications/romanmosaics/assets/images/pics/" + picData.file });
      var $figcap = $("<figcaption>");

      $figcap.html(
        "<a href='" + picData.url + "' target='blank'>" +
        picData.title + "</a>. " +
        picData.source_credit
      );
      $el.append($img);
      $el.append($figcap);
      $popup.append($el);
      $popup.on("click", function() {
        $popup.find(".popup-content").toggleClass("visible");
      });
    }
  });
}

// Use this function as "export"
// Calls all other functions defined here inside of this one
function uiSetup() {
  sidebarSetup();
  keyboardNav();
  offCanvasNav();
  popupSetup();
  expanderSetup();
  lightBoxSetup();
  footnoteScroll();
  anchorScroll(window.location.hash);
  citationDate();
  stickySetup();
}
