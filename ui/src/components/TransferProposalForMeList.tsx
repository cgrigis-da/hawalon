// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { List, Button } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { Hawala } from '@daml.js/my-app';

type Props = {
  transferProposals: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][];
  partyToAlias: Map<Party, string>;
  username: string;
  onAccept: (cid: ContractId<Hawala.TransferProposal>) => void;
}

/**
 * React component to display a list of `TransferProposal`s, which can be accepted by the user
 */
const TransferProposalForMeList: React.FC<Props> = ({transferProposals, partyToAlias, username, onAccept}) => {
  return (
    <List divided relaxed>
      {[...transferProposals].map(tp =>
        <List.Item key={tp[1].destination}>
          <List.Content>
            <List.Header>
              origin: {partyToAlias.get(tp[1].origin)};
              from: {partyToAlias.get(tp[1].source)};
              amount: {tp[1].amount}
            </List.Header>

              <Button type="submit" className="test-select-accept-button" onClick={() => onAccept(tp[0])}>
                Accept
              </Button>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default TransferProposalForMeList;
