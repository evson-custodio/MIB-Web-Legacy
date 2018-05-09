const express = require('express');
const favicon = require('serve-favicon');
const consign = require('consign');
const path = require('path');

module.exports = (public) => {
    const app = express();

    consign({cwd: 'app'}).include('models').then('controllers').then('routes').into(app);

    app.use(favicon(path.join(public, 'favicon.png')));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(express.static(public));

    //Routes

    return app;
}