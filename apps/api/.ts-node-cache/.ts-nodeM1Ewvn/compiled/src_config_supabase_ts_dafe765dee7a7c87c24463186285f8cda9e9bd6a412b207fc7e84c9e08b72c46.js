"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseUserClient = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars');
}
// Service role client - ADMIN ACCESS (Use carefully)
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
// Helper to create a client for a specific user token (RLS context)
const createSupabaseUserClient = (jwt) => {
    return (0, supabase_js_1.createClient)(supabaseUrl, process.env.SUPABASE_JWT_SECRET || '', {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });
};
exports.createSupabaseUserClient = createSupabaseUserClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvU2FpZiBBbGkvRG9jdW1lbnRzL0dpdEh1Yi9NZWV0RXpyaS9hcHBzL2FwaS9zcmMvY29uZmlnL3N1cGFiYXNlLnRzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9TYWlmIEFsaS9Eb2N1bWVudHMvR2l0SHViL01lZXRFenJpL2FwcHMvYXBpL3NyYy9jb25maWcvc3VwYWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsdURBQXFEO0FBQ3JELG9EQUE0QjtBQUU1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQzdDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztBQUU1RCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELHFEQUFxRDtBQUN4QyxRQUFBLGFBQWEsR0FBRyxJQUFBLDBCQUFZLEVBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFO0lBQ3pFLElBQUksRUFBRTtRQUNKLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsY0FBYyxFQUFFLEtBQUs7S0FDdEI7Q0FDRixDQUFDLENBQUM7QUFFSCxvRUFBb0U7QUFDN0QsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBQ3RELE9BQU8sSUFBQSwwQkFBWSxFQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsRUFBRTtRQUN0RSxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUU7Z0JBQ1AsYUFBYSxFQUFFLFVBQVUsR0FBRyxFQUFFO2FBQy9CO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFSVyxRQUFBLHdCQUF3Qiw0QkFRbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfVVJMO1xuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlS2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9LRVk7XG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZUtleSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgU1VQQUJBU0VfVVJMIG9yIFNVUEFCQVNFX1NFUlZJQ0VfS0VZIGVudiB2YXJzJyk7XG59XG5cbi8vIFNlcnZpY2Ugcm9sZSBjbGllbnQgLSBBRE1JTiBBQ0NFU1MgKFVzZSBjYXJlZnVsbHkpXG5leHBvcnQgY29uc3Qgc3VwYWJhc2VBZG1pbiA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VTZXJ2aWNlS2V5LCB7XG4gIGF1dGg6IHtcbiAgICBhdXRvUmVmcmVzaFRva2VuOiBmYWxzZSxcbiAgICBwZXJzaXN0U2Vzc2lvbjogZmFsc2VcbiAgfVxufSk7XG5cbi8vIEhlbHBlciB0byBjcmVhdGUgYSBjbGllbnQgZm9yIGEgc3BlY2lmaWMgdXNlciB0b2tlbiAoUkxTIGNvbnRleHQpXG5leHBvcnQgY29uc3QgY3JlYXRlU3VwYWJhc2VVc2VyQ2xpZW50ID0gKGp3dDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHByb2Nlc3MuZW52LlNVUEFCQVNFX0pXVF9TRUNSRVQgfHwgJycsIHsgLy8gVXNpbmcgSldUIHNlY3JldCBvciBhbm9uIGtleSBpZiBwcmVmZXJyZWQsIGJ1dCB1c3VhbGx5IHdlIGp1c3QgZm9yd2FyZCB0aGUgdG9rZW5cbiAgICBnbG9iYWw6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG4iXX0=