const express = require('express');

function AddEventCalenderRouter() {
  const router = express.Router();

  router.post('/addEvent', async (req, res) => {
    const { user, cache , pool } = req.context;
    if(!user){
      throw new Error('need to auth before');
    }
    const title = req.body.title;
    const url = req.body.url;
    if(!title || !url){
      return null;
    }
    const date = new Date().toLocaleString(); 
    try {
        const [result] = await pool.query(
          'INSERT INTO calendar (date, title, url) VALUES (?, ?, ?)',
          [date, title, url]
        );
        console.log('Insert result:', result);  
        res.json(result);
      } catch (error) {
        console.error('Error fetching Events:', error);
        throw new Error('Failed to fetch Events');
      }
  });
  return router;
}
module.exports = {AddEventCalenderRouter};