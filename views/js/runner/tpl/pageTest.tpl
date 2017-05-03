<section class="title">
{{#if logo}}
    <div class="logo">
        <img src="{{logo}}" alt="{{__ "Logo"}}" />
    </div>
{{/if}}
    <h1>{{title}}</h1>
{{#if subtitle}}
    <h2>{{subtitle}}</h2>
{{/if}}
{{#if date}}
    <h3>{{date}}</h3>
{{/if}}
{{#if qrcode}}
    <div class="qr-code"></div>
{{/if}}
</section>
