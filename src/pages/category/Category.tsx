"use client";
import { FC, useState } from "react";
import { useCreateCategory, useGetCategories } from "@/src/api/category";
import toast from "react-hot-toast";

interface CategoryWithChildren extends CategoryApi {
  children?: CategoryWithChildren[];
}

const CreateCategoryForm: FC = () => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "root">("root");

  const { data: categories, isLoading: isCatsLoading } = useGetCategories();
  const createMutation = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.success("Введите название категории");
      return;
    }

    createMutation.mutate(
      {
        name: name.trim(),
        parentId: parentId === "root" ? null : parentId,
      },
      {
        onSuccess: () => {
          setName("");
          setParentId("root");
          toast.success("Категория успешно создана!");
        },
        onError: (error) => {
          toast.error(error?.message || "Ошибка при создании категории");
        },
      },
    );
  };

  const flattenCategories = (
    cats: CategoryWithChildren[] = [],
    level: number = 0,
  ): { id: number; name: string; level: number }[] => {
    let result: { id: number; name: string; level: number }[] = [];

    cats.forEach((cat) => {
      result.push({
        id: cat.id,
        name: cat.name,
        level,
      });

      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, level + 1));
      }
    });

    return result;
  };

  const flatOptions = flattenCategories(categories);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "380px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      <h3>Создать новую категорию</h3>

      <div>
        <label htmlFor="name">Название категории:</label>
        <input
          id="name"
          type="text"
          placeholder="Например: Кроссовки"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={createMutation.isPending}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div>
        <label htmlFor="parent">Родительская категория:</label>
        <select
          id="parent"
          value={parentId}
          onChange={(e) =>
            setParentId(
              e.target.value === "root" ? "root" : Number(e.target.value),
            )
          }
          disabled={isCatsLoading || createMutation.isPending}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        >
          <option value="root">
            ─── Корневая категория (без родителя) ───
          </option>

          {flatOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {"    ".repeat(opt.level)}↳ {opt.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={createMutation.isPending || !name.trim()}
        style={{
          padding: "10px",
          background: createMutation.isPending ? "#aaa" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {createMutation.isPending ? "Создаётся..." : "Создать категорию"}
      </button>
    </form>
  );
};

export default CreateCategoryForm;
