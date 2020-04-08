import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
// const App = React.lazy(() => import(/* webpackChunkName: "APP" */ './components/APP'));
import App from './components/APP';
const rootContainer: HTMLElement = document.getElementById('root') as HTMLElement;
ReactDOM.render(
    <Suspense fallback={null}>
        <App />
    </Suspense>,
    rootContainer
);
