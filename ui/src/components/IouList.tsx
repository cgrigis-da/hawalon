// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { List } from 'semantic-ui-react'
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
  return (
    <List divided relaxed>
      {[...ious].map((iou, index) =>
        <List.Item key={index}>
          <List.Content>
            <List.Header>{`from ${partyToAlias.get(iou.issuer)}: ${iou.amount}`}</List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default LockedIouList;
