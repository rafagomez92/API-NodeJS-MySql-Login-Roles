import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from './routes';
const PORT = process.env.PORT || 3000;

createConnection().then(async connection => {

    // create express app
    const app = express();
    // Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());
    
    app.use('/', routes);
    
    app.listen(PORT, () => 
        console.log("Server running in PORT: ", PORT)
    );    
    

}).catch(error => console.log(error));
