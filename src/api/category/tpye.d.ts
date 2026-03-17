interface CategoryApi {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

namespace CATEGORY {
  type CreateReq = Pick<CategoryApi, "name" | "parentId">;
  type CreateRes = CategoryApi;
}
