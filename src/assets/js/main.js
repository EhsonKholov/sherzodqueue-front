!(function (o) {
    "use strict";
    o(window).scroll(function () {
        o(this).scrollTop() > 200 ? o(".backtotop:hidden").stop(!0, !0).fadeIn() : o(".backtotop").stop(!0, !0).fadeOut();
    }),
        o(function () {
            o(".scroll").on("click", function () {
                return o("html,body").animate({ scrollTop: 0 }, "slow"), !1;
            });
        }),
        o(window).on("scroll", function () {
            o(this).scrollTop() > 0 ? o(".site_header").addClass("sticky") : o(".site_header").removeClass("sticky");
        }),
        o(".pricing_toggle_btn").on("click", function () {
            o(this).toggleClass("active"), o(".pricing_item").toggleClass("active");
        }),
        o(document).ready(function () {
            o(".dropdown").on("mouseover", function () {
                o(this).find("> .dropdown-menu").addClass("show");
            }),
                o(".dropdown").on("mouseout", function () {
                    o(this).find("> .dropdown-menu").removeClass("show");
                });
        }),
        jQuery(".odometer").appear(function (o) {
            jQuery(".odometer").each(function () {
                var o = jQuery(this).attr("data-count");
                jQuery(this).html(o);
            });
        }),
        o(".popup_video").magnificPopup({ type: "iframe", preloader: !1, removalDelay: 160, mainClass: "mfp-fade", fixedContentPos: !1 }),
        o(".zoom-gallery").magnificPopup({
            delegate: ".popup_image",
            type: "image",
            closeOnContentClick: !1,
            closeBtnInside: !1,
            mainClass: "mfp-with-zoom mfp-img-mobile",
            gallery: { enabled: !0 },
            zoom: {
                enabled: !0,
                duration: 300,
                opener: function (o) {
                    return o.find("img");
                },
            },
        }),
        o(".carousel_1col").slick({ dots: !0, speed: 1e3, arrows: !0, infinite: !0, autoplay: !0, slidesToShow: 1, pauseOnHover: !0, autoplaySpeed: 5e3, prevArrow: ".c1c_arrow_left", nextArrow: ".c1c_arrow_right" }),
        o(".carousel_2col").slick({
            dots: !0,
            speed: 1e3,
            arrows: !0,
            infinite: !0,
            autoplay: !0,
            slidesToShow: 2,
            slidesToScroll: 2,
            pauseOnHover: !0,
            autoplaySpeed: 5e3,
            prevArrow: ".c2c_arrow_left",
            nextArrow: ".c2c_arrow_right",
            responsive: [{ breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } }],
        });
    const e = o(".certificates_carousel");
    e.slick({
        dots: !0,
        speed: 800,
        arrows: !0,
        infinite: !0,
        autoplay: !0,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: !0,
        autoplaySpeed: 4e3,
        centerPadding: "0px",
        prevArrow: ".c3c_arrow_left",
        nextArrow: ".c3c_arrow_right",
        responsive: [
            { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ],
    }),
        e.on("wheel", function (e) {
            e.preventDefault(), e.originalEvent.deltaY < 0 ? o(this).slick("slickPrev") : o(this).slick("slickNext");
        });
})(jQuery);
