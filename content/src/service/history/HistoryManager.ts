import { Timestamp } from "../Service"
import { EntityType, EntityId, Entity } from "../Entity"
import { ServerName } from "../naming/Naming"

export interface HistoryManager {
    newEntityDeployment(serverName: ServerName, entity: Entity, timestamp: Timestamp): Promise<void>;
    setTimeAsImmutable(immutableTime: Timestamp): Promise<void>;
    getHistory(from?: Timestamp, to?: Timestamp, contentServerName?: ServerName): Promise<DeploymentHistory>;
}

export type DeploymentEvent = {
    /** The server where the user uploaded the entity */
    serverName: ServerName,
    entityType: EntityType,
    entityId: EntityId,
    /** The moment when the server validated and stored the entity */
    timestamp: Timestamp,
}

export type DeploymentHistory = DeploymentEvent[]