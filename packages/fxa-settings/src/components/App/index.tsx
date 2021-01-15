/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import AppLayout from '../AppLayout';
import LoadingSpinner from 'fxa-react/components/LoadingSpinner';
import AppErrorDialog from 'fxa-react/components/AppErrorDialog';
import * as Metrics from '../../lib/metrics';
import { Account } from '../../models';
import { ACCOUNT_FIELDS } from '../../models/Account';
import { Router } from '@reach/router';
import Head from 'fxa-react/components/Head';
import FlowContainer from '../FlowContainer';
import PageSettings from '../PageSettings';
import PageChangePassword from '../PageChangePassword';
import PageRecoveryKeyAdd from '../PageRecoveryKeyAdd';
import PageSecondaryEmailAdd from '../PageSecondaryEmailAdd';
import PageSecondaryEmailVerify from '../PageSecondaryEmailVerify';
import { PageDisplayName } from '../PageDisplayName';
import PageTwoStepAuthentication from '../PageTwoStepAuthentication';
import { Page2faReplaceRecoveryCodes } from '../Page2faReplaceRecoveryCodes';
import { PageDeleteAccount } from '../PageDeleteAccount';
import { ScrollToTop } from '../ScrollToTop';
import { HomePath } from '../../constants';
import { Config } from 'fxa-settings/src/lib/config';
import { observeNavigationTiming } from 'fxa-shared/metrics/navigation-timing';

export const GET_INITIAL_STATE = gql`
  query GetInitialState {
    ${ACCOUNT_FIELDS}
    session {
      verified
    }
  }
`;

type AppProps = {
  flowQueryParams: FlowQueryParams;
  config: Config;
};

export const App = ({ flowQueryParams, config }: AppProps) => {
  useEffect(() => {
    config.metrics.navTiming.enabled &&
      observeNavigationTiming(config.metrics.navTiming.endpoint);
  });

  const { loading, error } = useQuery<{ account: Account }>(GET_INITIAL_STATE);
  Metrics.init(flowQueryParams);

  if (loading) {
    return (
      <LoadingSpinner className="bg-grey-20 flex items-center flex-col justify-center h-screen select-none" />
    );
  }

  if (error) {
    return <AppErrorDialog data-testid="error-dialog" {...{ error }} />;
  }

  return (
    <AppLayout>
      <Head />
      <Router basepath={HomePath}>
        <ScrollToTop default>
          <PageSettings path="/" />
          <FlowContainer path="/avatar/change" title="Profile picture" />
          <PageDisplayName path="/display_name" />
          <PageChangePassword path="/change_password" />
          <PageRecoveryKeyAdd path="/account_recovery" />
          <PageSecondaryEmailAdd path="/emails" />
          <PageSecondaryEmailVerify path="/emails/verify" />
          <PageTwoStepAuthentication path="/two_step_authentication" />
          <Page2faReplaceRecoveryCodes path="/two_step_authentication/replace_codes" />
          <PageDeleteAccount path="/delete_account" />
        </ScrollToTop>
      </Router>
    </AppLayout>
  );
};

export default App;
