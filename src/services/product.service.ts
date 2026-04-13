import { Context, ServiceSchema } from "moleculer";
import { prisma } from "../config/db";
import { productSchema } from "../schemas/product.schema";
import { CreateProductParams, UpdateProductParams } from "../types/product.types";
import { ProductDTO, CreateProductResponse, UpdateProductResponse, ListProductsResponse, RemoveProductParams } from "../types/product.types";
import { MessageResponse, AuthMeta } from "../types/common.types";
import { ProductErrors } from "../errors/product.errors";
import { validate } from "../utils/validate";
import { requireAuth } from "../utils/auth";

const toProductDTO = (product: any): ProductDTO => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description,
});

const ProductService: ServiceSchema = {
  name: "product",

  actions: {
    async create(
      ctx: Context<CreateProductParams, AuthMeta>
    ): Promise<CreateProductResponse> {
      const user = requireAuth(ctx);

      const data = validate(productSchema, ctx.params);

      await prisma.product.create({
        data: {
          ...data,
          userId: user.id,
        },
      });

      return {
        message: "Producto creado exitosamente",
      };
    },

    async list(
      ctx: Context<null, AuthMeta>
    ): Promise<ListProductsResponse> {
      requireAuth(ctx);

      const products = await prisma.product.findMany({
        where: { disabled: false },
      });

      return products.map(toProductDTO);
    },

    async update(
      ctx: Context<UpdateProductParams, AuthMeta>
    ): Promise<UpdateProductResponse> {
      const user = requireAuth(ctx);
      const { id, ...data } = ctx.params;

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw ProductErrors.ProductNotFound();
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
          updatedBy: user.id,
        },
      });

      return {
        message: "Producto actualizado exitosamente",
        product: toProductDTO(updatedProduct),
      };
    },

    async remove(
      ctx: Context<RemoveProductParams, AuthMeta>
    ): Promise<MessageResponse> {
      requireAuth(ctx);
      const { id } = ctx.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw ProductErrors.ProductNotFound();
      }

      await prisma.product.update({
        where: { id },
        data: { disabled: true },
      });

      return {
        message: "Producto eliminado lógicamente exitosamente",
      };
    },
  },
};

export default ProductService;