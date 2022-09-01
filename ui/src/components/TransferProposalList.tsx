// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { List, Form, Button } from 'semantic-ui-react'
import { Party, ContractId } from '@daml/types';
import { User, Hawala } from '@daml.js/my-app';

type Props = {
  transferProposals: [ContractId<Hawala.TransferProposal>, Hawala.TransferProposal][];
  partyToAlias: Map<Party, string>;
  username: string;
  users: User.Alias[];
  onChain: (cid: ContractId<Hawala.TransferProposal>, party: string) => Promise<boolean>;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const TransferProposalList: React.FC<Props> = ({transferProposals, partyToAlias, username, users, onChain}) => {
  const [next, setNext] = React.useState<[ContractId<Hawala.TransferProposal>, string] | undefined>(undefined);

  const userToOption = (user: User.Alias) => {
    return {
      key: user.username,
      text: user.alias,
      value: user.username};
  }
  const options = [...users].map((user: User.Alias) => userToOption(user));

  const onSubmit = async (event?: React.FormEvent) => {
    if (next === undefined) return;

    await onChain(next[0], next[1]);
  }

  return (
    <List divided relaxed>
      {[...transferProposals].map(tp =>
        <List.Item key={tp[1].destination}>
          <List.Content>
            <List.Header>
              origin: {partyToAlias.get(tp[1].origin)};
              from: {partyToAlias.get(tp[1].source)};
              to: {partyToAlias.get(tp[1].destination)};
              amount: {tp[1].amount}
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
