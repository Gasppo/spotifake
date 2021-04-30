import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { Player } from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { useAuth } from "./useAuth";

const spotifyApi = new SpotifyWebApi({
  clientId: "cd671f4a03254e65af754b968fb84f31",
  clientSecret: "9f8ef82b344648989b679aff66c34671",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  const getSongInfo = (track) => {
    const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
      if (image.height < smallest.height) {
        return image;
      }
      return smallest;
    }, track.album.images[0]);

    return {
      artist: track.artists.map((artist) => artist.name).join(", "),
      title: track.name,
      uri: track.uri,
      albumUrl: smallestAlbumImage.url,
    };
  };
  const handleSearch = (event) => setSearch(event.target.value);
  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(res.body.tracks.items.map(getSongInfo));
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    if (!search) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getMyRecentlyPlayedTracks({
          limit: 20,
        })
        .then((res) => {
          console.log(res.body.items[0]);
          setSearchResults(
            res.body.items.map((item) => getSongInfo(item.track))
          );
        });
    }
  }, [search, accessToken]);

  return (
    <Container
      className="d-flex flex-column py-2"
      style={{ height: "100vh", backgroundColor: "#282828" }}
    >
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={handleSearch}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
