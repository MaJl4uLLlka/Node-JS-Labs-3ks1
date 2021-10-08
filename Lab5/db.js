var util = require('util');
var ee   = require('events');
const NOT_FOUND = -1;
const OK = 0;
var db_data = [
    {id: 1, name:'Иванов И.И.',  bday:'2001-01-01'},
    {id: 2, name:'Петров П.П.',  bday:'2001-03-02'},
    {id: 3, name:'Сидоров С.С.', bday:'2001-02-03'}
];

var currentIndex = 4;

function DB()
{
    this.select  = () =>{return db_data;};
    this.insert = (r)=>{
        r.id = currentIndex++;
        db_data.push(r);
    };

    this.update  = (r)=>{
        let id = Number.parseInt(r.id);
        let elementIndex = db_data.findIndex(el => el.id === id);
        if( elementIndex != NOT_FOUND )
        {
            db_data[elementIndex].name = r.name;
            db_data[elementIndex].bday = r.bday;
        }
        else
        {
            return {status: NOT_FOUND};
        }

        return {status: OK};   
    };

    this.delete = (id) =>
    {
        let elementIndex = db_data.findIndex(el => el.id == id);
        
        return elementIndex != NOT_FOUND ? db_data.splice(elementIndex, 1) : NOT_FOUND;
    }

    this.commit = () => {}
}

util.inherits(DB, ee.EventEmitter);

exports.DB=DB;