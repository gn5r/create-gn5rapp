import prompts from "prompts";

type Context = {
  cwd: string;
  projectName?: string;
  author?: string;
  version?: string;
  usePackageManager?: "npm" | "yarn";
};

async function initPrompts(context: Context) {
  const answer = await prompts(
    [
      {
        name: "projectName",
        type: context.projectName ? null : "text",
        message: "Project Name:",
        initial: "gn5rapp-project",
      },
      {
        name: "author",
        type: "text",
        message: "Author:",
        initial: "gn5r",
      },
      {
        name: "version",
        type: "text",
        message: "Version:",
        initial: "0.1.0",
      },
      {
        name: "usePackageManager",
        type: "select",
        message: "Would you like to install dependencies with yarn or npm?",
        initial: 0,
        choices: [
          { title: "yarn", value: "yarn" },
          { title: "npm", value: "npm" },
          { title: "none", value: null },
        ],
      },
    ],
    {
      onCancel: () => {
        throw new Error("Operation canceled");
      },
    }
  );

  return { ...context, ...answer } as { [P in keyof Context]-?: Context[P] };
}

export { initPrompts };
export type { Context };
