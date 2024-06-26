import { Address } from "viem";
import { AIRSTACK_API_KEY, AIRSTACK_API_URL } from "../consts";

export const getProfileInfo = async (buyers: Address[]) => {
  const query = ` query MyQuery($buyers: [Address!]!, $identities:[Identity!]!){
        Socials(
          input: {filter: {identity: {_in: $identities}}, blockchain: ethereum, limit:200}
        ) {
          Social {
            userAssociatedAddresses
            dappName
            profileName
            coverImageURI
            fnames
            profileImage
            profileUrl
            followerCount
            profileBio
          }
        }
          Domains(
            input: {filter: {resolvedAddress: {_in: $buyers},isPrimary: {_eq: true}}, blockchain: ethereum, limit:200}
          ) {
            Domain {
              resolvedAddress
              name
              isPrimary
              avatar
            }
          }
        }`;
  const variables = {
    buyers,
    identities: buyers,
  };
  const res = await fetch(AIRSTACK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${AIRSTACK_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  return data;
};
