import BigNumber from "bignumber.js";

export enum eEthereumNetwork {
  coverage = "coverage",
  buidlerevm = "buidlerevm",
  kovan = "kovan",
  ropsten = "ropsten",
  main = "main",
}

export enum eContractid {
  AaveToken = "AaveToken",
  AaveTokenImpl = "AaveTokenImpl",
  LendToAaveMigrator = "LendToAaveMigrator",
  IERC20Detailed = "IERC20Detailed",
  AdminUpgradeabilityProxy = "AdminUpgradeabilityProxy",
  InitializableAdminUpgradeabilityProxy = "InitializableAdminUpgradeabilityProxy",
  MintableErc20 = "MintableErc20",
  LendToAaveMigratorImpl = "LendToAaveMigratorImpl",
  DoubleTransferHelper = "DoubleTransferHelper",
  MockTransferHook = "MockTransferHook",
}

export enum ProtocolErrors {}

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
export type tStringTokenSmallUnits = string; // 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tBigNumberTokenSmallUnits = BigNumber;

export interface iParamsPerNetwork<T> {
  [eEthereumNetwork.coverage]: T;
  [eEthereumNetwork.buidlerevm]: T;
  [eEthereumNetwork.kovan]: T;
  [eEthereumNetwork.ropsten]: T;
  [eEthereumNetwork.main]: T;
}
