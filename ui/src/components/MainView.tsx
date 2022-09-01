// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party, ContractId, Decimal } from '@daml/types';
import { User, Hawala } from '@daml.js/hawalon';
import { publicContext, userContext } from './App';
import LockedIouList from './LockedIouList';
import IouList from './IouList';
import TransferProposalList from './TransferProposalList';
import TransferProposalForMeList from './TransferProposalForMeList';
import InitiateEdit from './InitiateEdit';

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);

  const allIous = userContext.useStreamQueries(Hawala.Iou).contracts;
  const allLockedIous = userContext.useStreamQueries(Hawala.LockedIou).contracts;
  const allTransferProposals = userContext.useStreamQueries(Hawala.TransferProposal).contracts;
  const allReveals = userContext.useStreamQueries(Hawala.Reveal).contracts;
// USERS_END

  const users = useMemo(() =>
    aliases.contracts
      .map(alias => alias.payload)
      .filter(alias => alias.username !== username)
      .sort((x, y) => x.alias.localeCompare(y.alias)),
      [aliases, username]
  );

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

  // Transfer proposals:
  // - to forward
  const transferProposalsToForward: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][] = useMemo(() =>
    allTransferProposals
      .map(tp => [tp.contractId, tp.payload] as [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal])
      .filter(tp => (tp[1].path[0] === username && tp[1].destination !== username)),
    [allTransferProposals, username]
  );

  // - to accept
  const transferProposalsForMe: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][] = useMemo(() =>
    allTransferProposals
      .map(tp => [tp.contractId, tp.payload] as [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal])
      .filter(tp => (tp[1].path[0] === username && tp[1].destination === username)),
    [allTransferProposals, username]
  );

  // Locked IOUs
  const lockedIous: [ContractId<Hawala.LockedIou>, Hawala.LockedIou][] = useMemo(() =>
    allLockedIous
      .map(l => [l.contractId, l.payload] as [ContractId<Hawala.LockedIou>, Hawala.LockedIou]),
    [allLockedIous]
  );

  // Map to associate locked IOUs to their password
  const lockedIouToPw = useMemo(() =>
    new Map<ContractId<Hawala.LockedIou>, string>(
      allReveals
        .map(({ payload }) => [payload.cid, payload.password])),
    [allReveals]
  );

  const ledger = userContext.useLedger();

  // Unlock a locked IOU
  const unlock = async (cid: ContractId<Hawala.LockedIou>): Promise<boolean> => {
    try {
      const password: string = prompt("Please enter password") || "";
      await ledger.exercise(Hawala.LockedIou.Unlock, cid, {password});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  // Accept a transfer proposal and forward it to the next hop
  const forward = async (cid: ContractId<Hawala.TransferProposal>, party: string): Promise<boolean> => {
    try {
      await ledger.exercise(Hawala.TransferProposal.AcceptAndForward, cid, {next: party});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  // Accept a transfer proposal
  const accept = async (cid: ContractId<Hawala.TransferProposal>): Promise<boolean> => {
    try {
      await ledger.exercise(Hawala.TransferProposal.Accept, cid, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  // Initiate a new transfer
  const initiate = async (origin: string, destination: string, intermediary: string,
    amount: Decimal, hash: string): Promise<boolean> => {
    try {
      const path = [intermediary, origin]
      await ledger.create(Hawala.TransferProposal,
        {path, destination, amount, hash, link: null});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  // Redeem an IOU
  const redeem = async (iou: Hawala.Iou): Promise<boolean> => {
    return true;
  }

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                Welcome to Hawalon!
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='send' />
                <Header.Content>
                  Initiate
                  <Header.Subheader>Send assets to another user</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <InitiateEdit
                users={users}
                username={username}
                onInitiate={initiate}
              />
            </Segment>

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
                <Icon name='sign-in' />
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
                <Icon name='retweet' />
                <Header.Content>
                  Intermediary
                  <Header.Subheader>Forwarding requests</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <TransferProposalList
                transferProposals={transferProposalsToForward}
                partyToAlias={partyToAlias}
                username={username}
                users={users}
                onForward={forward}
              />
            </Segment>

            <Segment>
              <Header as='h2'>
                <Icon name='exchange' />
                <Header.Content>
                  In progress
                  <Header.Subheader>Transfers in which I participate</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <LockedIouList
                lockedIous={lockedIous}
                lockedIouToPw={lockedIouToPw}
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
