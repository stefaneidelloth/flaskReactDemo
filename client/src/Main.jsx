import React from 'react';
import Hello from './Hello';
import { PageHeader } from 'react-bootstrap';

require('./css/flaskReactDemo.css');
var $ = require('jquery');


export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }  

    render () {
        return (
            <PageHeader>
                <div>                
                <Hello name='Foo' />
                </div>
            </PageHeader>
        );
    }
}
