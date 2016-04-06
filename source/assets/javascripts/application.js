//= require_tree .

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
