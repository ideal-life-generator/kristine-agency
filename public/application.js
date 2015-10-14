requirejs.config({
  map: {
    "*": {
      "text": "libraries/text",
      "css": "libraries/css"
    }
  },
  shim: {
    "libraries/backbone-min": {
      deps: [ "libraries/underscore-min", "libraries/jquery-2.1.4.min", "libraries/TweenMax.min.js" ],
      exports: "Backbone"
    },
    "libraries/underscore-min": {
      exports: "_"
    },
    "libraries/jquery.mobile.custom.js": {
      deps: [ "libraries/jquery-2.1.4.min" ],
      exports: "$"
    }
  },
  waitSeconds: 50
});

require([ "libraries/backbone-min" ], function () {

  $(function () {

  var MainView = Backbone.View.extend({
    el: $("main"),
    initialize: function () {
      var mainView = this;
      TweenMax.to(mainView.$el, 0.6, {
        onStart: function () {
          mainView.$el.css({ display: "block" });
        },
        opacity: 1
      });
    }
  });

  var MainHeaderView = Backbone.View.extend({
    el: $("#main-header #name a"),
    setActive: function () {
      var mainHeaderView = this;
      if (this.activeView === false) {
        this.activeView = true;
        TweenMax.to(this.$el, 0.6, { fontSize: 120 });
      }
      else if (typeof this.activeView === "undefined") {
        this.activeView = true;
        TweenMax.set(this.$el, { fontSize: 120 });
      }
    },
    setDeactive: function () {
      if (this.activeView === true) {
        this.activeView = false;
        TweenMax.to(this.$el, 0.6, { fontSize: 72 });
      }
      else if (typeof this.activeView === "undefined") {
        this.activeView = false;
        TweenMax.set(this.$el, { fontSize: 72 });
      }
    }
  });

  var mainHeaderView = new MainHeaderView();

  var Router = Backbone.Router.extend({
    routes: {
      "": function (params) {
        var router = this;
        mainHeaderView.setActive();
        if (this.activeViewLvl1) {
          router.activeViewLvl1Name = "";
          TweenMax.to(this.activeViewLvl1.$el, 0.6, {
            opacity: 0,
            onComplete: function () { router.activeViewLvl1.remove(); }
          });
        }
      },
      "about": function (params) {
        var router = this;
        if (router.activeViewLvl1Name !== "about") {
          mainHeaderView.setDeactive();
          router.activeViewLvl1Name = "about";
          require([ "views/about/main" ], function (AboutView) {
            if (router.activeViewLvl1) {
              var prevActive = router.activeViewLvl1;
              TweenMax.to(prevActive.$el, 0.6, {
                opacity: 0,
                onComplete: function () { prevActive.remove(); }
              });
            }
            var aboutView = new AboutView();
            router.activeViewLvl1 = aboutView;
            TweenMax.fromTo(aboutView.$el, 0.6, { opacity: 0 }, {
              opacity: 1
            });
            $("#main-section").append(aboutView.$el);
          });
        }
      },
      "service": "service",
      "service/find-love": function (params) {
        var router = this;
        router.service(params, function () {
          require([ "views/service/find-love/main" ], function (FindLove) {
            var findLove = router.findLove = new FindLove();
            $("body").append(findLove.$el);
          });
        });
      }
    },
    "service": function (params, callback) {
      var router = this;
      if (router.activeViewLvl1Name !== "service") {
        mainHeaderView.setDeactive();
        router.activeViewLvl1Name = "service";
        require([ "views/service/main" ], function (ServiceView) {
          if (router.activeViewLvl1) {
            var prevActive = router.activeViewLvl1;
            TweenMax.set(prevActive.$el, { position: "absolute" });
            TweenMax.to(prevActive.$el, 0.6, {
              opacity: 0,
              onComplete: function () { prevActive.remove(); }
            });
          }
          var serviceView = new ServiceView();
          router.activeViewLvl1 = serviceView;
          TweenMax.fromTo(serviceView.$el, 0.6, { opacity: 0 }, {
            opacity: 1
          });
          $("#main-section").append(serviceView.$el);
          if (callback) callback();
        });
      }
      else {
        if (callback) callback();
      }
    },
    initialize: function () {
      var router = this;
      this.on("all", function () {
        if (router.findLove && router.fragment !== "service/find-love") {
          router.findLove.close();
        }
      });
    }
  });

  new Router();

  Backbone.history.start();

  new MainView();

  });

});