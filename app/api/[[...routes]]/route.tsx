/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { getFarcasterUserAddress } from "@coinbase/onchainkit/farcaster";
import { getProfileInfo } from "@/lib/airstack/getProfileInfo";
import { Address } from "viem";
import { getAddressChannels } from "@/lib/airstack/getAddressChannels";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

app.frame("/", async (c) => {
  const { frameData } = c;
  const fid = frameData?.fid || 2;
  const addresses = await getFarcasterUserAddress(fid);
  const firstAddress = addresses?.verifiedAddresses?.[0] as Address;
  const profiles = await getProfileInfo([firstAddress]);
  const domain = profiles?.data?.Domains?.Domain?.[0];
  const social = profiles?.data?.Socials?.Social;
  const farcasterProfile = social?.find?.(
    (profile: any) => profile.dappName === "farcaster"
  );

  const avatar = domain?.avatar;
  const name = farcasterProfile?.profileName;
  const bio = farcasterProfile?.profileBio;
  const channelResponse = await getAddressChannels(firstAddress);
  const channels =
    channelResponse?.data?.FarcasterChannelParticipants
      ?.FarcasterChannelParticipant;

  const shuffledChannels = channels?.sort?.(() => 0.5 - Math.random()) || [];
  const randomChannelNames = shuffledChannels
    .slice(0, 3)
    .map((channel: any) => `/${channel.channelName}`)
    .join(" ");

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            fontSize: 60,
            alignItems: "center",
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              gap: 10,
              fontSize: 60,
              alignItems: "center",
              width: "100vw",
            }}
          >
            <Avatar src={avatar} size={"100"} />
            {name}
          </div>

          <p style={{ fontSize: 25 }}>{bio}</p>
          <p>{randomChannelNames}</p>
        </div>
      </div>
    ),
    intents: [
      <Button.Redirect location={`https://warpcast.com/${name}`}>
        Follow
      </Button.Redirect>,
      <Button>Next</Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

const Avatar = ({
  src = "https://nftstorage.link/ipfs/bafybeifbkoma4zfff5locnoxhgwpx2eehezcbctws32qsf3nsexmgtfboy",
  size = "32",
}) => (
  <img
    alt="Avatar"
    height={size}
    width={size}
    src={src}
    style={{
      aspectRatio: "32/32",
      objectFit: "cover",
      borderRadius: "50%",
    }}
  />
);
