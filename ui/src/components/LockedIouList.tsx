// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, Container, Table, Button, Popup } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { Hawala } from '@daml.js/hawalon';

type Props = {
  lockedIous: [ContractId<Hawala.LockedIou>, Hawala.LockedIou][];
  lockedIouToPw: Map<ContractId<Hawala.LockedIou>, string>;
  partyToAlias: Map<Party, string>;
  username: string;
  onUnlock: (cid: ContractId<Hawala.LockedIou>) => void;
}

/**
 * React component to display a list of locked IOUs, which can be unlocked by the user
 */
const LockedIouList: React.FC<Props> = ({lockedIous, lockedIouToPw, partyToAlias, username, onUnlock}) => {
  const renderLockedIou = (liou: [ContractId<Hawala.LockedIou>, Hawala.LockedIou]) => {
    const [cid, l] = liou;

    if (l.iou.owner === username) {
      return (
        <Table.Row>
          <Table.Cell>
            <Icon name='long arrow alternate left' />
            {partyToAlias.get(l.iou.issuer)}
          </Table.Cell>
          <Table.Cell>{l.iou.amount}</Table.Cell>
          <Table.Cell>
            <Popup
              content={lockedIouToPw.get(cid) ?? "UNKNOWN"}
              disabled={lockedIouToPw.get(cid) === undefined}
              trigger={
                <Icon
                  name={lockedIouToPw.get(cid) ? 'lock open' : 'lock'}
                  className='test-select-unlock-iou-icon'
                />
              }
            />
            <Button type='submit' size='small' onClick={(event, { value }) => onUnlock(cid)} content='Unlock' />
          </Table.Cell>
        </Table.Row>
      )
    } else {
      return (
        <Table.Row>
          <Table.Cell>
            <Icon name='long arrow alternate right' />
          {partyToAlias.get(l.iou.owner)}
          </Table.Cell>
          <Table.Cell>{l.iou.amount}</Table.Cell>
          <Table.Cell>
            <Icon name='minus' />
          </Table.Cell>
        </Table.Row>
      )
    }
  }

  return (lockedIous.length > 0 ? (
    <Table basic='very' compact='very' celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Partner</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Action</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {[...lockedIous].map((l, index) =>
          renderLockedIou(l)
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
