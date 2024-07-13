import { Box, Button, Checkbox, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function App() {
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);
  const [wantCreateRoom, setWantCreateRoom] = useState<boolean>(true);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(uuidv4());

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isConnected && username && roomId) {
      socket.emit("join-room", { username, roomId });
      setIsRoomJoined(true);
      setUsername("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);

      socket.on("message", (message) => {
        console.log(message);
      });

      socket.on("user-connected", (msg) => {
        console.log(msg);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });
    });
  }, []);

  return (
    <div id="app">
      {!isRoomJoined ? (
        <form action="#" onSubmit={handleForm}>
          <Box className="container" sx={{ boxShadow: 3 }}>
            <div className="textField">Room Chat APP</div>
            <TextField
              label="Username *"
              variant="standard"
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            {wantCreateRoom ? (
              <Box>
                <div style={{ color: "#0d47a1" }}>Room id</div>
                <div
                  className="roomId"
                  onClick={() => {
                    window.navigator.clipboard.writeText(roomId);
                  }}
                >
                  {roomId}
                </div>
              </Box>
            ) : (
              <TextField
                label="RoomId *"
                variant="standard"
                fullWidth
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
              />
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                id="joinRoomCheckbox"
                checked={wantCreateRoom}
                onChange={() => {
                  setWantCreateRoom(!wantCreateRoom);
                  if (wantCreateRoom) {
                    setRoomId("");
                  } else {
                    setRoomId(uuidv4());
                  }
                }}
              />
              <label htmlFor="joinRoomCheckbox">Join Room</label>
            </div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "12px" }}
              type="submit"
            >
              Success
            </Button>
          </Box>
        </form>
      ) : (
        <Box className="container" sx={{ boxShadow: 3 }}>
          <div
            className="roomId"
            onClick={() => {
              window.navigator.clipboard.writeText(roomId);
            }}
          >
            {roomId}
          </div>
        </Box>
      )}
    </div>
  );
}

export default App;
