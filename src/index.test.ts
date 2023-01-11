import request from 'supertest'
import {app, server} from '.';
import { PrismaClient } from "@prisma/client";

describe('Test /', () => {
    afterEach(async () => {
        server.close();
    })

    it ('running server', (done) => {
      request(app).get('/').then((response) => {        
        expect(response.text).toBe("마! 이게 서버다!!!!!!!!!!!!!!!!!!!!");
        done();
      });
    });
  });