import prismaClient from "@/lib/prismaClient";
import { serverEnv } from "@/utils/env/serverEnv";
import { NextResponse } from "next/server";
import { z } from "zod";

// Helper function to check if the projectName is valid
const isValidProject = (projectName: string) => {
  return serverEnv.PROJECT_TASKS_PROJECT_NAMES.split(",").includes(projectName);
};

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  status: z.enum(["todo", "inProgress", "done"]),
  projectName: z.string().min(1, "Project name is required"),
  category: z.enum(["frontend", "backend", "both"]),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const projectName = new URL(req.url).searchParams.get("projectName");
    if (!projectName || !isValidProject(projectName)) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const validatedData = taskSchema.parse({ ...body, projectName });

    const newTask = await prismaClient.projectsTasks.create({
      data: validatedData,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

// Define a custom priority order
const priorityOrder = ["high", "medium", "low"];
// Get Tasks by projectName
export async function GET(req: Request) {
  try {
    const projectName = new URL(req.url).searchParams.get("projectName");

    if (!projectName || !isValidProject(projectName)) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const tasks = await prismaClient.projectsTasks.findMany({
      where: { projectName },
      orderBy: { updatedAt: "desc" },
    });

    // Sort the tasks based on priority and then by updatedAt
    const sortedTasks = tasks.toSorted((a, b) => {
      const priorityA = priorityOrder.indexOf(a.priority);
      const priorityB = priorityOrder.indexOf(b.priority);

      // First, sort by priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If priorities are the same, sort by updatedAt
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return NextResponse.json(sortedTasks);
  } catch {
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

// Update Task by ID
export async function PUT(req: Request) {
  try {
    const projectName = new URL(req.url).searchParams.get("projectName");
    if (!projectName || !isValidProject(projectName)) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const validatedData = taskSchema.parse({ ...body, projectName });

    const updatedTask = await prismaClient.projectsTasks.update({
      where: { id: body.id },
      data: validatedData,
    });

    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

// Delete Task by ID
export async function DELETE(req: Request) {
  try {
    const projectName = new URL(req.url).searchParams.get("projectName");

    if (!projectName || !isValidProject(projectName)) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }
    const deletedTask = await prismaClient.projectsTasks.delete({
      where: { id },
    });

    return NextResponse.json(deletedTask);
  } catch {
    return NextResponse.json(
      { error: "Error deleting task." },
      { status: 500 }
    );
  }
}
