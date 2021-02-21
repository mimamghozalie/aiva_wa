import { Module } from "@nestjs/common";

import { WebSocketModuleV1 } from "./v1/app-websocket.module";

@Module({
    imports: [WebSocketModuleV1]
})
export class AppWebSocketModule { }