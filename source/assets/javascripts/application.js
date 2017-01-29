//= require_tree .

// Keep standalone mode links from opening Safari unless
// they are outbound
if (("standalone" in window.navigator) && window.navigator.standalone) {
  var target, remotes = false;

  document.addEventListener('click', function(event) {
    target = event.target;
    while(target.nodeName !== "A" && target.nodeName !== "HTML") {
      target = target.parentNode;
    }

    if ('href' in target && target.href.indexOf('http') !== -1 && (
      target.href.indexOf(document.location.host) !== -1 || remotes)
       ) {
      event.preventDefault();
      document.location.href = target.href;
    }
  },false);
}


$(document).ready(function() {
  // set up UI
  uiSetup();
  // var vueSearch;
  // vueSearch = new Vue(Search);

  // smoothState init
  $("#main").smoothState({
    onStart: {
      duration: 400,
      render: function($container) {
        $container.velocity('fadeOut', { duration: 200 });
        // vueSearch.$destroy();
      }
    },
    onReady: {
      duration: 400,
      render: function($container, $newContent) {
        $container.html($newContent);
        $container.velocity('fadeIn', { duration: 100 });
      }
    },
    onAfter: function($container, $newContent) {
      uiSetup();
      // vueSearch = new Vue(Search);
    }
  });
});
