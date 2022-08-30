// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party, ContractId } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';
import { publicContext, userContext } from './App';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import LockedIouList from './LockedIouList';
import IouList from './IouList';
import TransferProposalList from './TransferProposalList';
import TransferProposalForMeList from './TransferProposalForMeList';
import { LockedIou } from '@daml.js/my-app/lib/Hawala';

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const myUserResult = userContext.useStreamFetchByKeys(User.User, () => [username], [username]);
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  const allUsers = userContext.useStreamQueries(User.User).contracts;
  const allHawalaAccounts = userContext.useStreamQueries(Hawala.HawalaAccount).contracts;

  const allIous = userContext.useStreamQueries(Hawala.Iou).contracts;
  const allLockedIous = userContext.useStreamQueries(Hawala.LockedIou).contracts;
  const allTransferProposals = userContext.useStreamQueries(Hawala.TransferProposal).contracts;
// USERS_END

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);


  const users = useMemo(() =>
    allHawalaAccounts
      .map(user => user.payload)
      .filter(user => user.owner !== username)
      .sort((x, y) => x.owner.localeCompare(y.owner)),
    [allHawalaAccounts, username]);

  console.log(users);

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
    [allIous, username]
  );

  // Transfer proposals
  const transferProposalsToForward: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][] = useMemo(() =>
    allTransferProposals
    .map(tp => [tp.contractId, tp.payload] as [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal])
    .filter(tp => (tp[1].intermediary === username && tp[1].destination !== username)),
    [allTransferProposals, username]
  );

  const transferProposalsForMe: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][] = useMemo(() =>
    allTransferProposals
    .map(tp => [tp.contractId, tp.payload] as [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal])
    .filter(tp => (tp[1].intermediary === username && tp[1].destination === username)),
    [allTransferProposals, username]
  );

  // Locked IOUs
  const lockedIous: [ContractId<Hawala.LockedIou>, Hawala.LockedIou][] = useMemo(() =>
    allLockedIous
    .map(l => [l.contractId, l.payload] as [ContractId<Hawala.LockedIou>, Hawala.LockedIou]),
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

  const unlock = async (cid: ContractId<LockedIou>): Promise<boolean> => {
    try {
      const password: string = prompt("Please enter password") || "";
      await ledger.exercise(Hawala.LockedIou.Unlock, cid, {password});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const chain = async (cid: ContractId<Hawala.TransferProposal>, party: string): Promise<boolean> => {
    try {
      await ledger.exercise(Hawala.TransferProposal.AcceptAndChain, cid, {next: party});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const accept = async (cid: ContractId<Hawala.TransferProposal>): Promise<boolean> => {
    try {
      await ledger.exercise(Hawala.TransferProposal.Accept, cid, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

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
                  {myUserName ? 'Assets' : 'Loading...'}
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
                  <Header.Subheader>Transfers for me</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <TransferProposalForMeList
                transferProposals={transferProposalsForMe}
                partyToAlias={partyToAlias}
                username={username}
                onAccept={accept}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='long arrow alternate right' />
                <Header.Content>
                  Incoming
                  <Header.Subheader>Transfers proposed to me</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <TransferProposalList
                transferProposals={transferProposalsToForward}
                partyToAlias={partyToAlias}
                username={username}
                users={users}
                onChain={chain}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='exchange' />
                <Header.Content>
                  Pending
                  <Header.Subheader>Transfers in which I participate</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <LockedIouList
                lockedIous={lockedIous}
                partyToAlias={partyToAlias}
                username={username}
                onUnlock={unlock}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
