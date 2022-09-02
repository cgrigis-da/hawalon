// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Table, Form, Button, Icon, Container, Grid } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { User, Hawala } from '@daml.js/hawalon';

type Props = {
  transferProposals: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][];
  partyToAlias: Map<Party, string>;
  username: string;
  users: User.Alias[];
  onForward: (cid: ContractId<Hawala.TransferProposal>, party: string) => Promise<boolean>;
}

/**
 * React component to display a list of `TransferProposal`s, which can be forwarded to a new party
 */
const TransferProposalList: React.FC<Props> = ({transferProposals, partyToAlias, username, users, onForward}) => {
  const initVal = new Array(transferProposals.length).fill(undefined);
  const [next, setNext] =
    React.useState<Array<[ContractId<Hawala.TransferProposal>, string] | undefined>>(initVal);

  const userToOption = (user: User.Alias) => {
    return {
      key: user.username,
      text: user.alias,
      value: user.username,
    };
  }
  const options = [...users].map((user: User.Alias) => userToOption(user));

  const onSubmit = (index: number) => async (event?: React.FormEvent) => {
    const nextElem = next[index];
    if (nextElem === undefined) return;

    await onForward(nextElem[0], nextElem[1]);
  }

  return (transferProposals.length > 0 ? (
    <Table basic='very' compact ='very' celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Transfer</Table.HeaderCell>
          <Table.HeaderCell>Sender</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Forward To</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {[...transferProposals].map((tp, index) =>
          <Table.Row>
            <Table.Cell>
              {partyToAlias.get(tp[1].path[tp[1].path.length - 1])}
              <Icon name='long arrow alternate right' />
              {partyToAlias.get(tp[1].destination)}
            </Table.Cell>
            <Table.Cell>{partyToAlias.get(tp[1].path[1])}</Table.Cell>
            <Table.Cell>{tp[1].amount}</Table.Cell>
            <Table.Cell textAlign='center'>
              <Form onSubmit={onSubmit(index)}>
                <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <Form.Select
                          fluid
                          search
                          allowAdditions
                          additionLabel="Insert a party identifier: "
                          additionPosition="bottom"
                          className="test-select-follow-input"
                          // Keep only the elements not present in the transfer proposal's path
                          options={options.filter(o => 
                            !tp[1].path.map(u => partyToAlias.get(u)).includes(o.text))}
                          onChange={(event, { value }) => {
                            next[index] = [tp[0], value?.toString() ?? ""];
                            setNext(next);
                          }}
                        />
                      </Grid.Column>
                      <Grid.Column width={1}>
                        <Button size='small' type="submit" className="test-select-forward-button">
                          Go
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                </Grid>
              </Form>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  ) : (
    <Container align='center'>
      <Icon name='minus' />
    </Container>
  ));
};

export default TransferProposalList;
