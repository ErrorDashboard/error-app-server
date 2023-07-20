import 'reflect-metadata';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoose, { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  CLIENT_URL,
  CLIENT_PORT,
  CREDENTIALS,
} from '@config';
import { dbConnectionString, dbOptions } from './database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import passport from 'passport';
import './strategies/githubStrategy';
import './strategies/googleStrategy';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private database: typeof mongoose | null;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.database = null;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    console.log('Initialization Complete');
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase = async () => {
    if (this.env !== 'production') {
      set('debug', true);
    }
    this.database = await connect(dbConnectionString, dbOptions);
  };

  public disconnectDatabase = async () => {
    if (this.env === 'test') {
      await this.database.connection.close();
    }
  };

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: `http://${CLIENT_URL}:${CLIENT_PORT}`,
        credentials: CREDENTIALS,
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Error Dashboard API',
          version: '1.0.0',
          description: 'API documentation for Error Dashboard',
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  description: 'User Email',
                },
                password: {
                  type: 'string',
                  description: 'User Password',
                },
              },
            },
            CreateErrorLog: {
              type: 'object',
              required: ['statusCode', 'message'],
              properties: {
                statusCode: {
                  type: 'integer',
                  format: 'int32',
                  description: 'HTTP status code of the error',
                },
                message: {
                  type: 'string',
                  description: 'Error message',
                },
                component: {
                  type: 'object',
                  required: ['path', 'line'],
                  properties: {
                    path: {
                      type: 'string',
                      description: 'File path of the error',
                    },
                    line: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Line number of the error',
                    },
                  },
                },
                userAffected: {
                  type: 'string',
                  description: 'User affected by the error',
                },
                stackTrace: {
                  type: 'string',
                  description: 'Stack trace of the error',
                },
                resolved: {
                  type: 'boolean',
                  description: 'Whether the error is resolved or not',
                },
              },
            },
            ErrorLog: {
              allOf: [
                { $ref: '#/components/schemas/CreateErrorLog' },
                {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique identifier of the error log',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      description:
                        'Date and time when the error log was created',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                      description:
                        'Date and time when the error log was last updated',
                    },
                  },
                },
              ],
            },
          },
        },
      },
      apis: [path.resolve(__dirname, './openapi.yaml')],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-ui', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}

export default App;
