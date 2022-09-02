// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Table, Container, Icon, Button } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { Hawala } from '@daml.js/hawalon';

type Props = {
  transferProposals: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][];
  partyToAlias: Map<Party, string>;
  username: string;
  onAccept: (cid: ContractId<Hawala.TransferProposal>) => void;
}

/**
 * React component to display a list of `TransferProposal`s, which can be accepted by the user
 */
const TransferProposalForMeList: React.FC<Props> = ({ transferProposals, partyToAlias, username, onAccept }) => {
  return (transferProposals.length > 0 ? (
    <Table basic='very' compact ='very' celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Origin</Table.HeaderCell>
          <Table.HeaderCell>Sender</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {[...transferProposals].map((tp, index) =>
          <Table.Row>
            <Table.Cell>{partyToAlias.get(tp[1].path[tp[1].path.length - 1])}</Table.Cell>
            <Table.Cell>{partyToAlias.get(tp[1].path[1])}</Table.Cell>
            <Table.Cell>{tp[1].amount}</Table.Cell>
            <Table.Cell textAlign='center'>
              <Button size='small' type="submit" className="test-select-accept-button" onClick={() => onAccept(tp[0])}>
                Accept
              </Button>
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

export default TransferProposalForMeList;
