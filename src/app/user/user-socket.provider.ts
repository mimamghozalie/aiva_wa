import { Injectable, UseGuards } from "@nestjs/common";
import { SubscribeMessage } from "@nestjs/websockets";
import { WsGuard } from "@system/guards/wsguard/wsguard.guard";
import { AppSocket } from "@system/websocket/websocket.gateaway";
import { Socket } from "socket.io";
import { USER_SOCKETS_TYPE } from "./sockets/type";
import { UserService } from "./user.service";


@UseGuards(WsGuard)
@Injectable()
export class UserSocketProvider extends AppSocket {

    constructor(private userService: UserService) {
        super()
    }

    @SubscribeMessage(USER_SOCKETS_TYPE.USERS_FIND_ALL)
    async findUser(client: Socket, data) {
        const res = await this.userService.findAll(data)

        client.emit(USER_SOCKETS_TYPE.USERS_FIND_ALL, await this.userService.findAll(data))
    }

    @SubscribeMessage(USER_SOCKETS_TYPE.USERS_COLUMNS)
    async columns(client: Socket) {

        client.emit(USER_SOCKETS_TYPE.USERS_COLUMNS, await this.userService.column())
    }
}