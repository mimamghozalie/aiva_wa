import { PostService } from './post.service';
import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        PostService,
        SocketService
    ],
})
export class PostModule { }
