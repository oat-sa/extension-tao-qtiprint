<span class="qti-choice qti-inlineChoice" data-identifier="{{attributes.identifier}}" data-serial="{{serial}}">
    {{#if unique}}
    <input type="radio" id="response-{{interaction.serial}}-{{attributes.identifier}}"
           name="response-{{interaction.serial}}" value="{{attributes.identifier}}">
    {{else}}
    <input type="checkbox" id="response-{{interaction.serial}}-{{attributes.identifier}}"
           name="response-{{interaction.serial}}" value="{{attributes.identifier}}">
    {{/if}}
    <label for="response-{{interaction.serial}}-{{attributes.identifier}}">{{{body}}}</label>
</span>
