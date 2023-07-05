const express = require('express');
const {ObjectId} = require('mongodb');
const { connectToDb, getDb } = require('./db');
const app = express();
//db connect 

app.use(express.json())

let db;



connectToDb((err) => {
    if (!err) {
        //app listen request at port : 3000
        app.listen(3000, () => {
            console.log('Listening to port 3000');
        })
        db = getDb()
    }
});





//routes
app.get('/books', (req, res) => {
    let book = [] ;
    db.collection('books') 
        .find() //cursor toArray forEach
        .sort({author : 1})
        .forEach(books => book.push(books))
        .then(() =>{
            res.status(200).send(book);
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json({error : '500 Could not fetch the document'});
        });
   
});



app.get('/authors',(req,res) =>{
    let author = [];
    db.collection('authors')
        .find()
        .sort({name :1})
        .forEach((authors)=>{author.push(authors)})
        .then(() =>{
            res.status(200).send(author);
        })
        .catch((err) =>{
            console.log(err);
            res.status(500).json('Could not fetch the document!!!!');
        })
    })

 app.get('/books/:id',(req,res) =>{
    if (ObjectId.isValid(req.params.id)) {

        db.collection('books')
          .findOne({_id: new ObjectId(req.params.id)})
          .then(doc => {
            res.status(200).json(doc)
          })
          .catch(err => {
            res.status(500).json({error: 'Could not fetch the document'})
          })
          
      } else {
        res.status(500).json({error: 'Not a valid docs id'})
      }
    })
//Post request


app.post('/books',(req,res) =>{
    const book = req.body
    db.collection('books')
        .insertOne(book)
        .then((result) =>{
            res.status(201).json(result)
        })
        .catch((err) =>{
            res.status(500).json({error :'Oops 500 error in find the website\n'})
        })
})  

//Delete Request


app.delete('/books/:id',(req,res) =>{
    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
            .deleteOne({_id : new ObjectId(req.params.id)})
            .then((result) =>{
                res.status(200).json(result);
            })
            .catch((err) =>{
                res.status(500).json({error :'Could not delete the docs \n'})
            })
    }else{
        res.status(500).json({error: 'It not a valid id'});
    }
})
//Patch request


app.patch('/books/:id',(req,res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
            .updateOne({_id : new ObjectId(req.params.id)},{$set: updates})
            .then((result) =>{
                res.status(200).json(result);
            })
            .catch((err) =>{
                res.status(500).json({error :'Could not Update the docs\n'})
            })
    }else{
        res.status(500).json({error: 'It not a valid id'});
    } 

})