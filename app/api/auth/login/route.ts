import { NextResponse } from "next/server";
import { LoginSchema } from "@/app/schemas/auth.schema";
import { treeifyError } from "zod/v4/core";
import { serverApiFetch, buildApiResponse } from "@/lib/server/apiClient";
import { getDeviceId } from "@/lib/device/getDeviceId";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid login data",
          errors: treeifyError(parsed.error),
        },
        { status: 400 }
      );
    }

    const result = await serverApiFetch(req, "/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      headers: {
        "Content-Type": "application/json",
        "X-DEVICE-ID": getDeviceId(),
      }
    });

    return buildApiResponse(result);

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}