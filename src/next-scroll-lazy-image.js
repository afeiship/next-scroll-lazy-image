(function () {

  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var DEFAULT_LAZY_IMAGE = '.react-lazy-image';
  var NxDomEvent = (nx.dom && nx.dom.Event) || require('next-dom-event');
  var nxThrottle = nx.throttle || require('next-throttle');
  var nxElementInViewport = nx.elementInViewport || require('next-element-in-viewport');
  var DEFAULT_OPTIONS = { interval: 800, offset: 0, threshold: 0 };

  var NxScrollLazyImage = nx.declare('nx.ScrollLazyImage', {
    methods: {
      init: function (inContext, inOptions) {
        this.options = inOptions || DEFAULT_OPTIONS;
        this.context = inContext || global.document;
        this.elements = nx.slice(this.context.querySelectorAll(DEFAULT_LAZY_IMAGE));
        this.attachEvents();
        this.trigger();
      },
      destroy: function () {
        this.detachEvents();
      },
      attachEvents: function () {
        var handler = nxThrottle(this.trigger, this.options.interval, this);
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
        if (!this.hasLoad(inElement) && nxElementInViewport(inElement, this.options)) {
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
