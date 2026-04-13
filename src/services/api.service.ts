import { ServiceSchema } from "moleculer";
import ApiGateway from "moleculer-web";
import jwt from "jsonwebtoken";

import { routesConfig } from "../routes";
import { generateAliases, generateSwagger } from "../docs/swagger";
import { AuthUser } from "../types/common.types";
import { AuthErrors } from "../errors/auth.errors";

const swaggerDoc = generateSwagger(routesConfig);

const ApiService: ServiceSchema = {
  name: "api",
  mixins: [ApiGateway],

  settings: {
    port: 3000,

    routes: [
      {
        path: "/api",

        aliases: generateAliases(routesConfig),

        bodyParsers: {
          json: true,
        },
                
        onBeforeCall(ctx: any, _route: any, req: any) {
          const authHeader = req.headers.authorization;

          const route = routesConfig.find((r) =>
            req.url?.includes(r.path.replace(":id", ""))
          );

          const isPublic = route?.auth === false;

          if (isPublic) return;

          if (!authHeader) {
            throw AuthErrors.unauthorized();
          }

          if (!authHeader.startsWith("Bearer ")) {
            throw AuthErrors.unauthorized();
          }

          try {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as AuthUser;

            ctx.meta.user = decoded;
          } catch {
            throw AuthErrors.unauthorized();
          }
        },
      },

      {
        path: "/docs",
        aliases: {
          "GET /": (_req: any, res: { setHeader: (arg0: string, arg1: string) => void; end: (arg0: string) => void; }) => {
            res.setHeader("Content-Type", "text/html");
            res.end(`
              <html>
                <head>
                  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
                </head>
                <body>
                  <div id="swagger-ui"></div>
                  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
                  <script>
                    SwaggerUIBundle({
                      spec: ${JSON.stringify(swaggerDoc)},
                      dom_id: '#swagger-ui'
                    });
                  </script>
                </body>
              </html>
            `);
          },
        },
      },
    ],
  } as any,
};

export default ApiService;