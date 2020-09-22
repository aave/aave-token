import { task } from "@nomiclabs/buidler/config";
import { BuidlerRuntimeEnvironment } from "@nomiclabs/buidler/types";

import { eContractid } from "../../helpers/types";
import { getEthersSigners } from "../../helpers/contracts-helpers";
import { checkVerification } from "../../helpers/etherscan-verification";

task("dev-deployment", "Deployment in buidlerevm")
  .addOptionalParam(
    "admin",
    `The address to be added as an Admin role in Aave Token and LendToAaveMigrator Transparent Proxies.`
  )
  .addOptionalParam(
    "lendTokenAddress",
    "The address of the LEND token smart contract."
  )
  .addFlag(
    "verify",
    "Verify AaveToken, LendToAaveMigrator, and InitializableAdminUpgradeabilityProxy contract."
  )
  .setAction(async ({ admin, lendTokenAddress, verify }, localBRE) => {
    const BRE: BuidlerRuntimeEnvironment = await localBRE.run("set-bre");

    // If admin parameter is NOT set, the Aave Admin will be the
    // second account provided via buidler config.
    const [, secondaryWallet] = await getEthersSigners();
    const aaveAdmin = admin || (await secondaryWallet.getAddress());

    console.log("AAVE ADMIN", aaveAdmin);

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    await BRE.run(`deploy-${eContractid.AaveToken}`, { verify });

    await BRE.run(`deploy-${eContractid.LendToAaveMigrator}`, {
      lendTokenAddress,
      verify,
    });

    await BRE.run(`initialize-${eContractid.AaveToken}`, {
      admin: aaveAdmin,
    });

    await BRE.run(`initialize-${eContractid.LendToAaveMigrator}`, {
      admin: aaveAdmin,
    });

    await BRE.run(`Lend-Migration`, {});

    console.log(
      "\n👷 Finished the deployment of the Aave Token Development Enviroment. 👷"
    );
  });
