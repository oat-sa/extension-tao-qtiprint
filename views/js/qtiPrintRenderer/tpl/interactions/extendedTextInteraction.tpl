<article class="qti-interaction qti-blockInteraction qti-extendedTextInteraction" data-serial="{{serial}}" data-qti-class="extendedTextInteraction">
    {{#if prompt}}{{{prompt}}}{{/if}}
    <div class="instruction-container"></div>
    {{#if multiple}}
        {{#each maxStringLoop}}
            <textarea class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}" name="{{attributes.identifier}}_{{this}}" {{#if attributes.patternMask}}pattern="{{attributes.patternMask}}"{{/if}}></textarea>
        {{/each}}
        {!-- If there's an expected length or a max length --}}
        {{#if attributes.expectedLength}}
            <div class="text-counter">
                <span class="count-chars">0</span> {{__ "of"}} {{attributes.expectedLength}} {{__ "chars"}} {{__ "recommanded"}}.
            </div>
        {{/if}}
        {{#if maxLength}}
            <div class="text-counter">
                <span class="count-chars">0</span> {{__ "of"}} {{maxLength}} {{__ "chars"}} {{__ "maximum"}}.
            </div>
        {{/if}}
        {{!-- If there's a max words --}}
        {{#if maxWords}}
            <div class="text-counter">
                <span class="count-words">0</span> {{__ "of"}} {{maxWords}} {{__ "words"}} {{__ "maximum"}}.
            </div>
        {{/if}}
    {{else}}
        <textarea class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}" {{#if attributes.patternMask}}pattern="{{attributes.patternMask}}"{{/if}}></textarea>
        {{!-- If there's an expected length or a max length --}}
        {{#if attributes.expectedLength}}
            <div class="text-counter">
                <span class="count-chars">0</span> {{__ "of"}} {{attributes.expectedLength}} {{__ "chars"}} {{__ "recommended"}}.
            </div>
        {{/if}}
        {{#if maxLength}}
            <div class="text-counter">
                <span class="count-chars">0</span> {{__ "of"}} {{maxLength}} {{__ "chars"}} {{__ "maximum"}}.
            </div>
        {{/if}}
        {{!-- If there's a max words --}}
        {{#if maxWords}}
            <div class="text-counter">
                <span class="count-words">0</span> {{__ "of"}} {{maxWords}} {{__ "words"}} {{__ "maximum"}}.
            </div>
        {{/if}}
    {{/if}}
</article>
