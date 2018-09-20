(function () {

  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var DEFAULT_LAZY_IMAGE = '.react-lazy-image';
  var NxDomEvent = (nx.dom && nx.dom.Event) || require('next-dom-event');
  var nxThrottle = nx.throttle || require('next-throttle');


  //TODO: has bug:
  function isInViewport(inElement, inOffset) {
    var offset = inOffset || 0;
    var box = inElement.getBoundingClientRect();
    var viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    return !(box.bottom < 0 || box.top > viewport.height) && !(box.right < 0 || box.left > viewport.width);
  }

  var NxScrollLazyImage = nx.declare('nx.ScrollLazyImage', {
    methods: {
      init: function (inContext, inOffset, inInterval) {
        this.context = inContext || global.document;
        this.interval = inInterval || 600;
        this.offset = inOffset || 100;
        this.elements = nx.slice(this.context.querySelectorAll(DEFAULT_LAZY_IMAGE));
        this.attachEvents();
        this.trigger();
      },
      destroy: function () {
        this.detachEvents();
      },
      attachEvents: function () {
        var handler = nxThrottle(this.trigger, this.interval, this);
        this._scrollRes = NxDomEvent.on(global, 'scroll', handler, this);
      },
      detachEvents: function () {
        this._scrollRes.destroy();
        this.context = null;
        this.elements = null;
      },
      trigger: function () {
        var self = this;
        this.elements.forEach(function (element) {
          var img = element.querySelector('img');
          self.triggerElement(img);
        })
      },
      hasLoad: function (inElement) {
        return inElement.dataset.loaded === 'true';
      },
      triggerElement: function (inElement) {
        if (!this.hasLoad(inElement) && isInViewport(inElement, this.offset)) {
          inElement.dataset.loaded = true;
          inElement.src = inElement.dataset.src;
        }
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxScrollLazyImage;
  }

}());
