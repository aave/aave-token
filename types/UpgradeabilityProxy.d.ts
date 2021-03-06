/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface UpgradeabilityProxyInterface extends Interface {
  functions: {};

  events: {
    Upgraded: TypedEventDescription<{
      encodeTopics([implementation]: [string | null]): string[];
    }>;
  };
}

export class UpgradeabilityProxy extends Contract {
  connect(signerOrProvider: Signer | Provider | string): UpgradeabilityProxy;
  attach(addressOrName: string): UpgradeabilityProxy;
  deployed(): Promise<UpgradeabilityProxy>;

  on(event: EventFilter | string, listener: Listener): UpgradeabilityProxy;
  once(event: EventFilter | string, listener: Listener): UpgradeabilityProxy;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): UpgradeabilityProxy;
  removeAllListeners(eventName: EventFilter | string): UpgradeabilityProxy;
  removeListener(eventName: any, listener: Listener): UpgradeabilityProxy;

  interface: UpgradeabilityProxyInterface;

  functions: {};

  filters: {
    Upgraded(implementation: string | null): EventFilter;
  };

  estimate: {};
}
