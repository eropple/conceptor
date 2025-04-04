import { type ApiKeySecurityScheme } from "@eropple/fastify-openapi3";
import { UnauthorizedError } from "@myapp/shared-universal/errors/index.js";
import { type FastifyRequest, type FastifyReply } from "fastify";

import { type DBTenant, type DBUser } from "../../_db/models.js";
import { type AuthConfig } from "../../domain/auth/config.js";

export const TENANT_USER_AUTH_SCHEME = "TenantUserCookie";
export const TENANT_USER_AUTH = { [TENANT_USER_AUTH_SCHEME]: [] };
export function buildTenantUserCookieHandler(
  authConfig: AuthConfig,
): ApiKeySecurityScheme {
  return {
    type: "apiKey",
    in: "cookie",
    name: authConfig.sessionCookie.name,
    fn: async (value, request) => {
      const { auth, memorySWR } = request.deps;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { tenantIdOrSlug } = request.params as any;

      if (!tenantIdOrSlug) {
        request.log.error(
          `${TENANT_USER_AUTH_SCHEME} executed but no tenant found (missing URL params!)`,
        );
        return { ok: false, code: 401 };
      }

      const tenant = (
        await memorySWR(
          `tenants:${tenantIdOrSlug}`,
          async () => {
            return request.deps.tenants.getByIdOrSlug(tenantIdOrSlug);
          },
          {
            maxTimeToLive: 10000,
            minTimeToStale: 1000,
          },
        )
      ).value;

      if (!tenant) {
        request.log.warn(
          `${TENANT_USER_AUTH_SCHEME} executed but tenant ${tenantIdOrSlug} not found`,
        );
        return { ok: false, code: 401 };
      }

      // @ts-expect-error this is where we set a readonly value
      request.tenant = tenant;

      const user = await auth.resolveSessionTokenToUser(value);

      if (!user) {
        return { ok: false, code: 401 };
      }

      if (user.tenantId !== tenant.tenantId) {
        request.log.error(
          {
            userId: user.userId,
            userTenantId: user.tenantId,
            expectedTenantId: tenant.tenantId,
          },
          `${TENANT_USER_AUTH_SCHEME} executed but user ${user.userId} is not in tenant ${tenant.tenantId}`,
        );
        return { ok: false, code: 401 };
      }

      // @ts-expect-error this is where we set a readonly value
      request.user = user;

      return { ok: true };
    },
  };
}

export function uH<
  TRet,
  TRequest extends FastifyRequest,
  TReply extends FastifyReply,
>(
  fn: (
    user: DBUser,
    tenant: DBTenant,
    request: TRequest,
    reply: TReply,
  ) => TRet | Promise<TRet>,
) {
  return async (request: TRequest, reply: TReply) => {
    if (request.user && request.tenant) {
      return fn(request.user, request.tenant, request, reply);
    }

    throw new UnauthorizedError("Not authenticated");
  };
}
