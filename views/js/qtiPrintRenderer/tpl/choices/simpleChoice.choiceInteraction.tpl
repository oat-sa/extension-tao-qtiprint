<li class="qti-choice qti-simpleChoice" data-identifier="{{attributes.identifier}}" data-serial="{{serial}}">
        {{#if unique}}
        <input type="radio" name="response-{{interaction.serial}}" value="{{attributes.identifier}}">
        {{else}}
        <input type="checkbox" name="response-{{interaction.serial}}" value="{{attributes.identifier}}">
        {{/if}}
        <label for="response-{{interaction.serial}}">{{{body}}}</label>
</li>
