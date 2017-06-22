<div class="qti-interaction qti-blockInteraction" data-serial="{{serial}}" >
    <h6>{{qtiClass}}</h6>
    <div class="render-error feedback-info">
        <span class="icon-error"></span>
        <p class="message">{{{message}}}</p>
        {{#if additional}}
        <div class="additional">
            <div class="title">Additional information:</div>
            <p class="info">{{{additional}}}</p>
        </div>
        {{/if}}
    </div>
    <div class="responses"></div>
</div>
