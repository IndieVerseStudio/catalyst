import { HistoryManager } from "./HistoryManager"
import { Environment, Bean } from "../../../src/Environment"
import { HistoryStorage } from "./HistoryStorage"
import { HistoryManagerImpl } from "./HistoryManagerImpl"

export class HistoryManagerFactory {

    static create(env: Environment): Promise<HistoryManager> {
        const storage: HistoryStorage = new HistoryStorage(env.getBean(Bean.STORAGE))
        return HistoryManagerImpl.build(storage)
    }
}
