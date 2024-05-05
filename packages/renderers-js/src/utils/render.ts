import { dirname as pathDirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { camelCase, kebabCase, pascalCase, snakeCase, titleCase } from '@kinobi-so/nodes';
import nunjucks, { ConfigureOptions as NunJucksOptions } from 'nunjucks';
import {
    compile as sqrlCompile,
    defaultConfig as sqrlDefaultConfig,
    filters as sqrlFilters,
    render as sqrlRender,
    templates as sqrlTemplates,
} from 'squirrelly';

export function jsDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    if (docs.length === 1) return `/** ${docs[0]} */\n`;
    const lines = docs.map(doc => ` * ${doc}`);
    return `/**\n${lines.join('\n')}\n */\n`;
}

export const render = (template: string, context?: object, options?: NunJucksOptions): string => {
    // @ts-expect-error import.meta will be used in the right environment.
    const dirname = typeof __dirname !== 'undefined' ? __dirname : pathDirname(fileURLToPath(import.meta.url));
    const templates = join(dirname, 'templates'); // Path to templates from bundled output file.
    const env = nunjucks.configure(templates, { autoescape: false, trimBlocks: true, ...options });
    env.addFilter('pascalCase', pascalCase);
    env.addFilter('camelCase', camelCase);
    env.addFilter('snakeCase', snakeCase);
    env.addFilter('kebabCase', kebabCase);
    env.addFilter('titleCase', titleCase);
    env.addFilter('jsDocblock', jsDocblock);
    return env.render(template, context);
};

let isSquirrellyInitialized = false;
function initSquirrelly() {
    if (isSquirrellyInitialized) return;
    sqrlFilters.define('pascalCase', pascalCase);
    sqrlFilters.define('camelCase', camelCase);
    sqrlFilters.define('snakeCase', snakeCase);
    sqrlFilters.define('kebabCase', kebabCase);
    sqrlFilters.define('titleCase', titleCase);
    sqrlFilters.define('jsDocblock', jsDocblock);
    isSquirrellyInitialized = true;
}

export const renderSquirrelly = (content: string, data: object = {}): string => {
    initSquirrelly();
    return sqrlRender(content, data, { useWith: true });
};

export const renderSquirrellyTemplate = (template: string, data: object = {}): string => {
    initSquirrelly();
    const content = sqrlTemplates.get(template);
    return content(data, { ...sqrlDefaultConfig, useWith: true });
};

export const registerSquirellyTemplate = (template: string, content: string): void => {
    sqrlTemplates.define(template, sqrlCompile(content, { useWith: true }));
};
