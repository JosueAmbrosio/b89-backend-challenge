import { MessageResponse } from "./common.types";

export type ProductDTO = {
  id: string;
  name: string;
  price: number;
  description: string | null;
};

export type ListProductsResponse = ProductDTO[];

export interface CreateProductParams {
  name: string;
  price: number;
  description: string;
}

export type CreateProductResponse = MessageResponse;

export interface UpdateProductParams {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  disabled?: boolean;
}

export type UpdateProductResponse = MessageResponse & {
  product: ProductDTO;
};

export type RemoveProductParams = {
  id: string;
};