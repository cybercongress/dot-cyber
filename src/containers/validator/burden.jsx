import React from 'react';
import gql from 'graphql-tag';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { Pane, Tooltip } from '@cybercongress/gravity';

function Burden({ accountUser }) {
  const GET_CHARACTERS = gql`
  query all_by_subject {
    pre_commit(
      where: {
        validator: {
          consensus_pubkey: {
            _eq: "${accountUser}"
          }
        }
      }
      order_by: { height: desc }
      limit: 300
    ) {
      height
    }
    block_aggregate(limit: 300, order_by: { height: desc }) {
      nodes {
        height
      }
    }
  }
`;
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  console.log(data);

  const blockAggregate = data.block_aggregate.nodes;
  const preCommit = data.pre_commit;
  const block = [];

  Object.keys(blockAggregate).forEach(key => {
    if (blockAggregate[key].height - 1 === preCommit[key].height) {
      block.push({
        status: true,
        height: blockAggregate[key].height,
      });
    } else {
      block.push({
        status: false,
        height: blockAggregate[key].height,
      });
    }
  });

  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 25px)"
      width="100%"
    >
      {block.map(item => (
        <Tooltip position="bottom" content={item.height}>
          <Pane
            width="25px"
            height="15px"
            backgroundColor={item.status ? '#009624' : '#9b0000'}
            boxShadow="inset 0 0 0px 1px #000"
            key={item.height}
          />
        </Tooltip>
      ))}
    </Pane>
  );
}

export default Burden;
