import rawBRE from "@nomiclabs/buidler";

import {
  getEthersSigners,
  deployLendToAaveMigrator,
  deployAaveToken,
  deployInitializableAdminUpgradeabilityProxy,
  deployMintableErc20,
  insertContractAddressInDb,
  registerContractInJsonDb,
  deployMockTransferHook,
} from "../helpers/contracts-helpers";

import { Signer } from "ethers";

import { initializeMakeSuite } from "./helpers/make-suite";
import { waitForTx, BRE } from "../helpers/misc-utils";
import { eContractid } from "../helpers/types";
import { BUIDLEREVM_CHAINID } from "../helpers/constants";

const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
  console.time("setup");

  const aaveAdmin = await secondaryWallet.getAddress();

  const aaveTokenImpl = await deployAaveToken();

  const aaveTokenProxy = await deployInitializableAdminUpgradeabilityProxy();

  const mockLendToken = await deployMintableErc20(["LEND token", "LEND", 18]);
  await registerContractInJsonDb("LEND", mockLendToken);

  const lendToAaveMigratorImpl = await deployLendToAaveMigrator([
    aaveTokenProxy.address,
    mockLendToken.address,
    "1000",
  ]);

  const lendToAaveMigratorProxy = await deployInitializableAdminUpgradeabilityProxy();

  const mockTransferHook = await deployMockTransferHook();

  const aaveTokenEncodedInitialize = aaveTokenImpl.interface.functions.initialize.encode(
    [
      lendToAaveMigratorProxy.address,
      aaveAdmin,
      mockTransferHook.address
    ]
  );

  await waitForTx(
    await aaveTokenProxy.initialize(
      aaveTokenImpl.address,
      aaveAdmin,
      aaveTokenEncodedInitialize
    )
  );

  //we will not run the initialize on the migrator - will be executed by the governance to bootstrap the migration
  await waitForTx(
    await lendToAaveMigratorProxy.initialize(
      lendToAaveMigratorImpl.address,
      aaveAdmin,
      "0x"
    )
  );

  await insertContractAddressInDb(
    eContractid.AaveToken,
    aaveTokenProxy.address
  );

  await insertContractAddressInDb(
    eContractid.LendToAaveMigrator,
    lendToAaveMigratorProxy.address
  );

  await insertContractAddressInDb(
    eContractid.MintableErc20,
    mockLendToken.address
  );

  await insertContractAddressInDb(
    eContractid.MockTransferHook,
    mockTransferHook.address
  )

  await insertContractAddressInDb(
    eContractid.LendToAaveMigratorImpl,
    lendToAaveMigratorImpl.address
  );

  console.timeEnd("setup");
};

before(async () => {
  await rawBRE.run("set-bre");
  const [deployer, secondaryWallet] = await getEthersSigners();
  console.log("-> Deploying test environment...");
  await buildTestEnv(deployer, secondaryWallet);
  await initializeMakeSuite();
  console.log("\n***************");
  console.log("Setup and snapshot finished");
  console.log("***************\n");
});
