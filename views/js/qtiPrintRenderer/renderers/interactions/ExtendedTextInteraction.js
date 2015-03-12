/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA ;
 */

/**
 * The extended text interaction renderer
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'lodash',
    'tpl!taoQtiItemPrint/qtiPrintRenderer/tpl/interactions/extendedTextInteraction',
    'taoQtiItemPrint/qtiPrintRenderer/helpers/container',
], function(_, tpl, getContainer){
    'use strict';

    /**
     * parse the pattern (idealy from patternMask) and return the max words / chars from the pattern
     * @param  {String} pattern String from patternMask
     * @param  {String} type    the type of information you want : words / chars
     * @return {Number|null}    the number extracted of the pattern, or null if not found
     */
    var _parsePattern = function(pattern,type){
        if (pattern === undefined){return null;}

        var regexChar = /\^\[\\s\\S\]\{\d+\,(\d+)\}\$/,
        regexWords =  /\^\(\?\:\(\?\:\[\^\\s\\:\\!\\\?\\\;\\\…\\\€\]\+\)\[\\s\\:\\!\\\?\\;\\\…\\\€\]\*\)\{\d+\,(\d+)\}\$/,
        result;

        if (type === "words") {
            result = pattern.match(regexWords);
            if (result !== null && result.length > 1) {
                return parseInt(result[1],10);
            }else{
                return null;
            }
        }else if (type === "chars"){
            result = pattern.match(regexChar);

            if (result !== null && result.length > 1) {
                return parseInt(result[1],10);
            }else{
                return null;
            }
        }else{
            return null;
        }
    };

    /**
     * Expose the renderer
     * @exports taoQtiItemPrint/qtiPrintRenderer/renderers/interactions/ExtendedTextInteraction
     */
    return {
        qtiClass:           'extendedTextInteraction',
        template:           tpl,
        getContainer:       getContainer,
        getData:            function getCustomData (interaction, data){
            var pattern = interaction.attr('patternMask'),
                maxWords = parseInt(_parsePattern(pattern,'words')),
                maxLength = parseInt(_parsePattern(pattern, 'chars')),
                expectedLength = parseInt(interaction.attr('expectedLines'),10);
            return _.merge(data || {}, {
                maxWords:   (! isNaN(maxWords)) ? maxWords : undefined,
                maxLength:  (! isNaN(maxLength)) ? maxLength : undefined,
                attributes: (! isNaN(expectedLength)) ? { expectedLength :  expectedLength * 72} : undefined
            });
        }
    };
});
