"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertSetting = upsertSetting;
exports.getSetting = getSetting;
exports.getAllSettings = getAllSettings;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function upsertSetting(input, userId) {
    const { key, value, description } = input;
    return prisma_1.default.system_settings.upsert({
        where: { key },
        update: {
            value,
            description,
            updated_at: new Date(),
            updated_by: userId,
        },
        create: {
            key,
            value,
            description,
            updated_by: userId,
        },
    });
}
async function getSetting(key) {
    return prisma_1.default.system_settings.findUnique({
        where: { key },
    });
}
async function getAllSettings() {
    return prisma_1.default.system_settings.findMany();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9zeXN0ZW0tc2V0dGluZ3Mvc3lzdGVtLXNldHRpbmdzLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1NhaWYgQWxpL0RvY3VtZW50cy9HaXRIdWIvTWVldEV6cmkvYXBwcy9hcGkvc3JjL21vZHVsZXMvc3lzdGVtLXNldHRpbmdzL3N5c3RlbS1zZXR0aW5ncy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0Esc0NBa0JDO0FBRUQsZ0NBSUM7QUFFRCx3Q0FFQztBQS9CRCw4REFBc0M7QUFHL0IsS0FBSyxVQUFVLGFBQWEsQ0FBQyxLQUF5QixFQUFFLE1BQWU7SUFDNUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBRTFDLE9BQU8sZ0JBQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1FBQ25DLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUNkLE1BQU0sRUFBRTtZQUNOLEtBQUs7WUFDTCxXQUFXO1lBQ1gsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ3RCLFVBQVUsRUFBRSxNQUFNO1NBQ25CO1FBQ0QsTUFBTSxFQUFFO1lBQ04sR0FBRztZQUNILEtBQUs7WUFDTCxXQUFXO1lBQ1gsVUFBVSxFQUFFLE1BQU07U0FDbkI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRU0sS0FBSyxVQUFVLFVBQVUsQ0FBQyxHQUFXO0lBQzFDLE9BQU8sZ0JBQU0sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQ3ZDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRTtLQUNmLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsY0FBYztJQUNsQyxPQUFPLGdCQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJpc21hIGZyb20gXCIuLi8uLi9saWIvcHJpc21hXCI7XG5pbXBvcnQgeyBVcHNlcnRTZXR0aW5nSW5wdXQgfSBmcm9tIFwiLi9zeXN0ZW0tc2V0dGluZ3Muc2NoZW1hXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cHNlcnRTZXR0aW5nKGlucHV0OiBVcHNlcnRTZXR0aW5nSW5wdXQsIHVzZXJJZD86IHN0cmluZykge1xuICBjb25zdCB7IGtleSwgdmFsdWUsIGRlc2NyaXB0aW9uIH0gPSBpbnB1dDtcbiAgXG4gIHJldHVybiBwcmlzbWEuc3lzdGVtX3NldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsga2V5IH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICB2YWx1ZSxcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKSxcbiAgICAgIHVwZGF0ZWRfYnk6IHVzZXJJZCxcbiAgICB9LFxuICAgIGNyZWF0ZToge1xuICAgICAga2V5LFxuICAgICAgdmFsdWUsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIHVwZGF0ZWRfYnk6IHVzZXJJZCxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNldHRpbmcoa2V5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHByaXNtYS5zeXN0ZW1fc2V0dGluZ3MuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsga2V5IH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsU2V0dGluZ3MoKSB7XG4gIHJldHVybiBwcmlzbWEuc3lzdGVtX3NldHRpbmdzLmZpbmRNYW55KCk7XG59XG4iXX0=