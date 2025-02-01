import { EntityStatus } from "./enum/entity-status.enum";
import { RoleEnum } from "./enum/role.enum";

export interface LoggedInUserDto {
    sub?: string;
    id: number;
    userName: string;
    email: string;
    role: RoleEnum;
    status: EntityStatus;
}