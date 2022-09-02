// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Table, Icon, Container } from 'semantic-ui-react'
import { Party } from '@daml/types';
import { Hawala } from '@daml.js/hawalon';

type Props = {
  ious: Hawala.Iou[];
  partyToAlias: Map<Party, string>;
  onRedeem: (iou: Hawala.Iou) => void;
}

/**
 * React component to display a list of IOUs
 */
const LockedIouList: React.FC<Props> = ({ious, partyToAlias, onRedeem}) => {
  return (ious.length > 0 ? (
    <Table basic='very' compact ='very' celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>From</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {[...ious].map((iou, index) =>
          <Table.Row>
            <Table.Cell>{partyToAlias.get(iou.issuer)}</Table.Cell>
            <Table.Cell>{iou.amount}</Table.Cell>
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

export default LockedIouList;
