const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/registerUser', (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Both userName and password are required.' });
  }

  const dockerCommand = `docker exec -it docker-jitsi-meet-stable-9220-prosody-1 prosodyctl --config /config/prosody.cfg.lua register ${userName} meet.jitsi ${password}`;

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Docker command: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (stderr) {
      console.error(`Docker command stderr: ${stderr}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(`Docker command stdout: ${stdout}`);
    return res.status(200).json({ message: 'User registered successfully.' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
