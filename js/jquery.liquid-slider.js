if (typeof Object.create !== "function") {
  Object.create = function (e) {
    "use strict";
    function t() {}
    t.prototype = e;
    return new t();
  };
}
(function (e, t, n, r) {
  "use strict";
  e.fn.liquidSlider = function (t) {
    return this.each(function () {
      var n = Object.create(LiquidSlider);
      n.init(t, this);
      e.data(this, "liquidSlider", n);
    });
  };
  e.fn.liquidSlider.options = {
    autoHeight: true,
    minHeight: 0,
    heightEaseDuration: 1500,
    heightEaseFunction: "easeInOutExpo",
    slideEaseDuration: 1500,
    slideEaseFunction: "easeInOutExpo",
    slideEaseFunctionFallback: "swing",
    animateIn: "bounceInRight",
    animateOut: "bounceOutRight",
    continuous: true,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    autoSlide: false,
    autoSlideDirection: "right",
    autoSlideInterval: 6e3,
    forceAutoSlide: false,
    pauseOnHover: false,
    dynamicArrows: true,
    dynamicArrowsGraphical: true,
    dynamicArrowLeftText: "&#171; left",
    dynamicArrowRightText: "right &#187;",
    hideSideArrows: false,
    hideSideArrowsDuration: 750,
    hoverArrows: true,
    hoverArrowDuration: 250,
    dynamicTabs: true,
    dynamicTabsHtml: true,
    includeTitle: true,
    panelTitleSelector: ".title",
    dynamicTabsAlign: "left",
    dynamicTabsPosition: "top",
    navElementTag: "div",
    firstPanelToLoad: 1,
    crossLinks: false,
    hashLinking: false,
    hashTitleSelector: ".title",
    keyboardNavigation: false,
    leftKey: 39,
    rightKey: 37,
    panelKeys: { 1: 49, 2: 50, 3: 51, 4: 52 },
    responsive: true,
    mobileNavigation: true,
    mobileNavDefaultText: "Menu",
    mobileUIThreshold: 0,
    hideArrowsWhenMobile: true,
    hideArrowsThreshold: 0,
    useCSSMaxWidth: 3e3,
    preload: function () {
      var e = this;
      jQuery(t).bind("load", function () {
        e.finalize();
      });
    },
    onload: function () {},
    pretransition: function () {
      this.transition();
    },
    callback: function () {},
    preloader: false,
    swipe: true,
    swipeArgs: r,
  };
})(jQuery, window, document);
var LiquidSlider = {};
LiquidSlider.init = function (e, t) {
  var n = this;
  n.elem = t;
  n.$elem = jQuery(t);
  jQuery(".no-js").removeClass("no-js");
  n.sliderId = "#" + n.$elem.attr("id");
  n.$sliderId = jQuery(n.sliderId);
  n.options = jQuery.extend({}, jQuery.fn.liquidSlider.options, e);
  n.pSign = n.options.responsive ? "%" : "px";
  n.determineAnimationType();
  if (!n.options.responsive) {
    n.options.mobileNavigation = false;
    n.options.hideArrowsWhenMobile = false;
  }
  if (n.options.slideEaseFunction === "animate.css") {
    if (!n.useCSS) {
      n.options.slideEaseFunction = n.options.slideEaseFunctionFallback;
    } else {
      n.options.continuous = false;
      n.animateCSS = true;
    }
  }
  n.build();
  n.events();
  if (!n.options.responsive && n.options.dynamicArrows)
    n.$sliderWrap.width(
      n.$sliderId.outerWidth(true) +
        n.leftArrow.outerWidth(true) +
        n.rightArrow.outerWidth(true),
    );
  n.loaded = true;
  n.options.preload.call(n);
};
LiquidSlider.build = function () {
  var e = this,
    t;
  if (e.$sliderId.parent().attr("class") !== "ls-wrapper") {
    e.$sliderId.wrap(
      '<div id="' + e.$elem.attr("id") + '-wrapper" class="ls-wrapper"></div>',
    );
  }
  e.$sliderWrap = jQuery(e.sliderId + "-wrapper");
  e.options.preloader && e.addPreloader();
  jQuery(e.sliderId)
    .children()
    .addClass(e.$elem.attr("id") + "-panel panel");
  e.panelClass = e.sliderId + " ." + e.$elem.attr("id") + "-panel:not(.clone)";
  e.$panelClass = jQuery(e.panelClass);
  e.$panelClass.wrapAll('<div class="panel-container"></div>');
  e.$panelClass.wrapInner('<div class="panel-wrapper"></div>');
  e.panelContainer = e.$panelClass.parent();
  e.$panelContainer = e.panelContainer;
  if (e.options.slideEaseFunction === "fade") {
    e.$panelClass.addClass("fade");
    e.options.continuous = false;
    e.fade = true;
  }
  if (e.options.dynamicTabs) {
    e.addNavigation();
  } else {
    e.options.mobileNavigation = false;
  }
  if (e.options.dynamicArrows) {
    e.addArrows();
  } else {
    e.options.hoverArrows = false;
    e.options.hideSideArrows = false;
    e.options.hideArrowsWhenMobile = false;
  }
  t = e.$leftArrow && e.$leftArrow.css("position") === "absolute" ? 0 : 1;
  e.totalSliderWidth =
    e.$sliderId.outerWidth(true) +
    jQuery(e.$leftArrow).outerWidth(true) * t +
    jQuery(e.$rightArrow).outerWidth(true) * t;
  jQuery(e.$sliderWrap).css("width", e.totalSliderWidth);
  e.options.dynamicTabs && e.alignNavigation();
  e.options.hideSideArrows && (e.options.continuous = false);
  if (e.options.continuous) {
    e.$panelContainer.prepend(
      e.$panelContainer.children().last().clone().addClass("clone"),
    );
    e.$panelContainer.append(
      e.$panelContainer.children().eq(1).clone().addClass("clone"),
    );
  }
  var n = e.options.continuous ? 2 : 0;
  e.panelCount = jQuery(e.panelClass).length;
  e.panelCountTotal = e.fade ? 1 : e.panelCount + n;
  e.panelWidth = jQuery(e.panelClass).outerWidth();
  e.totalWidth = e.panelCountTotal * e.panelWidth;
  jQuery(e.sliderId + " .panel-container").css("width", e.totalWidth);
  e.slideDistance = e.options.responsive
    ? 100
    : jQuery(e.sliderId).outerWidth();
  if (e.useCSS && e.options.responsive) {
    e.totalWidth = 100 * e.panelCountTotal;
    e.slideDistance = 100 / e.panelCountTotal;
  }
  e.options.responsive && e.makeResponsive();
  e.prepareTransition(e.getFirstPanel(), true);
  e.updateClass();
};
LiquidSlider.determineAnimationType = function () {
  var e = this,
    t = "animation",
    n = "",
    r = "Webkit Moz O ms Khtml".split(" "),
    i = "",
    s = 0;
  e.useCSS = false;
  if (e.elem.style.animationName) e.useCSS = true;
  if (e.useCSS === false) {
    for (s = 0; s < r.length; s++) {
      if (e.elem.style[r[s] + "AnimationName"] !== undefined) {
        i = r[s];
        t = i + "Animation";
        n = "-" + i.toLowerCase() + "-";
        e.useCSS = true;
        break;
      }
    }
  }
  document.documentElement.clientWidth > e.options.useCSSMaxWidth &&
    (e.useCSS = false);
};
LiquidSlider.configureCSSTransitions = function (e, t) {
  var n = this,
    r,
    i,
    s,
    o;
  n.easing = {
    easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
    easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
    easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
    easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
    easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
    easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
    easeOutExpo: "cubic-bezier(.19,1,.22,1)",
    easeInOutExpo: "cubic-bezier(1,0,0,1)",
    easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
    easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
    easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
    easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
    easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
    easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
    easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
    easeOutQuint: "cubic-bezier(.23,1,.32,1)",
    easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
    easeInSine: "cubic-bezier(.47,0,.745,.715)",
    easeOutSine: "cubic-bezier(.39,.575,.565,1)",
    easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
    easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
    easeOutBack: "cubic-bezier(.175,.885,.32,1.275)",
    easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)",
  };
  s = n.easing[n.options.slideEaseFunction] || n.options.slideEaseFunction;
  o = n.easing[n.options.heightEaseFunction] || n.options.heightEaseFunction;
  if (n.useCSS) {
    r = "all " + (e || n.options.slideEaseDuration) + "ms " + s;
    i = "all " + (t || n.options.heightEaseDuration) + "ms " + o;
    jQuery(n.panelContainer).css({
      "-webkit-transition": r,
      "-moz-transition": r,
      "-ms-transition": r,
      "-o-transition": r,
      transition: r,
    });
    if (n.options.autoHeight) {
      n.$sliderId.css({
        "-webkit-transition": i,
        "-moz-transition": i,
        "-ms-transition": i,
        "-o-transition": i,
        transition: i,
      });
    }
  }
};
LiquidSlider.transitionFade = function () {
  var e = this;
  jQuery(e.panelClass)
    .eq(e.nextPanel)
    .fadeTo(e.options.fadeInDuration, 1)
    .css("z-index", 1);
  jQuery(e.panelClass)
    .eq(e.prevPanel)
    .fadeTo(e.options.fadeOutDuration, 0)
    .css("z-index", 0);
  e.callback(e.options.callback, true);
};
LiquidSlider.hover = function () {
  var e = this;
  e.$sliderWrap.hover(
    function () {
      e.options.hoverArrows &&
        e.hideShowArrows(e.options.fadeInDuration, true, true, false);
      e.options.pauseOnHover && clearTimeout(e.autoSlideTimeout);
    },
    function () {
      e.options.hoverArrows &&
        e.hideShowArrows(e.options.fadeOutnDuration, true, false, true);
      e.options.pauseOnHover && e.options.autoSlide && e.startAutoSlide(true);
    },
  );
};
LiquidSlider.events = function () {
  var e = this;
  e.options.dynamicArrows && e.registerArrows();
  e.options.crossLinks && e.registerCrossLinks();
  e.options.dynamicTabs && e.registerNav();
  e.options.swipe && e.registerTouch();
  e.options.keyboardNavigation && e.registerKeyboard();
  e.$sliderWrap.find("*").on("click", function () {
    if (e.options.forceAutoSlide) {
      e.startAutoSlide(true);
    } else if (e.options.autoSlide) {
      e.stopAutoSlide();
    }
  });
  e.hover();
};
LiquidSlider.setNextPanel = function (e) {
  var t = this;
  if (e === t.nextPanel) return;
  t.prevPanel = t.nextPanel;
  if (t.loaded) {
    if (typeof e === "number") {
      t.nextPanel = e;
    } else {
      t.nextPanel += ~~(e === "right") || -1;
      t.options.continuous ||
        (t.nextPanel =
          t.nextPanel < 0 ? t.panelCount - 1 : t.nextPanel % t.panelCount);
    }
    if (t.fade || t.animateCSS) {
      t.prepareTransition(t.nextPanel);
    } else {
      t.verifyPanel();
    }
  }
};
LiquidSlider.getFirstPanel = function () {
  var e = this,
    t;
  if (e.options.hashLinking) {
    t = e.getPanelNumber(window.location.hash, e.options.hashTitleSelector);
    if (typeof t !== "number") t = 0;
  }
  return t ? t : e.options.firstPanelToLoad - 1;
};
LiquidSlider.getPanelNumber = function (e, t) {
  var n = this,
    r,
    i = e.replace("#", "").toLowerCase();
  n.$panelClass.each(function (e) {
    r = n.convertRegex(jQuery(this).find(t).text());
    r === i && (i = e + 1);
  });
  return parseInt(i, 10) ? parseInt(i, 10) - 1 : i;
};
LiquidSlider.getFromPanel = function (e, t) {
  var n = this;
  return n.convertRegex(n.$panelClass.find(e).eq(t).text());
};
LiquidSlider.convertRegex = function (e) {
  return e
    .trim()
    .replace(/[^\w -]+/g, "")
    .replace(/ +/g, "-")
    .toLowerCase();
};
LiquidSlider.updateClass = function () {
  var e = this,
    t = e.sanitizeNumber(e.nextPanel),
    n;
  if (e.options.dynamicTabs) {
    jQuery(e.$sliderWrap)
      .find("> .ls-nav .tab" + e.sanitizeNumber(e.nextPanel))
      .addClass("current")
      .siblings()
      .removeClass("current");
  }
  if (e.options.crossLinks && e.crosslinks) {
    e.crosslinks.not(e.nextPanel).removeClass("currentCrossLink");
    e.crosslinks.each(function () {
      n = jQuery(this).attr("href");
      if (
        n === "#" + e.getFromPanel(e.options.panelTitleSelector, t - 1) ||
        n === "#" + t
      ) {
        jQuery(this).addClass("currentCrossLink");
      }
    });
  }
  e.$panelClass
    .eq(e.sanitizeNumber(e.nextPanel) - 1)
    .addClass("currentPanel")
    .siblings()
    .removeClass("currentPanel");
  e.$clones = jQuery(e.sliderId + " .clone");
  if (
    e.options.continuous &&
    (e.nextPanel === -1 || e.nextPanel === e.panelCount)
  ) {
    e.$clones.addClass("currentPanel");
  } else {
    e.$clones.removeClass("currentPanel");
  }
};
LiquidSlider.sanitizeNumber = function (e) {
  var t = this;
  switch (true) {
    case e >= t.panelCount:
      return 1;
    case e <= -1:
      return t.panelCount;
    default:
      return e + 1;
  }
};
LiquidSlider.finalize = function () {
  var e = this;
  var t = e.options.autoHeight
    ? e.getHeight()
    : e.getHeighestPanel(e.nextPanel);
  e.options.autoHeight && e.adjustHeight(true, t);
  e.options.autoSlide && e.autoSlide();
  e.options.preloader && e.removePreloader();
  e.onload();
};
LiquidSlider.callback = function (e, t) {
  var n = this;
  if (e && n.loaded) {
    if (n.useCSS && typeof t !== "undefined") {
      jQuery(".panel-container").one(
        "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        function () {
          e.call(n);
        },
      );
    } else {
      setTimeout(function () {
        e.call(n);
      }, n.options.slideEaseDuration + 50);
    }
  }
};
LiquidSlider.onload = function () {
  var e = this;
  e.options.onload.call(e);
};
LiquidSlider.prepareTransition = function (e, t, n, r) {
  var i = this;
  i.nextPanel = e || 0;
  n || i.pretransition(i.options.pretransition);
  i.noAnimation = t;
  i.noPosttransition = r;
  if (!i.loaded) {
    i.transition();
  } else {
    i.options.pretransition.call(i);
  }
};
LiquidSlider.pretransition = function () {
  var e = this;
  e.options.hashLinking && e.updateHashTags();
  e.options.mobileNavigation && e.dropdownSelect.val("tab" + (e.nextPanel + 1));
  e.options.hideSideArrows && e.hideShowArrows();
  e.updateClass();
};
LiquidSlider.getTransitionMargin = function () {
  var e = this;
  return (
    -(e.nextPanel * e.slideDistance) - e.slideDistance * ~~e.options.continuous
  );
};
LiquidSlider.transition = function () {
  var e = this,
    t = e.getTransitionMargin();
  if (e.animateCSS && e.loaded) {
    e.transitionOutAnimateCSS();
    return false;
  }
  if (t + e.pSign !== e.panelContainer.css("margin-left") || t !== -100) {
    e.options.autoHeight &&
      !e.animateCSS &&
      e.adjustHeight(true, e.getHeight());
    switch (true) {
      case e.fade:
        e.transitionFade();
        break;
      case e.animateCSS:
        e.transitionInAnimateCSS(t);
        break;
      case e.useCSS:
        e.transitionCSS(t, e.noAnimation);
        break;
      default:
        e.transitionjQuery(t, e.noAnimation);
        break;
    }
  }
  e.noPosttransition || e.callback(e.options.callback);
};
LiquidSlider.transitionOutAnimateCSS = function () {
  var e = this;
  jQuery(e.panelClass).removeClass(e.options.animateIn + " animated");
  jQuery(e.panelClass)
    .eq(e.prevPanel)
    .addClass("animated " + e.options.animateOut);
  e.callback(e.transitionInAnimateCSS, undefined);
};
LiquidSlider.transitionInAnimateCSS = function () {
  var e = this;
  e.options.autoHeight && e.adjustHeight(false, e.getHeight());
  e.transitionCSS(e.getTransitionMargin(), !e.loaded);
  jQuery(e.panelClass).removeClass(e.options.animateOut + " animated");
  jQuery(e.panelClass)
    .eq(e.nextPanel)
    .addClass("animated " + e.options.animateIn);
  e.callback(e.options.callback, undefined);
};
LiquidSlider.transitionCSS = function (e, t) {
  var n = this;
  t && n.configureCSSTransitions("0", "0");
  n.panelContainer.css({
    "-webkit-transform": "translate3d(" + e + n.pSign + ", 0, 0)",
    "-moz-transform": "translate3d(" + e + n.pSign + ", 0, 0)",
    "-ms-transform": "translate3d(" + e + n.pSign + ", 0, 0)",
    "-o-transform": "translate3d(" + e + n.pSign + ", 0, 0)",
    transform: "translate3d(" + e + n.pSign + ", 0, 0)",
  });
  if (t) {
    n.callback(function () {
      n.configureCSSTransitions();
    });
  } else {
    n.configureCSSTransitions();
  }
};
LiquidSlider.transitionjQuery = function (e, t) {
  var n = this;
  if (t) {
    n.panelContainer.css("margin-left", e + n.pSign);
  } else {
    n.panelContainer.animate(
      { "margin-left": e + n.pSign },
      {
        easing: jQuery.easing.hasOwnProperty(n.options.slideEaseFunction)
          ? n.options.slideEaseFunction
          : n.options.slideEaseFunctionFallback,
        duration: n.options.slideEaseDuration,
        queue: false,
      },
    );
  }
};
LiquidSlider.getHeight = function (e) {
  var t = this;
  e =
    e || t.$panelClass.eq(t.sanitizeNumber(t.nextPanel) - 1).outerHeight(true);
  e = e < t.options.minHeight ? t.options.minHeight : e;
  return e;
};
LiquidSlider.getHeighestPanel = function () {
  var e = this,
    t,
    n = 0;
  e.$panelClass.each(function () {
    t = jQuery(this).outerHeight(true);
    n = t > n ? t : n;
  });
  if (e.options.autoHeight) return n;
};
LiquidSlider.verifyPanel = function () {
  var e = this,
    t = false;
  if (e.options.continuous) {
    switch (true) {
      case e.nextPanel > e.panelCount:
        e.nextPanel = e.panelCount;
        e.setNextPanel(e.panelCount);
        break;
      case e.nextPanel < -1:
        e.nextPanel = -1;
        e.setNextPanel(-1);
        break;
      case t || e.nextPanel === e.panelCount || e.nextPanel === -1:
        e.prepareTransition(e.nextPanel);
        e.updateClass();
        clearTimeout(n);
        var n = setTimeout(function () {
          if (e.nextPanel === e.panelCount) {
            e.prepareTransition(0, true, true, true);
          } else if (e.nextPanel === -1) {
            e.prepareTransition(e.panelCount - 1, true, true, true);
          }
        }, e.options.slideEaseDuration + 50);
        break;
      default:
        t = true;
        e.prepareTransition(e.nextPanel);
        break;
    }
  } else {
    if (e.nextPanel === e.panelCount) {
      e.nextPanel = 0;
    } else if (e.nextPanel === -1) {
      e.nextPanel = e.panelCount - 1;
    }
    e.prepareTransition(e.nextPanel);
  }
};
LiquidSlider.addNavigation = function (e) {
  var t = this,
    n =
      "<" +
      t.options.navElementTag +
      ' class="ls-nav"><ul id="' +
      t.$elem.attr("id") +
      '-nav-ul"></ul></' +
      t.options.navElementTag +
      ">";
  if (t.options.dynamicTabsPosition === "bottom") {
    t.$sliderId.after(n);
  } else {
    t.$sliderId.before(n);
  }
  if (t.options.mobileNavigation) {
    var r = t.options.mobileNavDefaultText
        ? '<option disabled="disabled" selected="selected">' +
          t.options.mobileNavDefaultText +
          "</option>"
        : null,
      i =
        '<div class="ls-select-box"><select id="' +
        t.$elem.attr("id") +
        '-nav-select" name="navigation">' +
        r +
        "</select></div>";
    t.navigation = jQuery(t.sliderId + "-nav-ul").before(i);
    t.dropdown = jQuery(t.sliderId + "-wrapper .ls-select-box");
    t.dropdownSelect = jQuery(t.sliderId + "-nav-select");
    jQuery.each(t.$elem.find(t.options.panelTitleSelector), function (e) {
      jQuery(t.$sliderWrap)
        .find(".ls-select-box select")
        .append(
          '<option value="tab' +
            (e + 1) +
            '">' +
            jQuery(this).text() +
            "</option>",
        );
    });
  }
  jQuery.each(t.$elem.find(t.options.panelTitleSelector), function (n) {
    jQuery(t.$sliderWrap)
      .find(".ls-nav ul")
      .append(
        '<li class="tab' +
          (n + 1) +
          '"><a class="' +
          (e || "") +
          '" href="#' +
          (n + 1) +
          '">' +
          t.getNavInsides(this) +
          "</a></li>",
      );
    if (!t.options.includeTitle) jQuery(this).remove();
  });
};
LiquidSlider.getNavInsides = function (e) {
  return this.options.dynamicTabsHtml ? jQuery(e).html() : jQuery(e).text();
};
LiquidSlider.alignNavigation = function () {
  var e = this,
    t = e.options.dynamicArrowsGraphical ? "-arrow" : "";
  if (e.options.dynamicTabsAlign !== "center") {
    if (!e.options.responsive) {
      jQuery(e.$sliderWrap)
        .find(".ls-nav ul")
        .css(
          "margin-" + e.options.dynamicTabsAlign,
          jQuery(e.$sliderWrap)
            .find(".ls-nav-" + e.options.dynamicTabsAlign + t)
            .outerWidth(true) +
            parseInt(
              e.$sliderId.css("margin-" + e.options.dynamicTabsAlign),
              10,
            ),
        );
    }
    jQuery(e.$sliderWrap)
      .find(".ls-nav ul")
      .css("float", e.options.dynamicTabsAlign);
  }
  e.totalNavWidth = jQuery(e.$sliderWrap).find(".ls-nav ul").outerWidth(true);
  if (e.options.dynamicTabsAlign === "center") {
    e.totalNavWidth = 0;
    jQuery(e.$sliderWrap)
      .find(".ls-nav li a")
      .each(function () {
        e.totalNavWidth += jQuery(this).outerWidth(true);
      });
    jQuery(e.$sliderWrap)
      .find(".ls-nav ul")
      .css("width", e.totalNavWidth + 1);
  }
};
LiquidSlider.registerNav = function () {
  var e = this;
  e.$sliderWrap.find("[class^=ls-nav] li").on("click", function () {
    e.setNextPanel(
      parseInt(jQuery(this).attr("class").split("tab")[1], 10) - 1,
    );
    return false;
  });
};
LiquidSlider.addArrows = function (e) {
  var t = this,
    n = t.options.dynamicArrowsGraphical ? "-arrow " : " ";
  t.$sliderWrap.addClass("arrows");
  if (t.options.dynamicArrowsGraphical) {
    t.options.dynamicArrowLeftText = "";
    t.options.dynamicArrowRightText = "";
  }
  t.$sliderId.before(
    '<div class="ls-nav-left' +
      n +
      (e || "") +
      '"><a href="#">' +
      t.options.dynamicArrowLeftText +
      "</a></div>",
  );
  t.$sliderId.after(
    '<div class="ls-nav-right' +
      n +
      (e || "") +
      '"><a href="#">' +
      t.options.dynamicArrowRightText +
      "</a></div>",
  );
  t.leftArrow = jQuery(t.sliderId + "-wrapper [class^=ls-nav-left]")
    .css("visibility", "hidden")
    .addClass("ls-hidden");
  t.rightArrow = jQuery(t.sliderId + "-wrapper [class^=ls-nav-right]")
    .css("visibility", "hidden")
    .addClass("ls-hidden");
  if (!t.options.hoverArrows) t.hideShowArrows(undefined, true, true, false);
};
LiquidSlider.hideShowArrows = function (e, t, n, r) {
  var i = this,
    s = typeof e !== "undefined" ? e : i.options.fadeOutDuration,
    o = typeof e !== "undefined" ? e : i.options.fadeInDuration,
    u = t ? "visible" : "hidden";
  if (!n && (r || i.sanitizeNumber(i.nextPanel) === 1)) {
    i.leftArrow.stop().fadeTo(s, 0, function () {
      jQuery(this).css("visibility", u).addClass("ls-hidden");
    });
  } else if (n || i.leftArrow.hasClass("ls-hidden")) {
    i.leftArrow
      .stop()
      .css("visibility", "visible")
      .fadeTo(o, 1)
      .removeClass("ls-hidden");
  }
  if (!n && (r || i.sanitizeNumber(i.nextPanel) === i.panelCount)) {
    i.rightArrow.stop().fadeTo(s, 0, function () {
      jQuery(this).css("visibility", u).addClass("ls-hidden");
    });
  } else if (n || i.rightArrow.hasClass("ls-hidden")) {
    i.rightArrow
      .stop()
      .css("visibility", "visible")
      .fadeTo(o, 1)
      .removeClass("ls-hidden");
  }
};
LiquidSlider.registerArrows = function () {
  var e = this;
  jQuery(e.$sliderWrap.find("[class^=ls-nav-]")).on("click", function () {
    e.setNextPanel(jQuery(this).attr("class").split(" ")[0].split("-")[2]);
  });
};
LiquidSlider.adjustHeight = function (e, t, n, r) {
  var i = this;
  if (e || i.useCSS) {
    e && i.configureCSSTransitions("0", "0");
    i.$sliderId.height(t);
    e && i.configureCSSTransitions();
    return;
  }
  i.$sliderId.animate(
    { height: t + "px" },
    {
      easing: jQuery.easing.hasOwnProperty(n || i.options.heightEaseFunction)
        ? n || i.options.heightEaseFunction
        : i.options.slideEaseFunctionFallback,
      duration: r || i.options.heightEaseDuration,
      queue: false,
    },
  );
};
LiquidSlider.autoSlide = function () {
  var e = this;
  if (e.options.autoSlideInterval < e.options.slideEaseDuration) {
    e.options.autoSlideInterval =
      e.options.slideEaseDuration > e.options.heightEaseDuration
        ? e.options.slideEaseDuration
        : e.options.heightEaseDuration;
  }
  e.autoSlideTimeout = !document.hasFocus()
    ? undefined
    : setTimeout(function () {
        e.setNextPanel(e.options.autoSlideDirection);
        e.autoSlide();
      }, e.options.autoSlideInterval);
  jQuery(window).on("focus", function () {
    e.startAutoSlide(true);
  });
  jQuery(window).on("blur", function () {
    e.stopAutoSlide();
  });
};
LiquidSlider.stopAutoSlide = function () {
  var e = this;
  e.options.autoSlide = false;
  clearTimeout(e.autoSlideTimeout);
};
LiquidSlider.startAutoSlide = function (e) {
  var t = this;
  t.options.autoSlide = true;
  e || t.setNextPanel(t.options.autoSlideDirection);
  t.autoSlide(clearTimeout(t.autoSlideTimeout));
};
LiquidSlider.registerCrossLinks = function () {
  var e = this;
  e.crosslinks = jQuery(
    "[data-liquidslider-ref*=" + e.sliderId.split("#")[1] + "]",
  );
  e.crosslinks.on("click", function (t) {
    e.options.autoSlide && e.startAutoSlide(true);
    e.setNextPanel(
      e.getPanelNumber(
        jQuery(this).attr("href").split("#")[1],
        e.options.panelTitleSelector,
      ),
    );
    t.preventDefault();
  });
  e.updateClass();
};
LiquidSlider.updateHashTags = function () {
  var e = this,
    t = e.nextPanel === e.panelCount ? 0 : e.nextPanel;
  window.location.hash = e.getFromPanel(e.options.hashTitleSelector, t);
};
LiquidSlider.registerKeyboard = function () {
  var e = this;
  jQuery(document).keydown(function (t) {
    var n = t.keyCode || t.which;
    if (t.target.type !== "textarea" && t.target.type !== "textbox") {
      e.options.forceAutoSlide || jQuery(this).trigger("click");
      n === e.options.leftKey && e.setNextPanel("right");
      n === e.options.rightKey && e.setNextPanel("left");
      jQuery.each(e.options.panelKeys, function (t, r) {
        n === r && e.setNextPanel(t - 1);
      });
    }
  });
};
LiquidSlider.addPreloader = function () {
  var e = this;
  jQuery(e.sliderId + "-wrapper").append('<div class="ls-preloader"></div>');
};
LiquidSlider.removePreloader = function () {
  var e = this;
  jQuery(e.sliderId + "-wrapper .ls-preloader").fadeTo("slow", 0, function () {
    jQuery(this).remove();
  });
};
LiquidSlider.makeResponsive = function () {
  var e = this;
  jQuery(e.sliderId + "-wrapper")
    .addClass("ls-responsive")
    .css({
      "max-width": jQuery(e.sliderId + " .panel:first-child").width(),
      width: "100%",
    });
  jQuery(e.sliderId + " .panel-container").css(
    "width",
    100 * e.panelCountTotal + e.pSign,
  );
  jQuery(e.sliderId + " .panel").css(
    "width",
    100 / e.panelCountTotal + e.pSign,
  );
  if (e.options.hideArrowsWhenMobile) {
    e.leftWrapperPadding = jQuery(e.sliderId + "-wrapper").css("padding-left");
    e.rightWrapperPadding = e.$sliderWrap.css("padding-right");
  }
  e.responsiveEvents();
  jQuery(window).bind("resize orientationchange", function () {
    e.responsiveEvents();
    clearTimeout(e.resizingTimeout);
    e.resizingTimeout = setTimeout(function () {
      var t = e.options.autoHeight
        ? e.getHeight()
        : e.getHeighestPanel(e.nextPanel);
      e.adjustHeight(false, t);
    }, 500);
  });
};
LiquidSlider.responsiveEvents = function () {
  var e = this,
    t =
      e.options.hideArrowsThreshold ||
      e.options.mobileUIThreshold ||
      e.totalNavWidth + 10;
  if (e.$sliderId.outerWidth() < t) {
    if (e.options.mobileNavigation) {
      e.navigation.css("display", "none");
      e.dropdown.css("display", "block");
      e.dropdownSelect.css("display", "block");
      jQuery(e.sliderId + "-nav-select").val(e.options.mobileNavDefaultText);
    }
    if (e.options.dynamicArrows) {
      if (e.options.hideArrowsWhenMobile) {
        e.leftArrow.remove().length = 0;
        e.rightArrow.remove().length = 0;
      } else if (!e.options.dynamicArrowsGraphical) {
        e.leftArrow.css("margin-" + e.options.dynamicTabsPosition, "0");
        e.rightArrow.css("margin-" + e.options.dynamicTabsPosition, "0");
      }
    }
  } else {
    if (e.options.mobileNavigation) {
      e.navigation.css("display", "block");
      e.dropdown.css("display", "none");
      e.dropdownSelect.css("display", "none");
    }
    if (e.options.dynamicArrows) {
      if (
        e.options.hideArrowsWhenMobile &&
        (!e.leftArrow.length || !e.rightArrow.length)
      ) {
        e.addArrows();
        e.registerArrows();
      } else if (!e.options.dynamicArrowsGraphical) {
        e.leftArrow.css(
          "margin-" + e.options.dynamicTabsPosition,
          e.navigation.css("height"),
        );
        e.rightArrow.css(
          "margin-" + e.options.dynamicTabsPosition,
          e.navigation.css("height"),
        );
      }
    }
  }
  jQuery(e.sliderId + "-wrapper").css("width", "100%");
  e.options.mobileNavigation &&
    e.dropdownSelect.change(function () {
      e.setNextPanel(parseInt(jQuery(this).val().split("tab")[1], 10) - 1);
    });
};
LiquidSlider.registerTouch = function () {
  var e = this,
    t = e.options.swipeArgs || {
      fallbackToMouseEvents: false,
      allowPageScroll: "vertical",
      swipe: function (t, n) {
        if (n === "up" || n === "down") return false;
        e.swipeDir = n === "left" ? "right" : "left";
        e.setNextPanel(e.swipeDir);
      },
    };
  jQuery(e.sliderId + " .panel").swipe(t);
};
