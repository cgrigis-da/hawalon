// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { Party } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';

type Props = {
  transferProposals: Hawala.TransferProposal[];
  partyToAlias: Map<Party, string>;
  username: string;
  onFollow: (userToFollow: Party) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const TransferProposalList: React.FC<Props> = ({transferProposals, partyToAlias, username, onFollow}) => {
  return (
    <List divided relaxed>
      {[...transferProposals].map(tp =>
        <List.Item key={tp.destination}>
          <List.Content>
            <List.Header>
              from: {partyToAlias.get(tp.source)};
              to: {partyToAlias.get(tp.destination)};
              via: {partyToAlias.get(tp.intermediary)};
              amount: {tp.amount}
            </List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default TransferProposalList;
