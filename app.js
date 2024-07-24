import express from 'express' 
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
     apiKey: process.env.OPEN_AI_KEY, 
}); 

const app = express();
const port =  process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/',(req, res) =>{
    res.render("index");
});

app.post('/prompts', (req, res)=>{
  const run = async() => {
    const userInput = req.body["prompt-input"];
    const prompt = `
    I'm creating AI greetings, Please suplly 3 ideas based on this text: ${userInput}.
     Don't include in the response "creating", "creating an ai", "generating", "ai","desgining", "incoporating".
     Also, return the response JSON format like follows:
     {
      "1":"...",
      "2":"...",
      "3":"..."
     }
    `;
    const options = {
      model:'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
    ],      max_tokens: 150,
  };  

    const response = await openai.chat.completions.create(options);

    let parsedResponse;

    console.log(response.data);

    const parsableJSONRes = response.choices[0].message.content;

    console.log("res text: ", parsableJSONRes);

    try{
      parsedResponse = JSON.parse(parsableJSONRes);
    }
    catch(error) {
      console.error('Error parsing json:', error);
      return;
  };

  console.log("prompt 1 :", parsedResponse["1"]);
  console.log("prompt 2 :", parsedResponse["2"]);
  console.log("prompt 3 :", parsedResponse["3"]);

  return {parsedResponse};

  }

run().then(({parsedResponse}) => {
  if (parsedResponse && Object.keys(parsedResponse).length>0){
    res.render('index', {content: 'prompts', response:'parsedResponse', error: undefined});
  } else{
    res.render('index', {content: 'prompts', response:undefined, error: 'Unable to parse response from AI.'});
  }
});

});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

















// import express from 'express' 
// import cors from "cors"

// app.use(cors());

// const app = express()
// const port = 3000;


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get("/tasks", (req, res) => {
//     res.send([
//       { id: 1, name: "task 1", status: "TODO" },
//       { id: 2, name: "task 2", status: "Done" },
//     ]);
//   });

//   app.get("/tasks/:id",(req,res)=>{
//     res.send("get task by id");
//   })
  
//   app.post("/tasks/",(req,res)=>{
//     res.send("add a new task");
//   })
  
//   app.put("/tasks/:id",(req,res)=>{
//     res.send("update a task");
//   })
  
//   app.delete("/tasks/:id",(req,res)=>{
//     res.send("delete a task");
//   })
    

// app.listen(port, () => {
//   console.log(`Example app listening on http://localhost:${port}`)
// })
