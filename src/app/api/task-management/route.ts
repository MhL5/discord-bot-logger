import prismaClient from "@/lib/prismaClient";
import { serverEnv } from "@/utils/env/serverEnv";
import { NextResponse } from "next/server";

// Helper function to check if the projectName is valid
const isValidProject = (projectName: string) => {
  return serverEnv.PROJECT_TASKS_PROJECT_NAMES.split(",").includes(projectName);
};

export async function POST(req: Request) {
  try {
    const projectName = new URL(req.url).searchParams.get("projectName");

    if (!projectName || !isValidProject(projectName)) {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const { title, description, status } = await req.json();

    if (!title || !description || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = await prismaClient.projectsTasks.create({
      data: {
        title,
        description,
        status,
        projectName: projectName,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

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

    return NextResponse.json(tasks);
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

    const { id, title, description, status } = await req.json();

    if (!id || !(title || description || status)) {
      return NextResponse.json(
        {
          error:
            "ID is required, and at least one of title, description, or status must be provided.",
        },
        { status: 400 }
      );
    }

    // Create an object with only the provided values
    const updateData: Record<string, string> = {};
    if (!!title) updateData.title = title;
    if (!!description) updateData.description = description;
    if (!!status) updateData.status = status;

    const updatedTask = await prismaClient.projectsTasks.update({
      where: { id },
      data: updateData,
    });

    console.log("\x1b[35m" + `test` + "\x1b[0m");
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.dir(error, { depth: Infinity });
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
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
