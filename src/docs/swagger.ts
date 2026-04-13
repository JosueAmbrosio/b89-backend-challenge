export function generateAliases(routes: any[]) {
  const aliases: Record<string, string> = {};

  for (const r of routes) {
    const basePath = r.module ? `/${r.module}${r.path}` : r.path;
    aliases[`${r.method} ${basePath.replace("/api/", "")}`] = r.action;
  }

  return aliases;
}

function normalizeSwaggerPath(path: string) {
  return path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
}

function extractPathParameters(path: string) {
  const params: string[] = [];

  for (const match of path.matchAll(/:([a-zA-Z0-9_]+)/g)) {
    params.push(match[1]);
  }

  return params;
}

export function generateSwagger(routes: any[]) {
  const paths: any = {};

  for (const r of routes) {
    const swaggerPath = normalizeSwaggerPath(r.path);
    const modulePrefix = r.module ? `/${r.module}` : "";
    const fullPath = `/api${modulePrefix}${swaggerPath}`;
    const pathParameters = extractPathParameters(r.path);

    if (!paths[fullPath]) paths[fullPath] = {};

    paths[fullPath][r.method.toLowerCase()] = {
      summary: r.summary || "",
      tags: [r.module || "default"],

      ...(r.auth && { security: [{ bearerAuth: [] }] }),

      ...(r.body && {
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${r.body}` },
            },
          },
        },
      }),

      ...(pathParameters.length
        ? {
            parameters: pathParameters.map((name) => ({
              name,
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            })),
          }
        : {}),

      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: r.response
                ? { $ref: `#/components/schemas/${r.response}` }
                : { type: "object" },
            },
          },
        },
        400: { description: "Bad Request" },
        401: { description: "Unauthorized" },
        404: { description: "Not Found" },
      },
    };
  }

  return {
    openapi: "3.0.0",
    info: {
      title: "B89 API",
      version: "1.0.0",
    },

    components: {
      schemas: {
        Register: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },

        Login: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },

        ForgotPassword: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
          },
          required: ["email"],
        },

        ResetPassword: {
          type: "object",
          properties: {
            token: { type: "string" },
            password: { type: "string" },
          },
          required: ["token", "password"],
        },

        RefreshToken: {
          type: "object",
          properties: {
            refreshToken: { type: "string" },
          },
          required: ["refreshToken"],
        },

        Product: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
          },
          required: ["name", "price"],
        },
      },

      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },

    paths,
  };
}
