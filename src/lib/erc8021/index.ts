/**
 * ERC-8021: Transaction Attribution Placeholder
 * Appends builder and app attribution tags to tx datastream.
 */
import { Hex, toHex } from 'viem';

export const APP_ATTRIBUTION_CODE = '68f65682b6320e0dd0819ced';
export const BUILDER_CODE = 'bc_iyrfyoxr';

export function withERC8021Attribution(
  baseData: Hex | string,
  attributionCode: string = APP_ATTRIBUTION_CODE,
  builderCode: string = BUILDER_CODE
): Hex {
  // In a real implementation this creates properly formatted ABI encoded calldata suffixes.
  const attributionString = `_8021_${attributionCode}_${builderCode}_`;
  const attributionHex = toHex(attributionString).replace('0x', '');
  
  const safeBase = baseData.startsWith('0x') ? baseData : `0x${baseData}`;
  return `${safeBase}${attributionHex}` as Hex;
}
