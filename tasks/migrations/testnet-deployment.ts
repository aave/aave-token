import { task } from "@nomiclabs/buidler/config";
import { BuidlerRuntimeEnvironment } from "@nomiclabs/buidler/types";

import { eContractid, eEthereumNetwork } from "../../helpers/types";
import {
  getAaveAdminPerNetwork,
  getLendTokenPerNetwork,
} from "../../helpers/constants";
import { checkVerification } from "../../helpers/etherscan-verification";

task("testnet-deployment", "Deployment in mainnet network")
  .addFlag(
    "verify",
    "Verify AaveToken, LendToAaveMigrator, and InitializableAdminUpgradeabilityProxy contract."
  )
  .setAction(async ({ verify }, localBRE) => {
    const BRE: BuidlerRuntimeEnvironment = await localBRE.run("set-bre");
    const network = BRE.network.name as eEthereumNetwork;
    const aaveAdmin = getAaveAdminPerNetwork(network);
    const lendTokenAddress = getLendTokenPerNetwork(network);

    if (!aaveAdmin) {
      throw Error(
        "The --admin parameter must be set for mainnet network. Set an Ethereum address as --admin parameter input."
      );
    }

    // If Etherscan verification is enabled, check needed enviroments to prevent loss of gas in failed deployments.
    if (verify) {
      checkVerification();
    }

    console.log("AAVE ADMIN", aaveAdmin);
    await BRE.run(`deploy-${eContractid.AaveToken}`, { verify });

    await BRE.run(`deploy-${eContractid.LendToAaveMigrator}`, {
      lendTokenAddress,
      verify,
    });

    await BRE.run(`initialize-${eContractid.AaveToken}`, {
      admin: aaveAdmin,
      onlyProxy: false,
    });

    await BRE.run(`initialize-${eContractid.LendToAaveMigrator}`, {
      admin: aaveAdmin,
      onlyProxy: false,
    });

    console.log(
      "\n✔️  Finished the deployment of the Aave Token Testnet Enviroment. ✔️"
    );
  });
