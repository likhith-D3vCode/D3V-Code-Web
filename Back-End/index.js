const http = require("http");
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');
const { Server: SocketServer } = require('socket.io');
var os = require('os');
const pty = require('node-pty');

// Use a default shell
var shell = os.platform() === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'bash';

// Correctly resolve the path for the working directory
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: path.join(process.env.INIT_CWD || __dirname, 'user'), // Fix cwd
  env: process.env
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
  }
});

app.use(cors());

chokidar.watch('./user').on('all', (event, filePath) => {
  io.emit('file:refresh', filePath);
});

ptyProcess.onData(data => {
  io.emit('terminal:data', data);
});

io.on('connection', (socket) => {
  console.log(`Socket connected`, socket.id);
  socket.emit('file:refresh');

  socket.on('file:change', async ({ path: relativePath, content }) => {
    const fullPath = path.join(__dirname, 'user', relativePath);  // Correct path join
    try {
      await fs.writeFile(fullPath, content);  // Ensure it's writing to a file, not directory
      console.log(`File written: ${fullPath}`);
    } catch (error) {
      console.error(`Error writing file: ${error.message}`);
    }
  });

  socket.on('terminal:write', (data) => {
    ptyProcess.write(data);
  });
});

app.get('/files', async (req, res) => {
  try {
    const fileTree = await generateFileTree('./user');
    return res.json({ tree: fileTree });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate file tree.' });
  }
});

app.get('/files/content', async (req, res) => {
  const relativePath = req.query.path;
  const fullPath = path.join(__dirname, 'user', relativePath); // Correct path join
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return res.json({ content });
  } catch (error) {
    res.status(500).json({ error: `Failed to read file: ${error.message}` });
  }
});

server.listen(9000, () => console.log(`Server running at port: 9000`));

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
}
