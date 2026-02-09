"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscription = getSubscription;
exports.createSubscription = createSubscription;
exports.updateSubscription = updateSubscription;
exports.updateSubscriptionById = updateSubscriptionById;
exports.cancelSubscription = cancelSubscription;
exports.getBillingHistory = getBillingHistory;
exports.getAllSubscriptions = getAllSubscriptions;
const prisma_1 = require("../../lib/prisma");
async function getSubscription(userId) {
    return prisma_1.prisma.subscriptions.findFirst({
        where: {
            user_id: userId,
            status: 'active',
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}
async function createSubscription(userId, data) {
    // Cancel existing active subscriptions
    await prisma_1.prisma.subscriptions.updateMany({
        where: {
            user_id: userId,
            status: 'active',
        },
        data: {
            status: 'cancelled',
            end_date: new Date(),
        },
    });
    const amount = data.plan_type === 'basic' ? 25 : data.plan_type === 'pro' ? 59 : data.plan_type === 'enterprise' ? 149 : 0;
    const now = new Date();
    const nextBilling = new Date(now);
    if (data.billing_cycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
    }
    else {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    }
    return prisma_1.prisma.subscriptions.create({
        data: {
            user_id: userId,
            plan_type: data.plan_type,
            billing_cycle: data.billing_cycle,
            amount: amount,
            payment_method: data.payment_method,
            next_billing_at: nextBilling,
            status: 'active',
        },
    });
}
async function updateSubscription(userId, data) {
    const sub = await prisma_1.prisma.subscriptions.findFirst({
        where: { user_id: userId, status: 'active' },
    });
    if (!sub) {
        throw new Error('No active subscription found');
    }
    return prisma_1.prisma.subscriptions.update({
        where: { id: sub.id },
        data: {
            ...data,
            updated_at: new Date(),
        },
    });
}
async function updateSubscriptionById(id, data) {
    return prisma_1.prisma.subscriptions.update({
        where: { id },
        data: {
            ...data,
            updated_at: new Date(),
        },
    });
}
async function cancelSubscription(userId) {
    const sub = await prisma_1.prisma.subscriptions.findFirst({
        where: { user_id: userId, status: 'active' },
    });
    if (!sub) {
        throw new Error('No active subscription found');
    }
    return prisma_1.prisma.subscriptions.update({
        where: { id: sub.id },
        data: {
            status: 'cancelled',
            end_date: new Date(),
            updated_at: new Date(),
        },
    });
}
async function getBillingHistory(userId) {
    // Since we don't have a separate invoices table yet, we'll return subscriptions as history
    // In a real app, you'd query an invoices table
    return prisma_1.prisma.subscriptions.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
    });
}
async function getAllSubscriptions() {
    return prisma_1.prisma.subscriptions.findMany({
        include: {
            users: {
                select: {
                    email: true,
                    profiles: {
                        select: {
                            full_name: true,
                        }
                    }
                }
            }
        },
        orderBy: { created_at: 'desc' },
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9iaWxsaW5nL2JpbGxpbmcuc2VydmljZS50cyIsInNvdXJjZXMiOlsiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvbW9kdWxlcy9iaWxsaW5nL2JpbGxpbmcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDBDQVVDO0FBRUQsZ0RBa0NDO0FBRUQsZ0RBZ0JDO0FBRUQsd0RBUUM7QUFFRCxnREFpQkM7QUFFRCw4Q0FPQztBQUVELGtEQWdCQztBQTNIRCw2Q0FBMEM7QUFHbkMsS0FBSyxVQUFVLGVBQWUsQ0FBQyxNQUFjO0lBQ2xELE9BQU8sZUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDcEMsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07WUFDZixNQUFNLEVBQUUsUUFBUTtTQUNqQjtRQUNELE9BQU8sRUFBRTtZQUNQLFVBQVUsRUFBRSxNQUFNO1NBQ25CO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsSUFBNkI7SUFDcEYsdUNBQXVDO0lBQ3ZDLE1BQU0sZUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7UUFDcEMsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLE1BQU07WUFDZixNQUFNLEVBQUUsUUFBUTtTQUNqQjtRQUNELElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxXQUFXO1lBQ25CLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRTtTQUNyQjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMs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TUFBYztJQUNwRCwyRkFBMkY7SUFDM0YsK0NBQStDO0lBQy9DLE9BQU8sZUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDbkMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUMxQixPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO0tBQ2hDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsbUJBQW1CO0lBQ3ZDLE9BQU8sZUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDbkMsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsSUFBSTtvQkFDWCxRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNOLFNBQVMsRUFBRSxJQUFJO3lCQUNoQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO0tBQ2hDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcmlzbWEgfSBmcm9tICcuLi8uLi9saWIvcHJpc21hJztcbmltcG9ydCB7IENyZWF0ZVN1YnNjcmlwdGlvbklucHV0LCBVcGRhdGVTdWJzY3JpcHRpb25JbnB1dCB9IGZyb20gJy4vYmlsbGluZy5zY2hlbWEnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U3Vic2NyaXB0aW9uKHVzZXJJZDogc3RyaW5nKSB7XG4gIHJldHVybiBwcmlzbWEuc3Vic2NyaXB0aW9ucy5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7XG4gICAgICB1c2VyX2lkOiB1c2VySWQsXG4gICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIH0sXG4gICAgb3JkZXJCeToge1xuICAgICAgY3JlYXRlZF9hdDogJ2Rlc2MnLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU3Vic2NyaXB0aW9uKHVzZXJJZDogc3RyaW5nLCBkYXRhOiBDcmVhdGVTdWJzY3JpcHRpb25JbnB1dCkge1xuICAvLyBDYW5jZWwgZXhpc3RpbmcgYWN0aXZlIHN1YnNjcmlwdGlvbnNcbiAgYXdhaXQgcHJpc21hLnN1YnNjcmlwdGlvbnMudXBkYXRlTWFueSh7XG4gICAgd2hlcmU6IHtcbiAgICAgIHVzZXJfaWQ6IHVzZXJJZCxcbiAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICBzdGF0dXM6ICdjYW5jZWxsZWQnLFxuICAgICAgZW5kX2RhdGU6IG5ldyBEYXRlKCksXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgYW1vdW50ID0gZGF0YS5wbGFuX3R5cGUgPT09ICdiYXNpYycgPyAyNSA6IGRhdGEucGxhbl90eXBlID09PSAncHJvJyA/IDU5IDogZGF0YS5wbGFuX3R5cGUgPT09ICdlbnRlcnByaXNlJyA/IDE0OSA6IDA7XG4gIFxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBuZXh0QmlsbGluZyA9IG5ldyBEYXRlKG5vdyk7XG4gIGlmIChkYXRhLmJpbGxpbmdfY3ljbGUgPT09ICdtb250aGx5Jykge1xuICAgIG5leHRCaWxsaW5nLnNldE1vbnRoKG5leHRCaWxsaW5nLmdldE1vbnRoKCkgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICBuZXh0QmlsbGluZy5zZXRGdWxsWWVhcihuZXh0QmlsbGluZy5nZXRGdWxsWWVhcigpICsgMSk7XG4gIH1cblxuICByZXR1cm4gcHJpc21hLnN1YnNjcmlwdGlvbnMuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICB1c2VyX2lkOiB1c2VySWQsXG4gICAgICBwbGFuX3R5cGU6IGRhdGEucGxhbl90eXBlLFxuICAgICAgYmlsbGluZ19jeWNsZTogZGF0YS5iaWxsaW5nX2N5Y2xlLFxuICAgICAgYW1vdW50OiBhbW91bnQsXG4gICAgICBwYXltZW50X21ldGhvZDogZGF0YS5wYXltZW50X21ldGhvZCxcbiAgICAgIG5leHRfYmlsbGluZ19hdDogbmV4dEJpbGxpbmcsXG4gICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3Vic2NyaXB0aW9uKHVzZXJJZDogc3RyaW5nLCBkYXRhOiBVcGRhdGVTdWJzY3JpcHRpb25JbnB1dCkge1xuICBjb25zdCBzdWIgPSBhd2FpdCBwcmlzbWEuc3Vic2NyaXB0aW9ucy5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHVzZXJfaWQ6IHVzZXJJZCwgc3RhdHVzOiAnYWN0aXZlJyB9LFxuICB9KTtcblxuICBpZiAoIXN1Yikge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gYWN0aXZlIHN1YnNjcmlwdGlvbiBmb3VuZCcpO1xuICB9XG5cbiAgcmV0dXJuIHByaXNtYS5zdWJzY3JpcHRpb25zLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IHN1Yi5pZCB9LFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3Vic2NyaXB0aW9uQnlJZChpZDogc3RyaW5nLCBkYXRhOiBVcGRhdGVTdWJzY3JpcHRpb25JbnB1dCkge1xuICByZXR1cm4gcHJpc21hLnN1YnNjcmlwdGlvbnMudXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZCB9LFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICB1cGRhdGVkX2F0OiBuZXcgRGF0ZSgpLFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FuY2VsU3Vic2NyaXB0aW9uKHVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IHN1YiA9IGF3YWl0IHByaXNtYS5zdWJzY3JpcHRpb25zLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgdXNlcl9pZDogdXNlcklkLCBzdGF0dXM6ICdhY3RpdmUnIH0sXG4gIH0pO1xuXG4gIGlmICghc3ViKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgc3Vic2NyaXB0aW9uIGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcHJpc21hLnN1YnNjcmlwdGlvbnMudXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogc3ViLmlkIH0sXG4gICAgZGF0YToge1xuICAgICAgc3RhdHVzOiAnY2FuY2VsbGVkJyxcbiAgICAgIGVuZF9kYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKSxcbiAgICB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJpbGxpbmdIaXN0b3J5KHVzZXJJZDogc3RyaW5nKSB7XG4gIC8vIFNpbmNlIHdlIGRvbid0IGhhdmUgYSBzZXBhcmF0ZSBpbnZvaWNlcyB0YWJsZSB5ZXQsIHdlJ2xsIHJldHVybiBzdWJzY3JpcHRpb25zIGFzIGhpc3RvcnlcbiAgLy8gSW4gYSByZWFsIGFwcCwgeW91J2QgcXVlcnkgYW4gaW52b2ljZXMgdGFibGVcbiAgcmV0dXJuIHByaXNtYS5zdWJzY3JpcHRpb25zLmZpbmRNYW55KHtcbiAgICB3aGVyZTogeyB1c2VyX2lkOiB1c2VySWQgfSxcbiAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6ICdkZXNjJyB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbFN1YnNjcmlwdGlvbnMoKSB7XG4gIHJldHVybiBwcmlzbWEuc3Vic2NyaXB0aW9ucy5maW5kTWFueSh7XG4gICAgaW5jbHVkZToge1xuICAgICAgdXNlcnM6IHtcbiAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgICAgcHJvZmlsZXM6IHtcbiAgICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgICBmdWxsX25hbWU6IHRydWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvcmRlckJ5OiB7IGNyZWF0ZWRfYXQ6ICdkZXNjJyB9LFxuICB9KTtcbn1cbiJdfQ==