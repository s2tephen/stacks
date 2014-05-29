(function() {
  scrollSidebar();
  bindCardNav();

  // load new card offscreen via AJAX, animate transition given direction
  function switchCards(target, dir1) {
    var dir2 = 'left';
    if (dir1 === 'left') dir2 = 'right';
    $('.onscreen').addClass('to-' + dir1);
    setTimeout(function() {
      $('.offscreen').load(target + ' .card', function() {
        $(this).removeClass('offscreen').addClass('from-' + dir2).addClass('onscreen');
        $(this).siblings('article').removeClass('onscreen').addClass('offscreen').html('');
        setTimeout(function() {
          $('.offscreen').removeClass('to-' + dir1);
          $('.onscreen').removeClass('from-' + dir2);
          bindCardNav();
          scrollSidebar();
        }, 600);
      });
    }, 300);
  }

  // scroll sidebar to current card
  function scrollSidebar() {
    return false;
  }

  // load card via cardnav (needs to be rebound)
  function bindCardNav() {
    $('.cardnav a').click(function(evt) {
      evt.preventDefault();
      var target = $(this).attr('href');
      var active = $('.active');
      if ($(this).hasClass('arrow-left')) {
        switchCards(target, 'right');
        active.parent().prev().find('a').addClass('active');
      }
      else {
        switchCards(target, 'left');
        active.parent().next().find('a').addClass('active');
      }
      active.removeClass('active');
      window.history.pushState({path: target}, '', target);
    });
  }

  // load card via sidebar
  $('.sidebar a').click(function(evt) {
    evt.preventDefault();
    if (!$(this).hasClass('active')) {
      if ($('body').hasClass('menu-open')) {
        closeMenu();
      }
      var target = $(this).attr('href');
      if ($('.active').parent().index() < $(this).parent().index()) {
        switchCards(target, 'left');
      }
      else {
        switchCards(target, 'right');
      }
      window.history.pushState({path: target}, '', target);
      $(this).addClass('active').parent().siblings().find('a').removeClass('active');
    }
  });

  // load card via history
  $(window).on('load', function() { // webkit popstate workaround
    setTimeout(function() {
      $(window).bind('popstate', function() {
        $('.offscreen').load(location.pathname + ' .card', function() {
          var cardnum = $('.offscreen').find('.card').attr('class').match('[0-9]+');
          if ($('.active').parent().index() < cardnum - 1) {
            switchCards(location.pathname, 'left');
          }
          else {
            switchCards(location.pathname, 'right');
          }
          $('.sidebar li:nth-child(' + cardnum + ') a').addClass('active').parent().siblings().find('a').removeClass('active');
        });
      });
    }, 0);
  });

  // hamburger menu
  function closeMenu() {
    $('body').addClass('menu-close');
    setTimeout(function() {
      $('body').removeClass();
    }, 500);
  }
  $('.hamburger').click(function() {
    if ($('body').hasClass('menu-open')) {
     closeMenu();
    }
    else {
      $('body').addClass('menu-open');
    }
  });

  // swipe through cards
  $('article').on('swipe', function(evt) {
    var target;
    var dir;
    if (evt.swipestop.coords[0] - evt.swipestart.coords[0] >= 20) {
      target = $('.arrow-left:not(.hidden)').attr('href');
      dir = 'right';
    }
    else if (evt.swipestop.coords[0] - evt.swipestart.coords[0] <= -20) {
      target = $('.arrow-right:not(.hidden)').attr('href');
      dir = 'left';
    }
    if (target) {
      switchCards(target, dir);
      window.history.pushState({path: target}, '', target);
      if (dir == 'right') {
        $('.active').removeClass('active').parent().prev().find('a').addClass('active');
      }
      else {
        $('.active').removeClass('active').parent().next().find('a').addClass('active');
      }
    }
  });
})();