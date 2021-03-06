import { x, cap, p } from './list';

const getGroupAddress = (data) => {
  const groupsAddress = data.reverse().reduce((obj, item) => {
    obj[item.sender] = obj[item.sender] || [];
    obj[item.sender].push({
      amountEth: item.eth,
      ethTxhash: item.eth_txhash,
      block: item.block,
      cyberHash: item.cyber_hash,
      eul: item.eul,
      avPrice: item.av_price,
      eulSum: item.eul_sum_by_address,
      ethSum: item.eth_sum_by_address,
    });
    return obj;
  }, {});
  const groups = Object.keys(groupsAddress).reduce(
    (obj, key) => ({
      ...obj,
      [key]: {
        address: groupsAddress[key],
        block: null,
        pin: false,
        amountСolumn: null,
        cyb: 0,
        eul: 0,
      },
    }),
    {}
  );
  Object.keys(groups).forEach((key) => {
    // let sum = 0;
    // let eul = 0;
    // groups[key].address.forEach((addressKey) => {
    //   sum += addressKey.amountEth;
    //   eul += addressKey.eul;
    // });
    groups[key].block = groups[key].address[0].block;
    groups[key].amountСolumn = groups[key].address[0].ethSum;
    groups[key].eul = groups[key].address[0].eulSum;
  });
  return groups;
};

const diff = (key, ...arrays) =>
  [].concat(
    ...arrays.map((arr, i) => {
      const others = arrays.slice(0);
      others.splice(i, 1);
      const unique = [...new Set([].concat(...others))];
      return arr.filter((x) => !unique.some((y) => x[key] === y[key]));
    })
  );

const binarySearch = (list, item) => {
  let low = 0;
  let high = list.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const guess = list[mid];

    if (item >= guess && item < list[mid + 1]) {
      return mid;
    }

    if (guess > item) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return 0; // if not found
};

const findId = (list, item) => {
  let id = 0;

  for (let index = 0; index < list.length; index++) {
    const element = x[index];
    if (element <= item) {
      id = index;
    } else {
      return id;
    }
  }
};

const getDataPlot = (tokens) => {
  let data = {
    y: [],
    x: [],
    cap: [],
  };
  const indexArr = binarySearch(x, tokens);

  // console.log('findId', findId(x, tokens));
  // console.log('binarySearch', binarySearch(x, tokens));

  const newArrY = p.slice(0, indexArr + 1);
  const newArrX = x.slice(0, indexArr + 1);
  const newArrCap = cap.slice(0, indexArr + 1);

  data = {
    x: newArrX,
    y: newArrY,
    cap: newArrCap,
  };
  data.x.push(tokens);
  const price = 0.1 + 0.000198 * tokens;
  data.y.push(price);
  data.cap.push(price * 100000);
  return data;
};

const chekPathname = (pathname) => {
  if (pathname.match(/progress/gm) && pathname.match(/progress/gm).length > 0) {
    return 'progress';
  }
  if (
    pathname.match(/leaderboard/gm) &&
    pathname.match(/leaderboard/gm).length > 0
  ) {
    return 'leaderboard';
  }
  if (
    pathname.match(/cyber-vs-gov/gm) &&
    pathname.match(/cyber-vs-gov/gm).length > 0
  ) {
    return 'gov';
  }
  if (
    pathname.match(/cyber-vs-corp/gm) &&
    pathname.match(/cyber-vs-corp/gm).length > 0
  ) {
    return 'corp';
  }
  return 'manifest';
};

const pingTx = (tx, web3) =>
  new Promise((resolve, reject) => {
    loop();
    function loop() {
      web3.eth.getTransaction(tx, async (error, receipt) => {
        if (receipt == null) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }

        if (receipt) {
          resolve(receipt);
        } else {
          setTimeout(loop, 1000);
        }
      });
    }
  });

export { diff, getGroupAddress, getDataPlot, chekPathname, pingTx };
