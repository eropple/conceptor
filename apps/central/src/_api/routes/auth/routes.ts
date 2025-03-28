import { request } from "http";

import { type CookieSerializeOptions } from "@fastify/cookie";
import {
  NotFoundError,
  BadRequestError,
} from "@myapp/shared-universal/errors/index.js";
import { Type } from "@sinclair/typebox";
import cryptoRandomString from "crypto-random-string";
import fp from "fastify-plugin";

import {
  type AuthConnectorId,
  AuthConnectorIds,
} from "../../../domain/auth-connectors/id.js";
import { UserIds } from "../../../domain/users/id.js";
import { UserPrivate } from "../../../domain/users/schemas.js";
import { type StringUUID } from "../../../lib/ext/typebox/index.js";
import { TENANT_USER_AUTH, uH } from "../../http/security.js";
import { type AppFastify } from "../../http/type-providers.js";
import { RedirectResponse } from "../schemas.js";

import { GetTenantAuthConnectorsResponse } from "./schemas.js";

async function authRoutes(fastify: AppFastify) {
  fastify.get<{
    Params: {
      tenantIdOrSlug: string;
    };
  }>("/:tenantIdOrSlug/auth/connectors", {
    schema: {
      params: Type.Object({
        tenantIdOrSlug: Type.String(),
      }),
      response: {
        200: GetTenantAuthConnectorsResponse,
      },
    },
    oas: {
      tags: ["auth"],
      description: "Get the auth connectors for a tenant",
      security: [],
    },
    handler: async (request, reply) => {
      const { tenants, authConnectors } = request.deps;

      const tenant = await tenants.getByIdOrSlug(request.params.tenantIdOrSlug);

      if (!tenant) {
        throw new NotFoundError(
          `Tenant not found with id or slug ${request.params.tenantIdOrSlug}`,
        );
      }

      const connectors = await authConnectors.getByTenantId(tenant.tenantId);

      const publicConnectors = await Promise.all(
        connectors.map((c) => request.deps.authConnectors.toPublic(c)),
      );

      return { authConnectors: publicConnectors };
    },
  });

  fastify.get<{
    Params: {
      tenantIdOrSlug: string;
      authConnectorId: AuthConnectorId;
    };
    Querystring: {
      redirectUri: string | undefined;
    };
  }>("/:tenantIdOrSlug/auth/:authConnectorId/login", {
    schema: {
      params: Type.Object({
        tenantIdOrSlug: Type.String(),
        authConnectorId: AuthConnectorIds.TRichId,
      }),
      querystring: Type.Object({
        redirectUri: Type.Optional(Type.String()),
      }),
      response: {
        200: RedirectResponse,
      },
    },
    oas: {
      tags: ["auth"],
      description: "Initiate OAuth flow for a tenant's user",
      security: [],
      responses: {
        200: {
          description:
            "URL for the client to navigate to in order to auth to the IdP.",
        },
      },
    },
    handler: async (request, reply) =>
      request.deps.tenants.withTenantByIdOrSlug(
        request.params.tenantIdOrSlug,
        async (tenant) => {
          const { auth } = request.deps;
          const url = await auth.initiateOAuthFlow(
            tenant.tenantId,
            request.params.authConnectorId,
            request.query.redirectUri ?? `/${tenant.slug}`,
          );
          const urlString = url.toString();

          return { redirectTo: urlString };
        },
      ),
  });

  fastify.get<{
    Params: {
      tenantIdOrSlug: string;
      authConnectorId: AuthConnectorId;
    };
    Querystring: {
      code: string;
      state: string;
    };
  }>("/:tenantIdOrSlug/auth/:authConnectorId/callback", {
    schema: {
      params: Type.Object({
        tenantIdOrSlug: Type.String(),
        authConnectorId: AuthConnectorIds.TRichId,
      }),
      querystring: Type.Object({
        code: Type.String(),
        state: Type.String(),
      }),
    },
    oas: {
      omit: true,
      security: [],
    },
    handler: async (request, reply) => {
      const { auth, config } = request.deps;

      const sessionRet = await auth.TX_handleOIDCCallback(
        request.params.tenantIdOrSlug,
        request.params.authConnectorId,
        request.query.state,
        new URL(config.urls.apiBaseUrl + request.originalUrl),
      );

      const sessionCookieName = sessionRet.sessionCookieName;
      const sessionId = sessionRet.sessionId;
      const sessionCookieDomain = config.auth.sessionCookie.domain;

      const cookieOptions: CookieSerializeOptions = {
        httpOnly: true,
        secure: config.auth.sessionCookie.secure,
        sameSite: "strict",
        domain: sessionCookieDomain,
        maxAge: config.auth.sessionCookie.maxAgeMs / 1000,
        path: "/",
      };

      request.log.info(
        { sessionCookieName, sessionId, cookieOptions },
        "Login callback succeeded; setting login cookie.",
      );
      reply.setCookie(
        sessionRet.sessionCookieName,
        sessionRet.sessionToken,
        cookieOptions,
      );

      reply.code(302);
      reply.header("Location", sessionRet.redirectTo);

      return { redirectTo: sessionRet.redirectTo };
    },
  });

  fastify.get<{
    Params: {
      tenantIdOrSlug: string;
    };
  }>("/:tenantIdOrSlug/me", {
    schema: {
      params: Type.Object({
        tenantIdOrSlug: Type.String(),
      }),
      response: {
        200: UserPrivate,
      },
    },
    oas: {
      tags: ["auth"],
      description: "Get current authenticated user",
      security: [TENANT_USER_AUTH],
    },
    handler: uH(async (user, _tenant, request, _reply) => {
      return request.deps.users.getUserPrivate(UserIds.toRichId(user.userId));
    }),
  });
}

export const AUTH_ROUTES = fp(authRoutes, {
  name: "AUTH_ROUTES",
  fastify: ">= 4",
});
