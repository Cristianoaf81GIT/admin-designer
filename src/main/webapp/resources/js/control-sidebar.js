$(function () {

    'use strict'

    /**
     * Get access to plugins
     */

    $('[data-toggle="control-sidebar"]').controlSidebar()
    $('[data-toggle="push-menu"]').pushMenu()


    var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')


    function changeLayout(cls) {
        $('body').toggleClass(cls)
        $controlSidebar.fix()
    }

    function updateSidebarSkin(sidebarSkin) {
        var $sidebar = $('.control-sidebar');
        var sidebarSkinCkbox = $('#sidebar-skin span.ui-chkbox-icon');
        if (sidebarSkin === 'control-sidebar-light') {
            $sidebar.removeClass('control-sidebar-dark');
            sidebarSkinCkbox.addClass('ui-icon-blank');
            sidebarSkinCkbox.removeClass('ui-icon-check');
            sidebarSkinCkbox.parent().removeClass('ui-state-active');
        } else {
            $sidebar.removeClass('control-sidebar-light');
            sidebarSkinCkbox.addClass('ui-icon-check');
            sidebarSkinCkbox.removeClass('ui-icon-blank');
            sidebarSkinCkbox.parent().addClass('ui-state-active');
        }

        $sidebar.addClass(sidebarSkin);

        store('layout.sidebar-skin', sidebarSkin);
    }

    function updateBoxedLayout(boxedLayout) {
        var boxedLayoutCkbox = $('#boxed-layout span.ui-chkbox-icon');
        
        if(isMobile()) {
            boxedLayoutCkbox.addClass('ui-state-disabled');
            $('#boxed-layout, #boxed-layout-label').addClass('ui-state-disabled');
            store('layout.boxed', false);
        }
        
        if (boxedLayout === true || boxedLayout === 'true') {
            boxedLayoutCkbox.addClass('ui-icon-check');
            boxedLayoutCkbox.removeClass('ui-icon-blank');
            boxedLayoutCkbox.parent().addClass('ui-state-active');
            $('body').addClass('layout-boxed');
        } else {
            boxedLayoutCkbox.addClass('ui-icon-blank');
            boxedLayoutCkbox.removeClass('ui-icon-check');
            boxedLayoutCkbox.parent().removeClass('ui-state-active');
            $('body').removeClass('layout-boxed')
        }
        store('layout.boxed', boxedLayout);

    }

    function updateFixedLayout(fixedLayout) {
        if(isMobile()) { //fixed layout not compatible with small screens (admin-template already has behaviour for navbar when on mobile)
            $('#fixed-layout, #fixed-layout span.ui-chkbox-icon, #fixed-layout-label').addClass('ui-state-disabled');
            store('layout.fixed', false);
            return;
        }
        if (fixedLayout === true || fixedLayout === 'true') {
            if(!$('body').hasClass('fixed')) {
                $('body').addClass('fixed');
            }
            if(!PF('fixedLayout').input.is(':checked')) {//it will not be checked when the value comes from browser local storage 
                PF('fixedLayout').toggle();
            }
        } else {
            if($('body').hasClass('fixed')) {
                $('body').removeClass('fixed');
            }
            if(PF('fixedLayout').input.is(':checked')) {//update input when value comes from local storage
                PF('fixedLayout').toggle();
            }
        }
        store('layout.fixed', fixedLayout);
    }


    function updateSidebarToggle(sidebarControlOpen) {
        var sidebarOpenCkbox = $('#control-sidebar-toggle span.ui-chkbox-icon');
        if (sidebarControlOpen === true || sidebarControlOpen === 'true') {
            sidebarOpenCkbox.addClass('ui-icon-check');
            sidebarOpenCkbox.removeClass('ui-icon-blank');
            sidebarOpenCkbox.parent().addClass('ui-state-active');
            $('.control-sidebar').addClass('control-sidebar-open');
            $('body').addClass('control-sidebar-open');
        } else {
            sidebarOpenCkbox.addClass('ui-icon-blank');
            sidebarOpenCkbox.removeClass('ui-icon-check');
            sidebarOpenCkbox.parent().removeClass('ui-state-active');
            $('.control-sidebar').removeClass('control-sidebar-open')
            $('body').removeClass('control-sidebar-open');
        }

        store('layout.sidebar-control-open', sidebarControlOpen);

    }

    function loadSidebarExpand() {
        var expandOnHover = get('layout.sidebar-expand-hover');
        var sidebarExpandCkbox = $('#sidebar-expand-hover span.ui-chkbox-icon');
        
        if(isMobile() || $('body').hasClass('layout-top-nav')) {
            sidebarExpandCkbox.addClass('ui-state-disabled');
            $('#sidebar-expand-hover, #sidebar-expand-hover-label').addClass('ui-state-disabled');
            store('layout.sidebar-expand-hover', false);
            return;
        }
        
        if (expandOnHover === true || expandOnHover === 'true') {
            PF('sidebarExpand').input.click();
            $pushMenu.expandOnHover();
            collapseSidebar();
            sidebarExpandCkbox.removeClass('ui-icon-blank');
            sidebarExpandCkbox.addClass('ui-icon-check');
            sidebarExpandCkbox.parent().addClass('ui-state-active');
            return;
        }
    }

    function updateSidebarExpand() {
        var expandOnHover = PF('sidebarExpand').input.is(':checked');
        var sidebarExpandCkbox = $('#sidebar-expand-hover span.ui-chkbox-icon');
        
        if(isMobile() || $('body').hasClass('layout-top-nav')) {
            sidebarExpandCkbox.addClass('ui-state-disabled');
            $('#sidebar-expand-hover, #sidebar-expand-hover-label').addClass('ui-state-disabled');
            store('layout.sidebar-expand-hover', false);
            return;
        }

        if (expandOnHover) {
            $pushMenu.expandOnHover();
            collapseSidebar();
        } else {
            sidebarExpandCkbox.addClass('ui-icon-blank');
            sidebarExpandCkbox.removeClass('ui-icon-check');
            sidebarExpandCkbox.parent().removeClass('ui-state-active');
            expandSidebar();
            $('[data-toggle="push-menu"]').data('lte.pushmenu', null); //not working, see https://github.com/almasaeed2010/AdminLTE/issues/1843#issuecomment-379550396
            $('[data-toggle="push-menu"]').pushMenu({expandOnHover: false});
            $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu');
        }

        store('layout.sidebar-expand-hover', expandOnHover);

    }
    
    function updateTemplate() {
        var isDefaultTemplate = PF('toggleLayout').input.is(':checked');
        store('layout.default-template',isDefaultTemplate);
    }
    
    

    function loadSkin() {
        var skin = get('layout.skin');
        if (skin && !$('body').hasClass(skin)) {
            $('#btn-'+skin).click();
        }
    }
    
    function loadTemplate() {
         var isDefaultTemplate = get('layout.default-template');
         if (isDefaultTemplate === "true" && $('body').hasClass('layout-top-nav')) {
             PF('toggleLayout').toggle();
         } else if(isDefaultTemplate === "false" && !$('body').hasClass('layout-top-nav')) {
             PF('toggleLayout').toggle();
         }
         
    }


    /**
     * Retrieve stored settings and apply them to the template
     *
     * @returns void
     */
    function setup() {

        var sidebarSkin = get('layout.sidebar-skin');

        if (!sidebarSkin) {
            sidebarSkin = 'control-sidebar-dark';
        }

        updateSidebarSkin(sidebarSkin);

        updateSidebarToggle(get('layout.sidebar-control-open'));



        var boxedLayout = get('layout.boxed');

        if (!boxedLayout) {
            boxedLayout = false;
        }

        updateBoxedLayout(boxedLayout);

        var fixedLayout = get('layout.fixed');
        
        if(fixedLayout === null) {
            fixedLayout = PF('fixedLayout').input.is(':checked');
        }  

        updateFixedLayout(fixedLayout);

        loadSidebarExpand();


        $('#sidebar-skin').on('click', function () {
            var sidebarSkin;
            if ($('.control-sidebar').hasClass('control-sidebar-dark')) {
                sidebarSkin = 'control-sidebar-light';
            } else {
                sidebarSkin = 'control-sidebar-dark';
            }
            setTimeout(function () {
                updateSidebarSkin(sidebarSkin);
            }, 20);
        });

        $('#boxed-layout .ui-chkbox-box, #boxed-layout-label').on('click', function () {
            var boxedLayout = !$('body').hasClass('layout-boxed');
            setTimeout(function () {
                changeLayout('layout-boxed');
                updateBoxedLayout(boxedLayout);
            }, 20);
        });

        $('#fixed-layout .ui-chkbox-box, #fixed-layout-label').on('click', function () {
            var fixedLayout = !$('body').hasClass('fixed');
            setTimeout(function () {
                updateFixedLayout(fixedLayout);
            }, 20);
        });

        $('#control-sidebar-toggle .ui-chkbox-box, #control-sidebar-toggle-label').on('click', function () {
            setTimeout(function () {
                changeLayout('control-sidebar-open');
                updateSidebarToggle($('body').hasClass('control-sidebar-open'));
            }, 20);

        });


        $('#sidebar-expand-hover .ui-chkbox-box, #sidebar-expand-hover-label').on('click', function () {
            setTimeout(function () {
                updateSidebarExpand();
            }, 20);
        });

        $('#sidebar-toggle .ui-chkbox-box, #sidebar-toggle-label').on('click', function () {
            $('.sidebar-toggle').click();
        });


        $('#content').click(function () {
            $('.control-sidebar').removeClass('control-sidebar-open');
        });
        
        $('#toggle-menu-layout .ui-chkbox-box, #toggle-menu-layout').on('click', function () {
            setTimeout(function () {
                updateTemplate();
            }, 20);
        });
        
        
        loadTemplate();

        loadSkin();

    }


    $(document).on("pfAjaxComplete", function () {
        setTimeout(function () {
            setup();
        }, 20);
    });


    $(document).ready(function () {
        setTimeout(function () {
            setup();
        }, 20);
    });


});