var andrewVelocity = function(jQuery) {

  var $form = $('.form'),
      $submit = $('#city-state'),
      $search = $('#search-btn'),
      $cancel = $('#cancel-btn'),
      $threeDay = $('#three-day-btn'),
      $seven = $('#sevenDay'),
      $three = $('#threeDay');
        
      $search.hide();
        
      $submit.on('click', function() {
        $form.hide();
        $threeDay.hide();
        $search.show();
      });
        
      $search.on('click', function() {
        $form.slideDown();
        $cancel.css('display', 'inline-block');
        $(this).hide();
      });
        
      $cancel.on('click', function(e) {
        e.preventDefault();
        $form.slideUp();
        $search.show();
      });
      
  /*  VELOCITY  */

  // Opening Sequence
  $('#wrapper').velocity({
      opacity: [1, 0.1],
      translateY: [0, '500px']
    }, {
      duration: '1300',
      easing: [400, 28]
  });

  $('body').velocity({
  backgroundColor: ['#131730', '#fff']
  }, { delay: 1000, duration: 1000 });

}

andrewVelocity(jQuery);