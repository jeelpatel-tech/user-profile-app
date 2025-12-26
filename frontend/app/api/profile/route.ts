import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { prisma } from '../../lib/prisma'

const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "UserProfile";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: userId,
            },
        });

        const response = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        console.log("get user profile", response)

        if (!response) {
            return NextResponse.json({ message: "User not found", userId }, { status: 404 });
        }
        console.log("check user data", response)
        return NextResponse.json(response);

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, ...attributes } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing id in body" }, { status: 400 });
        }

        console.log("update user profile", body, attributes)
        await prisma.user.upsert({
            where: {
                id: id,
            },
            update: {
                interest: attributes.interest || ["nulll"],
            },
            create: {
                id: id,
                interest: attributes.interest || [],
                name: attributes.name || "null",
                email: attributes.email || "null",
                hobby: attributes.hobby || [],
                height: attributes.height || "null",
                gender: attributes.gender || "null",
                dob: attributes.dob ? new Date(attributes.dob) : new Date(),
            },
        })

        return NextResponse.json({ success: true, item: body });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
