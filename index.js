const express = require("express")
const app = express();

const File = require('./fileClass')
const Directory = require("./directoryClass")

const cors = require("cors")
app.use(cors());
app.use(express.json())
app.use(express.static('dist'))


function createContent() {
    const file1 = new File("Ek file", "yeh pehli file ka content.");
    const file2 = new File("Ek aur file", "yeh doosri file ka content.");
    const file3 = new File("Ek doosri file", "yeh teesri file ka content.");
    const file4 = new File("arre aakhri file", "yeh chauthi file ka content.");

    const Chautha = new Directory("Chautha Folder");
    const Teesra = new Directory("Teesra Folder");
    const Doosra = new Directory("Doosra Folder");
    const Pehla = new Directory("Pehla Folder");
  
    Doosra.addFile(file2);
    Doosra.addDirectory(Chautha);
  
    Teesra.addFile(file3);
    Chautha.addFile(file4);
  
    Pehla.addDirectory(Doosra);
    Pehla.addDirectory(Teesra);
    Pehla.addFile(file1);
  
    return Pehla;
  }
  


const root = new Directory("Root");
const Pehla = createContent();
root.addDirectory(Pehla);
//console.log(root);

function findItem(directory,pathArray){
    if(pathArray.length === 0){
        return directory;
    }
    //console.log(directory)
    //console.log(pathArray[0])
    const nextDir = directory.contents.find(item =>item.name === pathArray[0]);
    if(!nextDir){
        console.log("Directory was not found");
    }
    return findItem(nextDir,pathArray.slice(1));
}


app.get('/api/directory',async(req,res)=>{

    const path = req.query.path || "Root";

    //console.log(path)
    
    try{
        const pathArray = path.split("/").filter(Boolean);
        const dir = findItem(root,pathArray);
        if(dir instanceof File){
            //console.log("item is not a directory")
        }
        //console.log(dir.name)
        //console.log(dir.contents)
        const toSend = {
            name:dir.name,
            contents: dir.contents.map(item =>({
                name: item.name,
                type: item instanceof File ? 'file':'directory',
            }))
        }
        return res.json({status:"Ok", message:"yay",data:toSend})
    } catch(err){
        console.log(err);
        return res.json({status:"NOT OK", message:"oopsies",data:{}})

    }
})



app.get('/api/file',async(req,res)=>{

    const path = req.query.path || "Root";

    //console.log(path)

   
    try{
        const pathArray = path.split("/").filter(Boolean);
        const file = findItem(root,pathArray);
        if(file instanceof Directory){
            console.log("item is not a file.")
        }
        //console.log(file.name)
        //console.log(file.text)
        const toSend = {
            name:file.name,
            text: file.text
        }
        return res.json({status:"Ok", message:"yay",data:toSend})
    } catch(err){
        console.log(err);
        return res.json({status:"NOT OK", message:"oopsies",data:{}})

    }
})

app.use('*',  (req, res) => {
    res.sendFile((__dirname+ '/dist/index.html'));
});




app.listen(3000, ()=>{
    console.log("server running on port 3000")
})


