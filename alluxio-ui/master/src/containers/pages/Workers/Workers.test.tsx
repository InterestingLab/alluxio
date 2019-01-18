/*
 * The Alluxio Open Foundation licenses this work under the Apache License, version 2.0
 * (the "License"). You may not use this work except in compliance with the License, which is
 * available at www.apache.org/licenses/LICENSE-2.0
 *
 * This software is distributed on an "AS IS" basis, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied, as more fully set forth in the License.
 *
 * See the NOTICE file distributed with this work for information regarding copyright ownership.
 */

import {connectRouter, RouterState} from 'connected-react-router';
import {configure, mount, ReactWrapper, shallow, ShallowWrapper} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {createBrowserHistory, History, LocationState} from 'history';
import React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux';
import sinon, {SinonSpy} from 'sinon';

import configureStore from '../../../configureStore'
import {initialState, IApplicationState} from '../../../store';
import ConnectedApp from '../../App/App';
import {AllProps, Workers} from './Workers';

configure({adapter: new Adapter()});

describe('Workers', () => {
  let history: History<LocationState>;
  let store: Store<IApplicationState>;
  let props: AllProps;

  beforeAll(() => {
    history = createBrowserHistory({keyLength: 0});
    history.push('/workers');
    store = configureStore(history, initialState);
    props = {
      fetchRequest: sinon.spy(() => {}),
      data: initialState.workers.data,
      loading: initialState.workers.loading,
      refresh: initialState.refresh.refresh
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Shallow component', () => {
    let shallowWrapper: ShallowWrapper;

    beforeAll(() => {
      shallowWrapper = shallow(<Workers {...props}/>);
    });

    it('Renders without crashing', () => {
      expect(shallowWrapper.length).toEqual(1);
    });

    it('Matches snapshot', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });
  });

  describe('App with connected component', () => {
    let reactWrapper: ReactWrapper;

    beforeAll(() => {
      reactWrapper = mount(<Provider store={store}><ConnectedApp history={history}/></Provider>);
    });

    it('Renders without crashing', () => {
      expect(reactWrapper.length).toEqual(1);
    });

    it('Contains the component', () => {
      expect(reactWrapper.find('.workers-page').length).toEqual(1);
    });

    it('Calls fetchRequest', () => {
      sinon.assert.called(props.fetchRequest as SinonSpy);
    });

    it('Matches snapshot', () => {
      expect(reactWrapper).toMatchSnapshot();
    });
  });
});
