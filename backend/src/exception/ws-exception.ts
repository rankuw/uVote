import { WsException } from "@nestjs/websockets";

type wsErrorTypes = 'BadRequest' | 'Unauthorized' | 'Unknown';

export class WsTypeException extends WsException{
    constructor(type: wsErrorTypes, message: unknown){
        super({type, message})
    }
}


export class WsBadRequestException extends WsTypeException {
    constructor(message) {
        super("BadRequest", message)
    }
}

export class WsUnknownException extends WsTypeException {
    constructor(message) {
        super("Unknown", message)
    }
}
