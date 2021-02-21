import { Module } from "@nestjs/common";
import { PostModule } from "./post/post.module";


@Module({
    imports: [PostModule],
    exports: [PostModule]
})

export class ApiSocketModule {
    version = '1.0.0'
}