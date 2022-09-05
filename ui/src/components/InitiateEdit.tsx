// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List, Form, Button, Modal, Header, Grid } from 'semantic-ui-react'
import { User } from '@daml.js/hawalon';
import { sha256 } from 'js-sha256';

type Props = {
  users: User.Alias[];
  username: string;
  onInitiate: (origin: string, destination: string, intermediary: string,
    amount: string, passwordHash: string) => Promise<boolean>;
}

/**
 * React component allowing a user to edit and initiate a transfer
 */
const InitiateEdit: React.FC<Props> = ({ users, username, onInitiate }) => {
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
    const passwordHash = sha256(password);

    setEnabled(false);

    const success = await onInitiate(username, destination, intermediary, amount, passwordHash);
    if (success) {
      setDestination("");
      setIntermediary("");
      setAmount("");
      setPassword("");
      setOpenConfirm(true);
    };

    setEnabled(true);
  }

  return (
    <List.Content>
      <Form size='small' onSubmit={onSubmit}>
        <Grid relaxed='very' columns={2} textAlign='center'>
          <Grid.Row>
            <Grid.Column width={2} verticalAlign='middle'>
              Destination:
            </Grid.Column>

            <Grid.Column width={12}>
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
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2} verticalAlign='middle'>
              Amount:
            </Grid.Column>

            <Grid.Column width={12}>
              <Form.Input
                type='number'
                value={amount}
                onChange={(event, { value }) => setAmount(value?.toString() ?? "")}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2} verticalAlign='middle'>
              Password:
            </Grid.Column>

            <Grid.Column width={12}>
              <Form.Input
                type='password'
                value={password}
                onChange={(event, { value }) => setPassword(value?.toString() ?? "")}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2} verticalAlign='middle'>
              Intermediary:
            </Grid.Column>

            <Grid.Column width={12}>
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
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={1} textAlign='center'>
            <Button size='small' ype="submit" disabled={!enabled} className="test-select-forward-button">
              Initiate transfer
            </Button>
          </Grid.Row>
        </Grid>
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
