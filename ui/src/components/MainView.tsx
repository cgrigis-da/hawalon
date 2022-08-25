// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';
import { publicContext, userContext } from './App';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import LockedIouList from './LockedIouList';
import IouList from './IouList';

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const myUserResult = userContext.useStreamFetchByKeys(User.User, () => [username], [username]);
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  const allUsers = userContext.useStreamQueries(User.User).contracts;

  const allIous = userContext.useStreamQueries(Hawala.Iou).contracts;
  const allLockedIous = userContext.useStreamQueries(Hawala.LockedIou).contracts;
// USERS_END

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);

  // Map to translate party identifiers to aliases.
  const partyToAlias = useMemo(() =>
    new Map<Party, string>(aliases.contracts.map(({payload}) => [payload.username, payload.alias])),
    [aliases]
  );
  const myUserName = aliases.loading ? 'loading ...' : partyToAlias.get(username) ?? username;

  // IOUs
  const ious = useMemo(() =>
    allIous
    .map(iou => iou.payload)
    .filter(iou => iou.owner === username),
    [allIous]
  );

  // Locked IOUs
  const incomingLockedIous = useMemo(() =>
    allLockedIous
    .map(l => l.payload)
    .filter(l => l.iou.owner === username),
    [allLockedIous]
  );
  const outgoingLockedIous = useMemo(() =>
    allLockedIous
    .map(l => l.payload)
    .filter(l => l.iou.issuer === username),
    [allLockedIous]
  );

  // FOLLOW_BEGIN
  const ledger = userContext.useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.Follow, username, {userToFollow});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }
  // FOLLOW_END

  const redeem = async (iou: Hawala.Iou): Promise<boolean> => {
    return true;
  }

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUserName ? `Welcome, ${myUserName}!` : 'Loading...'}
            </Header>

            <Segment>
              <Header as='h2'>
              <Icon name='money bill alternate' />
                <Header.Content>
                  {myUserName ?? 'Loading...'}
                  <Header.Subheader>My IOUs</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <IouList
                ious={ious}
                partyToAlias={partyToAlias}
                onRedeem={redeem}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='long arrow alternate right' />
                <Header.Content>
                  Incoming
                  <Header.Subheader>The transfers that are proposed to me</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <LockedIouList
                lockedIous={incomingLockedIous}
                partyToAlias={partyToAlias}
                incoming={true}
                onFollow={follow}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='long arrow alternate left' />
                <Header.Content>
                  Outgoing
                  <Header.Subheader>The transfers in which I participate</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <LockedIouList
                lockedIous={outgoingLockedIous}
                partyToAlias={partyToAlias}
                incoming={false}
                onFollow={follow}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
