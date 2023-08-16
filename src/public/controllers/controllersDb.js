const controller = {};

controller.saveData = (req, res) =>{
    const data = req.body;
    req.getConnection((err, conn) => {
        if(err){
            res.send('No se ha podido conectar a la base de datos. Intenta de nuevo más tarde');
        }
        else{
            conn.query('INSERT INTO adulto_mayor set ?', [data], (err, rows) => {
                if(err){
                    console.log(err);
                    res.send('No se ha podido conectar a la base de datos. Intenta de nuevo más tarde');
                }
                else{
                    console.log(rows);   
                }
            });
        }
    });
};

controller.saveContact = (req, res) =>{
    const dataContact = req.body;
    req.getConnection((err, conn) => {
        if(err){
            res.send('No se ha podido conectar a la base de datos. Intenta de nuevo más tarde');
        }
        else{
            conn.query('INSERT INTO contacto_adulto set ?', [dataContact], (err, rowsContact) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(rowsContact);   
                }
            });
        }
    });
};

controller.saveBluetooth = (req, res) =>{
    const data = req.body;
    req.getConnection((err, conn) => {
        if(err){
            res.send('No se ha podido conectar a la base de datos. Intenta de nuevo más tarde');
        }
        else{
            conn.query('INSERT INTO frecuencia_card set ?', [data], (err, rows) => {
                if(err){
                    console.log(err);
                }
                else{   
                    console.log(rows);
                }
            });
        }
    });
};

module.exports = controller;