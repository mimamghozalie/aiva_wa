import { Module } from "@nestjs/common";

import { AppApiModuleV1 } from "./v1/api.module";

@Module({
    imports: [AppApiModuleV1]
})
export class AppApiModule { }