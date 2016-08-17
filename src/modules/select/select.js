define([
    'automizy/core',
    'automizy/addons/jqueryAddOns',
    'automizy/functions/initBasicFunctions',
    'automizy/functions/registerLocalEvents',
    'automizy/images/icons',
    'automizy/modules/select/selectOptionBox',
    'automizy/modules/select/selectOption'
], function () {
    var Select = function (obj) {
        var t = this;
        t.d = {
            $widget: $('<div class="automizy-select automizy-empty"></div>'),
            $widgetTable: $('<table border="0" cellpadding="0" cellspacing="0" class="automizy-select-table"></table>'),
            $widgetTr: $('<tr class="automizy-select-tr"></tr>'),
            $widgetTdIcon: $('<td class="automizy-select-td-icon"></td>'),
            $widgetTdContent: $('<td class="automizy-select-td-content"></td>'),
            $widgetTdContentDiv: $('<div class="automizy-select-td-content-div"></div>'),
            $widgetTdArrow: $('<td class="automizy-select-td-arrow"></td>'),
            originalInput: $('<select></select>').data('automizy-select-remove', true),
            optionBox:$A.newSelectOptionBox().selectModule(t),
            options:[],
            groups:{},
            value: null,
            content:false,
            multiple:false,
            disabled: false,
            emptyText:$A.translate('Select an option'),
            selectedText:$A.translate('# items selected'),
            maxVisibleItems:2,
            width: 'auto',
            minWidth: 180,
            height: 'auto',
            id: 'automizy-select-' + $A.getUniqueString(),

            change: function () {
                if (t.change().returnValue() === false) {
                    return false;
                }
            }
        };
        t.f = {};
        t.init();


        t.d.$widgetTable.appendTo(t.d.$widget);
        t.d.$widgetTr.appendTo(t.d.$widgetTable);
        t.d.$widgetTdIcon.appendTo(t.d.$widgetTr);
        t.d.$widgetTdContent.appendTo(t.d.$widgetTr);
        t.d.$widgetTdContentDiv.appendTo(t.d.$widgetTdContent).html(t.d.emptyText);
        t.d.$widgetTdArrow.appendTo(t.d.$widgetTr);


        if (typeof obj !== 'undefined') {
            t.initParameter(obj);
        }

        t.widget().click(function(){
            t.open();
        });

        t.setupJQueryEvents();
    };

    var p = Select.prototype;


    p.setupJQueryEvents = function(){
        var t = this;
        t.originalInput().unbind('change', t.d.change).bind('change', t.d.change);
    };

    p.originalInput = function (originalInput) {
        var t = this;
        if (typeof originalInput !== 'undefined') {
            if(t.d.originalInput.data('automizy-select-remove') == true){
                t.d.originalInput.remove();
            }
            t.d.originalInput = originalInput;
            var $elem;
            if(t.width() === 'auto'){
                t.width(t.d.originalInput.width());
            }
            /*if(t.height() === 'auto'){
                t.height(t.d.originalInput.height());
            }*/
            if(typeof t.d.originalInput.input === 'function'){
                $elem = t.d.originalInput.input();
            }else{
                $elem = t.d.originalInput;
            }
            t.widget().insertAfter($elem);
            $elem.hide();
            $elem.data('automizy-select', t);
            t.d.originalInput.data('automizy-select', t);
            t.setupJQueryEvents();
            return t;
        }
        return t.d.originalInput;
    };
    p.optionBox = function () {
        return this.d.optionBox;
    };
    p.val = p.value = function (value) {
        var t = this;
        if (typeof value !== 'undefined') {
            t.d.value = value;
            t.unselectAll();
            if(typeof t.d.value === 'object' || typeof t.d.value === 'array'){
                for(var i = 0; i < t.d.options.length; i++){
                    for(var j = 0; j < t.d.value.length; j++){
                        if(t.d.options[i].val() == t.d.value[j]){
                            t.d.options[i].select();
                        }
                    }
                }
            }else{
                for(var i = 0; i < t.d.options.length; i++){
                    if(t.d.options[i].val() == t.d.value){
                        t.d.options[i].select();
                        break;
                    }
                }
            }
            t.d.originalInput.val(t.d.value).trigger('change');
            return t;
        }
        return t.d.value;
    };
    p.content = function (content) {
        var t = this;
        if (typeof content !== 'undefined') {
            t.d.content = content;
            t.d.$widgetTdContentDiv.html(t.d.content);
            return t;
        }
        return t.d.content;
    };
    p.icon = function (icon) {
        var t = this;
        if (typeof icon !== 'undefined') {
            t.d.icon = icon;
            t.d.$widgetTdIcon.html(t.d.content);
            return t;
        }
        return t.d.content;
    };
    p.multiple = function (multiple) {
        var t = this;
        if (typeof multiple !== 'undefined') {
            t.d.multiple = $A.parseBoolean(multiple);
            if(typeof t.d.originalInput.multiple !== 'undefined'){
                t.d.originalInput.multiple(t.d.multiple);
            }else{
                t.d.originalInput.attr('multiple', t.d.multiple);
            }

            if(t.d.multiple === true){
                t.widget().addClass('automizy-multiple');
            }else{
                t.widget().removeClass('automizy-multiple');
            }

            return t;
        }
        return t.d.multiple;
    };
    p.disabled = function (disabled) {
        var t = this;
        if (typeof disabled !== 'undefined') {
            t.d.disabled = $A.parseBoolean(disabled);
            if(typeof t.d.originalInput.disabled !== 'undefined'){
                t.d.originalInput.disabled(t.d.disabled);
            }else{
                t.d.originalInput.attr('disabled', disabled);
            }
            return t;
        }
        return t.d.disabled;
    };
    p.disable = function () {
        return this.disabled(true);
    };
    p.enable = function () {
        return this.disabled(false);
    };
    p.unselectAll = function (triggerChange) {
        var t = this;
        var triggerChange = triggerChange || false;
        for(var i = 0; i < t.d.options.length; i++){
            t.d.options[i].unselect();
        }
        if(triggerChange){
            t.originalInput().trigger('change');
        }
        return t;
    };
    p.width = function (width) {
        var t = this;
        if (typeof width !== 'undefined') {
            t.d.width = Math.max(width, t.minWidth());
            t.widget().css('width', t.d.width);
            t.d.$widgetTdContentDiv.css('max-width', t.widget().width() - 12 + 'px');
            return t;
        }
        return t.d.width;
    };
    p.minWidth = function (minWidth) {
        var t = this;
        if (typeof minWidth !== 'undefined') {
            t.d.minWidth = minWidth;
            return t;
        }
        return t.d.minWidth;
    };
    /*p.height = function (height) {
        var t = this;
        if (typeof height !== 'undefined') {
            t.d.height = height;
            t.d.$widgetTable.css('height', t.d.height);
            return t;
        }
        return t.d.height;
    };*/
    p.refreshValue = function () {
        var t = this;
        var options = t.d.options;
        var textValues = [];
        var values = [];

        for(var i = 0; i < options.length; i++){
            if(options[i].selected()){
                textValues.push(options[i].textValue());
                values.push(options[i].val());
            }
        }
        if(textValues.length <= 0){
            t.content(t.emptyText());
            t.widget().addClass('automizy-empty');
        }else {
            if(textValues.length > t.maxVisibleItems()){
                t.content(t.selectedText().replace("#", textValues.length));
            }else {
                t.content(textValues.join(', '));
            }
            t.widget().removeClass('automizy-empty');
        }

        if(values.length > 0) {
            if (t.multiple()) {
                t.d.value = values;
            } else {
                t.d.value = values[0];
            }
            t.originalInput().val(t.d.value);
        }else{
            t.d.value = null;
            t.originalInput().prop("selectedIndex", -1);
        }

        return t;
    };
    p.cleanGroups = function () {
        var t = this;
        var groups = t.d.groups;
        var usableGroups = [];
        var options = t.d.options;
        for(var i = 0; i < options.length; i++){
            var group = options[i].group();
            if(usableGroups.indexOf(group) < 0){
                usableGroups.push(group);
            }
        }
        for(var i in groups){
            if(usableGroups.indexOf(i) < 0){
                groups[i].$titleTd.remove();
                groups[i].$separatorTd.remove();
                groups[i].$titleTr.remove();
                groups[i].$separatorTr.remove();
                delete groups[i];
            }
        }
        return t;
    };
    p.emptyText = function(emptyText){
        var t = this;
        if (typeof emptyText !== 'undefined') {
            t.d.emptyText = emptyText;
            return t;
        }
        return t.d.emptyText;
    };
    p.selectedText = function(selectedText){
        var t = this;
        if (typeof selectedText !== 'undefined') {
            t.d.selectedText = selectedText;
            return t;
        }
        return t.d.selectedText;
    };
    p.maxVisibleItems = function(maxVisibleItems){
        var t = this;
        if (typeof maxVisibleItems !== 'undefined') {
            t.d.maxVisibleItems = parseInt(maxVisibleItems);
            return t;
        }
        return t.d.maxVisibleItems;
    };


    p.removeOptions = function () {
        var t = this;
        for(var i = 0; i < t.d.options.length; i++){
            t.d.options[i].remove();
        }
        t.cleanGroups();
        return t;
    };
    p.removeOption = function (value) {
        var t = this;
        for(var i = 0; i < t.d.options.length; i++){
            if(t.d.options[i].val() == value){
                t.d.options[i].remove();
            }
        }
        t.cleanGroups();
        return t;
    };
    p.addOption = function(option){
        return this.addOptions([option]);
    };
    p.options = function (options) {
        var t = this;
        if (typeof options !== 'undefined') {
            t.removeOptions();
            t.addOptions(options);
            return t;
        }
        return t.d.options;
    };
    p.addOptions = function(options, before){
        var t = this;
        var val = t.val();
        var before = before || false;
        for(var i = 0; i < options.length; i++){
            options[i].selectModule = t;
            options[i].selectOptionBoxModule = t.optionBox();
            if(options[i].selected === true){
                hasSelected = true;
            }
            var option = $A.newSelectOption(options[i], false);
            t.d.options.push(option);
        }
        t.refreshValue();
        t.originalInput().change();
        return t;
    };


    p.beforeOpen = function (func, name, life) {
        return this.d.optionBox.beforeOpen.apply(this.d.optionBox, [func, name, life]);
    };
    p.beforeClose = function (func, name, life) {
        return this.d.optionBox.beforeClose.apply(this.d.optionBox, [func, name, life]);
    };
    p.open = function (func, name, life) {
        return this.d.optionBox.open.apply(this.d.optionBox, [func, name, life]);
    };
    p.close = function (func, name, life) {
        return this.d.optionBox.close.apply(this.d.optionBox, [func, name, life]);
    };

    p.change = function (func, name, life) {
        var t = this;
        if (typeof func === 'function') {
            t.addFunction('change', func, name, life);
        } else {
            var a = t.runFunctions('change');
            t.returnValue(!(t.disabled() === true || a[0] === false || a[1] === false));
        }
        return t;
    };



    $A.initBasicFunctions(Select, "Select", ['change']);


    $.fn.automizySelect = function () {
        var lastElement = false;
        if(typeof this.data('automizy-select') !== 'undefined'){
            return this.data('automizy-select');
        }
        this.each(function(){
            var selectModule = $A.newSelect();
            var $t = $(this);

            if($t.prop("tagName").toLowerCase() !== 'select'){
                var $newElem = $('<select></select>');
                $.each(this.attributes, function() {
                    $newElem.attr(this.name, this.value);
                });
                $t.replaceWith($newElem);
                $t = $newElem;
            }


            selectModule.multiple($t.is("[multiple]")).originalInput($t);

            var options = [];
            $t.find('option').each(function(){
                var $to = $(this);
                var option = {
                    value:$to.attr('value'),
                    html:$to.html(),
                    disabled:$to.is(':disabled'),
                    selected:$to.is(':selected')
                };
                var optgroup = $to.closest('optgroup');
                if(optgroup.length >= 0){
                    option.group = optgroup.attr('label');
                }

                options.push(option);
            });
            selectModule.options(options);

            $t.data('automizy-select', selectModule);

            lastElement = selectModule;
        });
        return lastElement;
    };


});