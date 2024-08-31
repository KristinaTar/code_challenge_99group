interface WalletBalance {
  // obviously `blockchain` value was missing in this interface, since we're using it in the code later
  blockchain: string;
  currency: string;
  amount: number;
}

// since `FormattedWalletBalance` has all `WalletBalance` we extend it instead
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// making styles for the row
const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: 'red',
  },
}));

// Instead of `getPriority` function let's use object with blockchain name as a key
// and priority as a value. This way we avoid unnecessary operations
const blockchainPriority: { [blockchainName: string]: number } = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
}

// Since `Props` don't have any additional properties, let's use BoxProps instead
// We don't need to assign type twice, so we remove type from `props: Props`
const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  // we have missing useStyles, we're accessing `classes.row` later
  const { classes } = useStyles();

  // we won't need `sortedBalances` value in the future, so we memoize `formattedBalances` at once
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = blockchainPriority[balance.blockchain];
      // `-99` meant that we don't support blockchain. We will check non-undefined value instead
      // also we combine and simplify statements
      return balancePriority !== undefined && balance.amount <= 0;

    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // we simplify sorting logic
      return blockchainPriority[rhs.blockchain] - blockchainPriority[lhs.blockchain];
    }).map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    });
    // we remove `prices` from dependency array since it does not affect final value
  }, [balances]);

  // obviously there was a mistake, since `sortedBalances` does not contain `FormattedWalletBalance[]`
  // fix it by replacing with `formattedBalances`
  // also memoizing `rows`. We don't want to iterate through `formattedBalances` each render
  // setting `formattedBalances, prices` as dependencies
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // array index never should be used for a key value
          // using string instead
          key={`balance-${index}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    });
  }, [formattedBalances, prices]);

  return (
    // we need to ensure we pass only valid attributes to <div> so we need to specify them
    <div
      id={rest.id}
      className={rest.className}
    >
      {rows}
    </div>
  )
}