import React from 'react'
import { Route } from 'react-router-dom'
import { Provider } from './context'
import { createBrowserHistory } from 'history'

import CaptureRepo from './captureRepo'
import CaptureRule from './captureRule'

const history = createBrowserHistory()

export default (
  <Provider history={history}>
    <React.Fragment>
      <Route exact path="/option/captureRepo" component={CaptureRepo} />
      <Route path="/option/captureRule" component={CaptureRule} />
    </React.Fragment>
  </Provider>
)
