// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List, Form, Button , Label, Modal, Header} from 'semantic-ui-react'
import { Party } from '@daml/types';
import { User } from '@daml.js/my-app';
import { sha256 } from 'js-sha256';

type Props = {
  users: User.Alias[];
  partyToAlias: Map<Party, string>;
  username: string;
  onInitiate: (origin: string, source: string, destination: string, intermediary: string,
    amount: string, hash: string) => Promise<boolean>;
}

/**
 * React component allowing a user to edit and initiate a transfer
 */
const InitiateEdit: React.FC<Props> = ({users, partyToAlias, username, onInitiate}) => {
  const [destination, setDestination] = React.useState<string>("");
  const [intermediary, setIntermediary] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [enabled, setEnabled] = React.useState<boolean>(true);

  const userToOption = (user: User.Alias) => {
    return {
      key: user.username,
      text: user.alias,
      value: user.username,
    };
  }
  const options = [...users].map((user: User.Alias) => userToOption(user));

  const onSubmit = async (event?: React.FormEvent) => {
    const hash = sha256(password);

    setEnabled(false);
    
    const success = await onInitiate(username, username, destination, intermediary, amount, hash);
    if (success) {
      setDestination("");
      setIntermediary("");
      setAmount("");
      setPassword("");
      // alert("Transfer initiated successfully");
      setOpenConfirm(true);
    };

    setEnabled(true);
  }

  return (
    <List.Content>
      <Form onSubmit={onSubmit}>
        <Label>Destination</Label>
        <Form.Select
          fluid
          search
          allowAdditions
          additionLabel="Insert a party identifier: "
          additionPosition="bottom"
          className="test-select-destination-input"
          value={destination ?? ""}
          options={options}
          onChange={(event, { value }) => setDestination(value?.toString() ?? "")}
        />

        <Form.Input
          label='Amount'
          type='number'
          value={amount}
          onChange={(event, { value }) => setAmount(value?.toString() ?? "")}
        />

        <Form.Input
          label='Password'
          type='password'
          value={password}
          onChange={(event, { value }) => setPassword(value?.toString() ?? "")}
        />

        <Label>Intermediary</Label>
        <Form.Select
          fluid
          search
          allowAdditions
          additionLabel="Insert a party identifier: "
          additionPosition="bottom"
          className="test-select-destination-input"
          value={intermediary ?? ""}
          options={options}
          onChange={(event, { value }) => setIntermediary(value?.toString() ?? "")}
        />

        <Button type="submit" enabled={enabled} className="test-select-forward-button">
          Initiate transfer
        </Button>
      </Form>

      <Modal
        basic
        onClose={() => setOpenConfirm(false)}
        onOpen={() => setOpenConfirm(true)}
        open={openConfirm}
        size='small'
      >
        <Header icon>
          <Icon name='money' />
          Transfer initiated successfully
        </Header>
        <Modal.Actions>
          <Button basic color='green' onClick={() => setOpenConfirm(false)}>
            <Icon name='checkmark' />
          </Button>
        </Modal.Actions>
      </Modal>
    </List.Content>
  );
};

export default InitiateEdit;
