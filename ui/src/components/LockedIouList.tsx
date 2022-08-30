// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, Icon, List } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';

type Props = {
  lockedIous: [ContractId<Hawala.LockedIou>, Hawala.LockedIou][];
  partyToAlias: Map<Party, string>;
  username: string;
  onUnlock: (cid: ContractId<Hawala.LockedIou>) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const LockedIouList: React.FC<Props> = ({lockedIous, partyToAlias, username, onUnlock}) => {
  const renderLockedIou = (liou: [ContractId<Hawala.LockedIou>, Hawala.LockedIou]) => {
    const [cid, l] = liou;

    if (l.iou.owner === username) {
      return (
        <List.Content>
          <List.Header>
            from {partyToAlias.get(l.iou.issuer)}: {l.iou.amount}
          </List.Header>
          <List.Content floated='right'>
            <Icon
              name='key'
              link
              className='test-select-unlock-iou-icon'
              onClick={() => onUnlock(cid)} />
          </List.Content>
        </List.Content>
      )
    } else {
      return (
        <List.Content>
          <List.Header>
            to {partyToAlias.get(l.iou.owner)}: {l.iou.amount}
          </List.Header>
        </List.Content>
      )
    }
  }

  return (
    <List divided relaxed>
      {[...lockedIous].map((l, index) =>
        <List.Item key={index}>
          {renderLockedIou(l)}
        </List.Item>
      )}
    </List>
  );
};

export default LockedIouList;
