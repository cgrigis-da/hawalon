// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { Party } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';

type Props = {
  lockedIous: Hawala.LockedIou[];
  partyToAlias: Map<Party, string>;
  incoming: Boolean;
  onFollow: (userToFollow: Party) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const LockedIouList: React.FC<Props> = ({lockedIous, partyToAlias, incoming, onFollow}) => {
  return (
    <List divided relaxed>
      {[...lockedIous].map(l =>
        <List.Item key={l.iou.issuer}>
          <List.Content>
            <List.Header>{
              incoming 
                ? `from ${partyToAlias.get(l.iou.issuer)}: ${l.iou.amount}`
                : `to ${partyToAlias.get(l.iou.owner)}: ${l.iou.amount}`
            }</List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default LockedIouList;
