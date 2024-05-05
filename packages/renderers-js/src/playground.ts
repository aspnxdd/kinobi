import { registerSquirellyTemplate, renderSquirrellyTemplate } from './utils';

export function playground(): string {
    registerSquirellyTemplate('my-partial', 'Hello, {{name}}!');
    registerSquirellyTemplate('playground', myTemplate());

    return renderSquirrellyTemplate('playground', { name: 'Loris', number: 42 });
}

function myTemplate(): string {
    return `
<h1>Playground {{number}}</h1>
<p>My partial: {{@include("my-partial", {name: name})/}}</p>`;
}
