import { Module } from "@nestjs/common";

// App Modules
import { ApiRoutingV1Module } from "./api-routing.module";
@Module({
    imports: [ApiRoutingV1Module]
})
export class AppApiModuleV1 { }