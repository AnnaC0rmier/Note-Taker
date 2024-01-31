const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;
const path = require('path');
const fs = require('fs');
const uuid = require('./uuid');

const notes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
);


app.get('/api/notes', (req, res) => {
  res.status(200).json(notes);
});

app.post('/api/notes', async (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text, 
      id: uuid()
    };

    try {
      const data = await fs.promises.readFile('./db/db.json', 'utf-8');
      const parsedNotes = JSON.parse(data);

      parsedNotes.push(newNote);

      await fs.promises.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 2));

      notes.push(newNote);

      res.status(201).json({ message: 'Note added successfully', note: newNote });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Title and text are required fields' });
  }
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})