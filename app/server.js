import Express from 'express';
import path from 'path';
import mysql from 'mysql';
import React from 'react';
import { renderToString, renderToStaticMarkup} from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { RouterContext, match, createHistory } from 'react-router';
import routes from './routes';
import reducers from './reducers';
import promise from 'redux-promise';
import bodyParser from 'body-parser';
import { CONFIG_MYSQL } from '../config_server';

const app = new Express();
const router = Express.Router();
const port = 3000;

app.use(Express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.json());
app.use("/api", router);

// ROUTES FOR OUR API
// =============================================================================

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)

// more routes for our API will happen here
router.route('/users')
  .get(function(req, res){
      connection.query('SELECT * from user', function(err, rows){
          if(!err){
              res.json(rows);
          }
      });
  })

  .post(function(req, res){
      var post = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        description: req.body.description
      };
      connection.query('INSERT INTO user SET ?', post, function(err, rows){
        if(!err){
          res.status(201);
          res.json(rows);
        }
      });
  });

router.route('/users/:id')
  .get(function(req, res){
    connection.query('SELECT * from user WHERE id = ?', req.params.id, function(err, result){
        if(!err){
            res.json(result[0]);
        }
    });
  })

  .delete(function(req, res){
    connection.query('DELETE from user WHERE id = ?', req.params.id, function(err, result){
        if(!err){
            res.json(result[0]);
        }
    });
  });



app.use('/', handleRender);
const createStoreWithMiddleware = applyMiddleware(
  promise
)(createStore);

/* Setting Databases */
var connection = mysql.createConnection(CONFIG_MYSQL);

function handleRender(req, res) {
  const store = createStoreWithMiddleware(reducers);

  const initialState = store.getState();

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).send('<!doctype html>\n' + renderFullPage(
        renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>)
      ));
    } else {
      res.status(404).send('Not found');
    }
  })
}
function renderFullPage(html) {
  return `
    <html>
      <head>
        <link rel="stylesheet" href="/../style/style.css">
        <link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css" />
        <script src="https://maps.googleapis.com/maps/api/js"></script>
      </head>
      <body>
        <div id="container">${html}</div>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
    `
}



/* listening to the server */
var server = app.listen(port, () => {
	console.log('Listening on port %d', server.address().port);
});