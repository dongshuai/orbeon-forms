/**
 * Copyright (C) 2009 Orbeon, Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Lesser General Public License as published by the Free Software Foundation; either version
 * 2.1 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * The full text of the license is available at http://www.gnu.org/copyleft/lesser.html
 */
YAHOO.namespace("xbl.fr");
YAHOO.xbl.fr.Accordion = {
    _instances: {},

    init: function(target) {
        var container = YAHOO.util.Dom.getAncestorByClassName(target, "xbl-fr-accordion");
        if (! YAHOO.xbl.fr.Accordion._instances[container.id]) {
            var dlElement = YAHOO.util.Dom.getElementsByClassName("xbl-fr-accordion-dl", null, container)[0];
            var operationElement = YAHOO.util.Dom.getElementsByClassName("xbl-fr-accordion-operation", null, container)[0];
            var openClosesOthersElement = YAHOO.util.Dom.getElementsByClassName("xbl-fr-accordion-open-closes-others", null, container)[0];
            var openClosesOthers = ORBEON.xforms.Document.getValue(openClosesOthersElement.id);

            // Create accordion menu
            new AccordionMenu.setting(dlElement.id, {
                dependent:  openClosesOthers == "true",
                openedIds:  [],
                easeOut:    false,
                animation:  true,
                seconds:    0.2
            });

            // Remove the expand class we might have on the repeat template, so when we add a case to an iteration,
            // the case we add is always closed.
            YAHOO.util.Dom.getElementsByClassName("xforms-repeat-template", "dt", container, function(dt) {
                YAHOO.util.Dom.removeClass(dt, "a-m-t-expand");
            });
            YAHOO.util.Dom.getElementsByClassName("xforms-repeat-template", "dd", container, function(dd) {
                YAHOO.util.Dom.removeClass(dd, "a-m-d-expand");
            });

            function expandOrCollapse(dt) {
                // Ignore dts generated by xforms:repeat
                if (! YAHOO.util.Dom.hasClass(dt, "xforms-repeat-template") && ! YAHOO.util.Dom.hasClass(dt, "xforms-repeat-delimiter")) {
                    var operation = ORBEON.xforms.Document.getValue(operationElement.id);
                    var isOpen = YAHOO.util.Dom.hasClass(dt, "a-m-t-expand");
                    var willBeOpen = operation == "show" || !isOpen && operation == "toggle";
                    if (isOpen != willBeOpen) {
                        var dl = dt.parentNode;
                        var dd = YAHOO.util.Dom.getNextSibling(dt);
                        var accordionExpandOrCollapse = willBeOpen ? AccordionMenu.expandCase : AccordionMenu.collapseCase;
                        accordionExpandOrCollapse(dl, dt, dd);
                    }
                }
            }

            YAHOO.xbl.fr.Accordion._instances[container.id] = {
                toggleAll: function() {
                    YAHOO.util.Dom.getElementsByClassName("a-m-t", null, container, function(dt) {
                        expandOrCollapse(dt);
                    });
                },
                toggle: function(target) {
                    // Target is group element, child of div, child of dd element, following dt
                    var dt = YAHOO.util.Dom.getPreviousSibling(target.parentNode.parentNode);
                    expandOrCollapse(dt);
                }
            };
        }
    },
    toggleAll: function(target) {
        // Target is container
        var container = target;
        YAHOO.xbl.fr.Accordion._instances[container.id].toggleAll();
    },
    toggle: function(target) {
        var container = YAHOO.util.Dom.getAncestorByClassName(target, "xbl-fr-accordion");
        YAHOO.xbl.fr.Accordion._instances[container.id].toggle(target);
    }
};
