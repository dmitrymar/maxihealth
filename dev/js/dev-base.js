/*global window: false, Mustache */

//Zopim start
//Must have
window.$zopim || (function (d, s) {
    var z = $zopim = function (c) {
        z._.push(c)
    }, $ = z.s =
            d.createElement(s),
        e = d.getElementsByTagName(s)[0];
    z.set = function (o) {
        z.set.
        _.push(o)
    };
    z._ = [];
    z.set._ = [];
    $.async = !0;
    $.setAttribute('charset', 'utf-8');
    $.src = '//cdn.zopim.com/?VFTJj9YzpezsD2DIe9fDVPUlxBmWZAFV';
    z.t = +new Date;
    $.
    type = 'text/javascript';
    e.parentNode.insertBefore($, e)
})(document, 'script');

//Optional to toggle from chat to send message
$zopim(function () {
    $zopim.livechat.setOnStatus(change_chat_img);
});

function change_chat_img(status) {
    var img = document.getElementById('chat_img');
    if (status == 'online')
        img.src = '/images/chat-live-button.png';
    else if (status == 'away')
        img.src = '/images/send-msg-btn.png';
    else if (stats === 'offline')
        img.src = '/images/send-msg-btn.png';
}
//Zopim end

var App = {
    timestamp: Number(new Date())
};

Modernizr.load({
    test: Modernizr.input.placeholder,
    nope: ['/js/Placeholders.min.js', '/js/placeholders.init.js', ]
});

jQuery.noConflict();

