const http = require("http");
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');
const cookieParser = require("cookie-parser");
const Comment=require("./models/commentsSchema");
const authRouter=require("./routers/authenticationRouter")
const { Server: SocketServer } = require('socket.io');
var os = require('os');
// const pty = require('node-pty');
const { spawn } = require("child_process");

const {connectToThemongodb}=require("./connection/connect")
const loginrouter=require("./routers/loginrouter")
const validator=require("./HtmlCssjsValidator/ValidatorRouter")
const {authenticationCheck}=require("./middleware/middlewareAuth")
const router=require("./routers/questionRouter")
const SignupRouter=require("./routers/signupRouter");
const factsRouter = require("./routers/factsrouter");
const commenetsRouter=require('./routers/commentsRouter')
const QuestionCommentsRouter=require('./routers/QnCommentsRouter')
const solvedqnByuser=require("./routers/solvedQuestionsRouter")
const UserLikesrouter=require("./routers/UserlikesRouter")
const coursesRouter=require("./routers/courseRouter")
const jsvalidationChecker =require("./HtmlCssjsValidator/jsValidator")
const DiscussRouter=require("./routers/DiscussionRouter")
const dotenv=require("dotenv")
require('dotenv').config();


// Use a default shell
// var shell = os.platform() === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'bash';

// Correctly resolve the path for the working directory
// const ptyProcess = pty.spawn(shell, [], {
//   name: 'xterm-color',
//   cols: 80,
//   rows: 30,
//   cwd: path.join(process.env.INIT_CWD || __dirname, 'user'), // Fix cwd
//   env: process.env
// });




const app = express();
app.use(cors({
  origin: "http://localhost:5173",         // Allow the specific frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify HTTP methods if needed
  allowedHeaders: ["Content-Type"],         // Include Content-Type in allowed headers
  credentials: true                         // Allow credentials (cookies, authorization headers)
}));

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Update this to match your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
    
  }
}); 

app.use(cookieParser());
// Spawn a shell process
// const shellProcess = spawn(shell, [], {
//   stdio: "pipe", // Use pipe to capture stdout and stderr
//   cwd: path.resolve(__dirname, "user"), // Correct working directory
//   env: process.env
// });



chokidar.watch('./user').on('all', (event, filePath) => {
  io.emit('file:refresh', filePath);
});

// shellProcess.stdout.on("data",(data) => {
//   socket.emit('terminal:data', data.toString());
// });

// shellProcess.stderr.on("data", (data) => {
//   socket.emit("terminal:error", data.toString());
// });


// Handle terminal and file system
// io.on("connection", (socket) => {
//   console.log("Client connected");

  // Spawn a shell process
  // const shellProcess = spawn(shell, [], {
  //   cwd: path.resolve(__dirname, "user"),
  //   env: process.env,
  //   stdio: ["pipe", "pipe", "pipe"],
  // });

  // shellProcess.stdout.on("data", (data) => {
  //   socket.emit("terminal:data", data.toString());
  // });

  // shellProcess.stderr.on("data", (data) => {
  //   socket.emit("terminal:error", data.toString());
  // });

  // socket.on("file:change", async ({ path: relativePath, content }) => {
  //   const fullPath = path.join(__dirname, "user", relativePath);
  //   try {
  //     await fs.writeFile(fullPath, content);
  //     console.log(`File written: ${fullPath}`);
  //   } catch (error) {
  //     console.error(`Error writing file: ${error.message}`);
  //   }
  // });

  // socket.on("terminal:write", (input) => {
  //   if (shellProcess.stdin.writable) {
  //     shellProcess.stdin.write(input+"\n");
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  //   shellProcess.kill();
  // });
// });





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



app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/signup",SignupRouter);
app.use("/login",loginrouter)
app.use("/getOneUsername",authenticationCheck,loginrouter)
app.use("/getallusers",authenticationCheck,loginrouter)
app.use("/putuserdata",authenticationCheck,loginrouter)
app.use("/questions",router);
app.use("/display",router)
app.use("/gettopicwise",router)

app.use("/CoursesIndex",authenticationCheck,coursesRouter);

app.use("/facts",factsRouter)
app.use("/getFacts",factsRouter)
app.use("/api", validator); 
// app.use("/comments",commenetsRouter);
app.use("/check",authRouter);

app.post("/comments/api/:factsId",authenticationCheck,async(req,res)=>{
  try {
    // Check if `req.user` exists
    console.log("user:",req.cookies.token)
    if (!req.user || !req.user._id) {
       return res.status(401).json({ msg: "Unauthorized" });
    }

    // Creating the comment with corrected req.body usage
  const data=  await Comment.create({
       content: req.body.content,
       likes: req.body.likes , // Optional: Default to 0 if likes is not provided
       factsId: req.params.factsId, // Use `factsId` to match schema field name
       createdBy: req.user._id,
    });

    return res.status(200).json({ msg: "success",data });
 } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
 }
});


app.use("/getComments",commenetsRouter)

app.use("/QuestionsComments",authenticationCheck,QuestionCommentsRouter)
app.use("/getQuestionsComments",QuestionCommentsRouter)
app.use("/Userlikes",authenticationCheck,UserLikesrouter)
app.use("/likesget",authenticationCheck,UserLikesrouter)
app.get('/auth/validate-token', authenticationCheck, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});

// Logout route to clear the cookie
app.post("/logout", authenticationCheck,(req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,       // Prevents JavaScript access to the cookie
    secure: false,        // Set `true` in production to use HTTPS
    sameSite: "lax",      // Ensures cookies are sent on the same domain (adjust as needed)
  
  });

  // Respond with a success message
  return res.status(200).json({ msg: "Logged out successfully" });
});

app.use("/post-course",authenticationCheck,coursesRouter)
app.use("/get-course",authenticationCheck,coursesRouter);
app.use("/updateCourses",coursesRouter)
app.use("/progressUp",authenticationCheck,coursesRouter)
app.use("/allcourses",authenticationCheck,coursesRouter)

app.use('/get-progress-api',authenticationCheck, coursesRouter);
app.use("/jsvalidator",jsvalidationChecker)

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

app.use("/solvedquestionsByuser",authenticationCheck,solvedqnByuser);
app.use("/getsolvedquestionsByuser",solvedqnByuser);
app.use("/getOneSolvedQn",authenticationCheck,solvedqnByuser)

app.use("/profilesolvedqn",authenticationCheck,solvedqnByuser)

app.use("/PostDiscussR",authenticationCheck,DiscussRouter)
app.use("/GetDiscussR",DiscussRouter);
app.use("/OneDiscussion",DiscussRouter);
app.use("/postcomments",authenticationCheck,DiscussRouter)
app.use("/getPostedcomments",DiscussRouter)

app.get("/getChatgptApi",(req,res)=>{
  res.json({ apiUrl: process.env.MyApiKey });
})

//connection to the mongodb
connectToThemongodb(process.env.MONGO_DB)
.then(()=>console.log("mongodb is connected"))
.catch((err)=>console.log("not connected",err));



server.listen(9000, () => console.log(`Server running at port: 9000`));



