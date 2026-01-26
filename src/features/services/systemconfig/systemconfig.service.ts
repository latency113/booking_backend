import { SystemConfigRepository } from "../../repositories/systemconfig/systemconfig.repository";
import { UpdateSystemConfig } from "./systemconfig.schema";

export namespace SystemConfigService {
  export const getConfig = async () => {
    let config = await SystemConfigRepository.getConfig();
    if (!config) {
      // Create default if not exists
      config = await SystemConfigRepository.createInitial({
        maxBookingHours: 4,
        advanceBookingDays: 30,
        enableNotification: true,
      });
    }
    return config;
  };

  export const updateConfig = async (data: UpdateSystemConfig) => {
    const current = await getConfig();
    return SystemConfigRepository.update(current.id, data);
  };
}
