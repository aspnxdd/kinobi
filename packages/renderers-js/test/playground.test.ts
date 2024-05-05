import test from 'ava';

import { playground } from '../src/index.js';

test('playground', t => {
    const foo = playground();
    console.log({ foo });

    t.pass();
});
