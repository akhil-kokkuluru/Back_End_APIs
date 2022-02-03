const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

module.exports = app;
const initializeDbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server started Successfully");
    });
  } catch (rr) {
    console.log(rr);
    process.exit(1);
  }
};

initializeDbandServer();

app.get("/players/", async (request, response) => {
  const playerQuery = `
    SELECT
        * 
    FROM cricket_team`;
  const playerList = await db.all(playerQuery);
  response.send(playerList);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const NewPlayerQuery = `
    INSERT INTO cricket_team(player_name,
  jersey_number,
  role)
  VALUES('${player_name}', '${jersey_number}', '${role}');`;
  const DBResponse = await db.run(NewPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const PlayerQuery = `
    SELECT
    *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const the_player = await db.get(PlayerQuery);

  response.send(the_player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const PlayerDetails = request.body;
  const { playerName, jerseyNumber, Role } = PlayerDetails;
  const PlayerQuery = `
        UPDATE
            cricket_team
        SET
            player_name='${playerName}',
            jersey_number = ${jerseyNumber},
            role = '${Role}'
        WHERE
            player_id = ${playerId};`;
  const AkhilQuery = await db.run(PlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const DELPlayerQuery = `
    DELETE
    FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;

  await db.run(DELPlayerQuery);
  response.send("Player Removed");
});