// Put all your jquery code in your document ready area to avoid conflict with prototype
jQuery(document).ready(function ($) {



    var Album = (function () {

        var $adsPageThumbs = $("#adsPageThumbs");
        var $adspageImgWrap = $adsPageThumbs.find(".adspage-img-wrap");
        var $bgElements = $("#main_container");
        var $modalWindow = $("#adsModalContainer");
        var $overlay = $("#adsModalOverlay");
        var current_ad_id = "";
        var current_ad_link = "";
        var modalURL = "/includes/boxes/modal-gallery.php";
        var sidbarAdWrap = $("#sidebar-adgroup");

        var init = function () {
            bindEvents();
        };

        function bindEvents() {
            $adspageImgWrap.on("mouseenter mouseleave", toggleZoomIcon)
                .on("click", displayGallery);
            $adsPageThumbs.find(".adspage-title").on("click", displayGallery);
            $("#sidebar-slides").on("click", displayGallery);
            $modalWindow.on("click", '.ads-modal-close', closeModal)
                .on("click", ".ads-modal-sidebar ul li", setImgID)
                .on("click", ".ads-modal-arrow", navigate)
                .on("load", "#modalGalleryWrap");

        }

        function setImgID(e) {
            var $li = $(e.target).closest("li");
            current_ad_id = $li.data("id");
            current_ad_link = $li.data("link");
            switchImage();
        }

        function highlightThumb() {
            $modalWindow.find(".ads-modal-sidebar ul li").removeClass("ads-modal-selected");
            $("#modalThumbID" + current_ad_id).addClass("ads-modal-selected");
        }

        function setBigImage() {
            var $bigImage = $modalWindow.find(".ads-modal-img");
            $bigImage.find("img").remove();
            $bigImage.find("a").append("<img src='/images/ads/" + current_ad_id + "_large.png'>")
                .attr('href', current_ad_link);

        }

        function switchImage() {
            $bgElements.fadeOut('fast', function () {
                $modalWindow.fadeIn('slow', function () {
                    $overlay.show();
                    highlightThumb();
                    setBigImage();
                    scrollThumbIntoView(); //scroll to selected image 

                });
            });
        }

        function displayGallery(e) {
            e.preventDefault();
            var $thumb = $(e.target).closest("li");
            current_ad_id = $thumb.data("id");
            current_ad_link = $thumb.data("link");
            $modalWindow.load(modalURL, switchImage);
        }

        function scrollThumbIntoView() {
            var $sidebar = $modalWindow.find(".ads-modal-thumbs");
            var $totalAds = $sidebar.find("li").length;
            var $adItem = $("#modalThumbID" + current_ad_id);
            var $thumbIndex = $sidebar.find("li").index($adItem) + 1;
            var $sidebarHeight = $sidebar.height();
            var oneThumbHeight = $sidebarHeight / $totalAds;
            var multipleThumbsHeight = (oneThumbHeight) * $thumbIndex;
            var thumbOffset = 0;

            for (var i = 0; i < $totalAds; i = i + 3) {
                if (multipleThumbsHeight > oneThumbHeight * i) {
                    thumbOffset = oneThumbHeight * i;
                }
            }

            $modalWindow.find(".ads-modal-sidebar").animate({
                scrollTop: thumbOffset
            }, 500);


        }

        function navigate(e) {
            e.preventDefault();
            var listNode = $modalWindow.find(".ads-modal-sidebar ul li");
            var $direction = $(e.target).closest(".ads-modal-arrow").data("navigate");
            var current_id = listNode.filter('[data-id=' + current_ad_id + ']');
            var first_id = listNode.first().data("id");
            var last_id = listNode.last().data("id");
            var next_id = current_id.next().data("id");
            next_id = next_id === null ? first_id : next_id;
            var prev_id = current_id.prev().data("id");
            prev_id = prev_id === null ? last_id : prev_id;
            current_ad_id = $direction === 'next' ? next_id : prev_id;
            switchImage();
        }

        function closeModal(e) {
            e.preventDefault();
            $modalWindow.fadeOut('fast', function () {
                $overlay.hide();
                window.location.hash = "";
                $bgElements.fadeIn('slow');
            });
        }

        function toggleZoomIcon(e) {
            $(e.target).parent().find(".adspage-zoom-icon").toggleClass("hidden");
        }
        return {
            init: init
        };
    })();


    var Mainapp = (function () {

        function displaySidebarSlides() {
            var $leftmenu = $('#left_menu');

            $leftmenu
                .find(".sidebar-slides")
                .before('<div class="sidebar-slide-dash">')
                .cycle({
                fx: 'fade',
                force: 1,
                timeout: 8000,
                pause: 1,
                pauseOnPagerHover: 1,
                pager: '.sidebar-slide-dash'
            });


        }
        var init = function () {
            displaySidebarSlides();
            Album.init();
        };



        return {
            init: init
        };
    })();

    Mainapp.init();




    $("#searchInput").autocomplete({
        source: "/ajax/suggest4.json",
        minLength: 2,
        focus: function (event, ui) {
            $("#searchInput").val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            var pageURL = $("#ui-active-menuitem").attr("href");
            if (pageURL != '') {
                window.location.href = pageURL;
            }

            if (ui.item.url) {
                window.location.href = "/products/" + ui.item.url + ".html";
            }

        },
        open: function (event, ui) {
            $("ul.ui-autocomplete, ul.ui-autocomplete li a").removeClass("ui-corner-all");
            $('<li class="ui-menu-item other-search" id="saLink"><a href="/search/alphabetically/">Search&nbsp;Alphabetically</a></li><li class="ui-menu-item other-search" id="sbiLink"><a href="/search/by-ingredients.html" style="border:0">Search&nbsp;by&nbsp;Ingredients</a></li>').appendTo('ul.ui-autocomplete.ui-menu');

            /*$("#saLink a, #sbiLink a").hover(function () {$(this).toggleClass("ui-state-hover")});*/
            $("#saLink a, #sbiLink a").mouseover(function () {
                $(this).addClass("ui-state-hover");
                $(this).attr('id', 'ui-active-menuitem');
            });
            $("#saLink a, #sbiLink a").mouseout(function () {
                $(this).removeClass("ui-state-hover");
                $(this).attr('id', '');
            });

            $("#saLink a, #sbiLink a").click(function () {
                window.location.href = $("#ui-active-menuitem").attr("href")
            });

        }
    }).data("autocomplete")._renderItem = function (ul, item) {
        return $("<li></li>").data("item.autocomplete", item).append('<a><ul id="autocomleteItem"><li><img src="/images/products/' + (item.value) + '_t.png?dateStamp=' + App.timestamp + '"></li><li>' + item.label + '</li></ul></a>').appendTo(ul);
    }


    $("#header .menu .m>a.last").click(function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $('#storesDropDown').slideToggle('active');
    });

});