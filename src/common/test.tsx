/**
 * Created by ushi on 22/03/16.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class TestClass {
    constructor() {
        console.log('Done!');

        ReactDOM.render(
            <h1>Hello, world!</h1>,
            document.getElementById('example')
    );
    }
}
