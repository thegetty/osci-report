var NAVHEIGHT = 60;

// Use this to wrap selectors that contain : characters
function jq(myid) { return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );}

function anchorScroll(href) {
  $anchorLinks = $("a[href*='#']")
  $anchorLinks.click(function(e) {
    var target = $(this).attr("href");
    var distance = $(jq(target)).offset().top;

    $("html, body").animate({
      scrollTop: distance - NAVHEIGHT
    }, 250);
  })
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

function gridExpander() {
  var $gridContent  = $(".grid-content");
  var $gridTriggers = $(".grid-trigger");

  $($gridContent).addClass("grid--hidden");

  $gridTriggers.on("click", function() {
    var $openItems = $(".grid-content:not(.grid--hidden)");
    var $selector = $(this).attr('id');
    var $targetId = "#" + $selector + "-content";
    var $target = $($targetId);
    if ( $openItems.length <= 1 ) {
      $target.slideToggle(800, function() {
        $target.toggleClass("grid--hidden");
      });
      var $previousTarget = $(".grid-content[style='display: block;']");
      $previousTarget.slideToggle(600, function() {
        $previousTarget.toggleClass("grid--hidden");
      });
      $("html, body").animate({ scrollTop: 0 }, 600);
    }
    if ( $openItems.length > 1 ) {
      var targetPosition = $target.position();
      $("html, body").animate({ scrollTop: targetPosition.top - NAVHEIGHT }, 600);
    }
  });
}

function resetPage() {
  function incrementButtonText() {
    $(".header-reset").html(function(i, html){
      return html === "Expand all <span class=\"ion-arrow-expand\"></span>" ? "Collapse to grid <span class=\"ion-grid\"></span>" : "Expand all <span class=\"ion-arrow-expand\"></span>";
    });
  }
  $(".grid-reset").on("click", function () {
    var $openItems = $(".grid-content:not(.grid--hidden)");
    var $closedItems = $(".grid--hidden");
    console.log( $openItems.length, $closedItems.length );
    if ( $openItems.length == 0 ) {
      $closedItems.slideToggle(600, function() {
        $closedItems.removeClass("grid--hidden");
      });
      incrementButtonText();
    }
    if ( $closedItems.length == 0 ) {
      $openItems.slideToggle(600, function() {
        $openItems.addClass("grid--hidden");
      });
      incrementButtonText();
    }
    if (( $openItems.length == 1 ) && ( !$(this).hasClass("header-reset") )) {
      $openItems.slideToggle(600, function() {
        $openItems.addClass("grid--hidden");
      });
    }
    if (( $openItems.length == 1 ) && ( $(this).hasClass("header-reset") )) {
      var $stillClosed = $(".grid--hidden");
      $stillClosed.slideToggle(600, function() {
        $stillClosed.removeClass("grid--hidden");
      });
      incrementButtonText();
    }
    $("html, body").animate({scrollTop : 0},600);
  });
  $(".page-reset").on("click", function () {
    $("html, body").animate({scrollTop : 0},600);
  });
}

function gifPlayer() {
  $(".animate-on-hover").mouseover(function() {
    var gifSource = $(this).attr("data-alt");
    $(this).attr("src",gifSource);
  });
}

function submarineTracker() {
  $("#skim-swim-dive").mousemove(function() {
    var mousePosition = event.pageY;
    var elementPosition = $("#skim-swim-dive").position();
    var subHeight = $("#submarine").height();
    var subPosition = mousePosition - elementPosition.top - subHeight/2;
    if ( subPosition >= $("#water").height() * .5  ) {
      var spotlightOpacity = subPosition / $("#water").height();
    } else {
      var spotlightOpacity = 0;
    }
    // var spotlightOpacity = subPosition / $("#water").height();
    console.log( mousePosition, elementPosition.top, subPosition, subHeight, $("#water").height() );
    if (( subPosition < $("#water").height() - subHeight ) && ( subPosition >= $("#water").height() * .1 )) {
      $("#submarine").css( { "top": subPosition, "transition": "top 1.5s ease-in-out"} );
      $("#spotlight").css( { "top": subPosition, "transition": "top 1.5s ease-in-out, opacity 1.5s ease-in-out", "opacity": spotlightOpacity } );
    }
  });
}

function videoExpander() {
  $(".video").click(function() {
    $(this).parent().animate({
      "width": "100%",
      "margin-right": 0,
    }, 800);
    $("img", this).fadeOut(800);
    // $(this).parent().find(".video-closer").show(800);
    $(this).parent().find(".video-closer").animate({
      "opacity": "1",
    }, 800);
    var originalSource = $("iframe", this).attr("src");
    $("iframe", this).attr("src", originalSource + "&autoplay=1");
  });
  $(".video-closer").click(function() {
    $(this).parent().animate({
      "width": "37%",
      "margin-right": "1.35em",
    }, 800);
    $(this).parent().find("img").fadeIn(800);
    $(this).animate({
      "opacity": "0",
    }, 800);
    var originalSource = $(this).parent().find("iframe").attr("src").replace("&autoplay=1","");
    $(this).parent().find("iframe").attr("src", originalSource);
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
  if ($(".gallery-slide")) {
    $figures = $(".gallery-slide img");
    $figures.on("click", function(e) {
      var figs = document.querySelectorAll(".gallery-slide");
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

function sidebarExpander() {
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

function popupSetup() {
  var $popups = $(".popup");
  $popups.each(function(index) {

    var $popup = $(this);

    // Definition Popup--------------------------------------------------------
    // ------------------------------------------------------------------------
    if ($popup.data("definition")) {
      var $el = $("<div>", {class: "popup-content"});
      $el.html(
        "<span class='definition-icon ion-wand'></span>" +
        $popup.data("definition")
      );
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
  sidebarExpander();
  popupSetup();
  gridExpander();
  gifPlayer();
  submarineTracker();
  videoExpander();
  resetPage();
  lightBoxSetup();
  footnoteScroll();
  anchorScroll();
  citationDate();
  stickySetup();
}
