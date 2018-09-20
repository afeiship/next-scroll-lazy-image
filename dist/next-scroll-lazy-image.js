(function () {

  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var DEFAULT_LAZY_IMAGE = '.react-lazy-image';
  var NxDomEvent = nx.dom.Event || require('next-dom-event');
  var nxThrottle = nx.throttle || require('next-throttle');

  var NxScrollLazyImage = nx.declare('nx.ScrollLazyImage', {
    methods: {
      init: function (inContext) {
        this.context = inContext || global.document;
        this.elements = nx.slice(context.querySelectorAll(DEFAULT_LAZY_IMAGE));
        this.attachEvents();
      },
      destroy: function () {
        this.detachEvents();
      },
      attachEvents: function () {
        this._scrollRes = NxDomEvent.on(global, 'scroll', nxThrottle(this._onScroll, 300, this), this);
      },
      detachEvents: function () {
        this._scrollRes.destroy();
        this.context = null;
        this.elements = null;
      },
      _onScroll: function () {
        var self = this;
        // this.elements.forEach(function (element) {
        //   var img = element.querySeletor('img');
        // })
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxScrollLazyImage;
  }

}());
