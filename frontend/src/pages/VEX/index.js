import React,{ useEffect, useState} from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/container";

const http = require('http');

const init = {
  host: 'localhost',
  path: '/vex',
  port: 8080,
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset-utf-8'
  }
}; 

const callback = function(response) {
  let result = Buffer.alloc(0);
  response.on('data', function(chunk) {
    result = Buffer.concat([result, chunk]);
  }); 

  response.on('end', function() {
    console.log(result.toString());
  });
};

async function VEXSender(number, message, iD){
    const req = http.request(init, callback);
    const body = '{"number":"'+ number + '@c.us","message":"' + message.replace(/\n/g, "\\n") + '","ticketwhatsappId":' + iD + '}';
    await req.write(body);
    req.end();
}

const init2 = {
    host:'localhost',
    port:8080,
    path:'/whatsappvex'
  };

async function  GETSender(){
    http.get(init2, function(res){
        res.on("data", function(wppID){
          alert("ID instancia ativa:" + wppID);
         });    
        }).on('error', function(e) {
          alert("Erro: " + e.message);
        });    
}

const useStyles = makeStyles(theme =>({
    root: {
        display:"flex",
        alignItems:"center",
        padding: theme.spacing(4)
    },

    paper: {
        padding: theme.spacing(2),
        display:"flex",
        alignItems:"center",
    },

    settingOption: {
        marginLeft: "auto",
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

const VEX = () => {
    const classes = useStyles();
    const [inputs, setInputs] = useState({});

    const handleChange = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
     }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('As mensagens estão sendo carregadas! Aguarde...');
        const usersTextArea = inputs.user.split('\n');
        usersTextArea.forEach((user) => {
            setTimeout(function() {
                VEXSender(user, inputs.message, inputs.id);
                alert('Mensagem enviada para o número: ' + user);
                },5000 + Math.floor(Math.random()* 10000))
          });
    }

    useEffect(() =>{
        const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
        return() =>{
            socket.disconnect();
        };
    }, []);

    return(
        <div className={classes.root}>
            <Container className={classes.Container} maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <label>Números:<br/>
                <textarea
                    name="user"
                    cols="40"
                    rows="5"
                    value={inputs.user || ""}
                    onChange={handleChange}
                    required="required"
                    placeholder="553588754197&#13;&#10;553588754197&#13;&#10;553588754197&#13;&#10;553588754197"
                ></textarea>
                </label><br/><br/>
                <label>Mensagem<br/>
                <textarea
                    name="message"
                    cols="40"
                    rows="5"
                    value={inputs.message || ""}
                    onChange={handleChange}
                    required="required"
                    placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
                ></textarea>
                </label><br/><br/>
                <label>ID de Disparo<br/>
                <input
                    type="text"
                    name="id"
                    value={inputs.id || ""}
                    onChange={handleChange}
                    required="required"
                />
                </label><br/><br/>
                <input
                style={{ color:"white",backgroundColor:" #2576d2", bordercolor:"#2576d2", borderRadius: "4px", padding: "10px" }}
                type="button"
                value="Mostrar ID de Disparo"
                onClick={GETSender}
                />
                <br/><br/>
                <input
                style={{ color:"white",backgroundColor:" #f50057", bordercolor:"#f50057", borderRadius: "4px", padding: "10px" }}
                type="submit"
                value="Disparar"
                />
            </form>
            </Container>
         </div>
    );
};    

export default VEX;


  
