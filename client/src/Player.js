import React, { useEffect, useState } from "react";
import SpotifyWebPlayer from "react-spotify-web-playback";
export const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);
  if (!accessToken) return null;
  return (
    <div>
      <SpotifyWebPlayer
        token={accessToken}
        callback={(state) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        showSaveIcon
        uris={trackUri ? [trackUri] : []}
      />
    </div>
  );
};
