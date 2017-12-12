<article class="qti-interaction qti-blockInteraction qti-choiceInteraction" data-serial="{{serial}}" data-qti-class="choiceInteraction">
  <span class="response-identifier">{{attributes.responseIdentifier}}</span>
  {{#if prompt}}{{{prompt}}}{{/if}}
  <ol class="plain block-listing solid choice-area{{#if horizontal}} horizontal{{/if}}">
      {{#choices}}{{{.}}}{{/choices}}
  </ol>
</article>
