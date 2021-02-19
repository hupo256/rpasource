import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import BaseLayout from './layout/baseLayout'

import BackHome from './pages/options/components/backHome' // home
import Options from './pages/options' // 设置
import Activate from './pages/activate' //开通服务

const routes = () => (
  <BrowserRouter basename="/rpasource/gobbler">
    <Switch>
      <Route
        path="/"
        component={() => {
          return (
            <BaseLayout>
              <React.Fragment>
                <Route exact path="/home" render={() => <BackHome />} />
                {Options}
                {Activate}
              </React.Fragment>
            </BaseLayout>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)

export default routes
