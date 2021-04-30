import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => {
        chooseTrack(track);
      }}
    >
      <img
        src={track.albumUrl}
        alt="asd"
        style={{ height: "64px", width: "64px" }}
      />
      <div className="ml-3">
        <div style={{ color: "white" }}>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  );
}
