<div class="qti-object-container" data-serial="{{serial}}" >
    {{#if video}}<video {{#if attributes.id}}id="{{attributes.id}}"{{/if}} src="{{attributes.data}}" type="{{attributes.type}}" {{#if attributes.width}}width="{{attributes.width}}"{{/if}} {{#if attributes.height}}height="{{attributes.height}}{{/if}}" controls="controls" preload="none"></video>{{/if}}
    {{#if audio}}<audio {{#if attributes.id}}id="{{attributes.id}}"{{/if}} src="{{attributes.data}}" type="{{attributes.type}}"></audio>{{/if}}
    {{#if object}}<object {{#if attributes.id}}id="{{attributes.id}}"{{/if}} data="{{attributes.data}}" type="{{attributes.type}}" {{#if attributes.width}}width="{{attributes.width}}"{{/if}} {{#if attributes.height}}height="{{attributes.height}}"{{/if}}>{{attributes.alt}}</object>{{/if}}
    {{#if html}}<iframe {{#if attributes.id}}id="{{attributes.id}}"{{/if}} src="{{attributes.data}}" {{#if attributes.width}}width="{{attributes.width}}"{{/if}} {{#if attributes.height}}height="{{attributes.height}}"{{/if}}>{{attributes.alt}}</iframe>{{/if}}
</div>
