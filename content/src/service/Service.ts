import { AuthChain, EntityType } from '@dcl/schemas'
import { ContentItem } from '../ports/contentStorage/contentStorage'
import { FailedDeployment } from '../ports/failedDeploymentsCache'
import { Database } from '../repository/Database'
import { AuditInfo, Deployment, PartialDeploymentHistory } from './deployments/types'
import { DeploymentOptions } from './deployments/types'

/**x
 * This version of the service can tell clients about the state of the Metaverse. It assumes that all deployments
 * were done directly to it, and it is not aware that the service lives inside a cluster.
 */
export interface MetaverseContentService {
  deployEntity(
    files: DeploymentFiles,
    entityId: string,
    auditInfo: LocalDeploymentAuditInfo,
    context: DeploymentContext,
    task?: Database
  ): Promise<DeploymentResult>
  isContentAvailable(fileHashes: string[]): Promise<Map<string, boolean>>
  getContent(fileHash: string): Promise<ContentItem | undefined>
  getDeployments(options?: DeploymentOptions): Promise<PartialDeploymentHistory<Deployment>>
  getAllFailedDeployments(): FailedDeployment[]
  reportErrorDuringSync(
    entityType: EntityType,
    entityId: string,
    reason: string,
    authChain: AuthChain,
    errorDescription?: string
  ): void
  getEntityById(entityId: string): Promise<{ entityId: string; localTimestamp: number } | void>
}

export type LocalDeploymentAuditInfo = Pick<AuditInfo, 'authChain'>

export type InvalidResult = { errors: string[] }
export function InvalidResult(val: InvalidResult): InvalidResult {
  return val
}

export type DeploymentResult = number | InvalidResult

export type DeploymentFiles = Uint8Array[] | Map<string, Uint8Array>

export function isSuccessfulDeployment(deploymentResult: DeploymentResult): deploymentResult is number {
  return typeof deploymentResult === 'number'
}

export function isInvalidDeployment(deploymentResult: any): deploymentResult is InvalidResult {
  if (deploymentResult && typeof deploymentResult === 'object' && Array.isArray(deploymentResult['errors'])) {
    return true
  }

  return false
}

export enum DeploymentContext {
  LOCAL = 'LOCAL',
  SYNCED = 'SYNCED',
  SYNCED_LEGACY_ENTITY = 'SYNCED_LEGACY_ENTITY',
  FIX_ATTEMPT = 'FIX_ATTEMPT'
}
