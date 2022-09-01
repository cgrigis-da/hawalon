// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { List, Form, Button } from 'semantic-ui-react'
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
  const [next, setNext] = React.useState<[ContractId<Hawala.TransferProposal>, string] | undefined>(undefined);

  const userToOption = (user: User.Alias) => {
    return {
      key: user.username,
      text: user.alias,
      value: user.username,
    };
  }
  const options = [...users].map((user: User.Alias) => userToOption(user));

  const onSubmit = async (event?: React.FormEvent) => {
    if (next === undefined) return;

    await onForward(next[0], next[1]);
  }

  return (
    <List divided relaxed>
      {[...transferProposals].map(tp =>
        <List.Item key={tp[1].destination}>
          <List.Content>
            <List.Header>
              Transfer: {partyToAlias.get(tp[1].path[tp[1].path.length - 1])}
              → {partyToAlias.get(tp[1].destination)}
            </List.Header>
            <List.Header>
              Received from: {partyToAlias.get(tp[1].path[1])}
            </List.Header>
            <List.Header>
              Amount: {tp[1].amount}
            </List.Header>

            <Form onSubmit={onSubmit}>
              <Form.Select
                fluid
                search
                allowAdditions
                additionLabel="Insert a party identifier: "
                additionPosition="bottom"
                className="test-select-follow-input"
                value={next ? next[1] : ""}
                options={options}
                onChange={(event, { value }) => setNext([tp[0], value?.toString() ?? ""])}
              />
              <Button type="submit" className="test-select-forward-button">
                Forward
              </Button>
            </Form>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default TransferProposalList;
