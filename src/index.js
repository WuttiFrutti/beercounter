import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./Assets/Base.scss";
import "./Assets/roboto.scss";
import * as ServiceWorker from "./Config/ServiceWorker"

ReactDOM.render(<App />,
  document.getElementById('root')
);

ServiceWorker.register();

