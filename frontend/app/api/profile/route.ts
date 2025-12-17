import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

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

        const response = await docClient.send(command);

        if (!response.Item) {
            return NextResponse.json({ message: "User not found", userId }, { status: 404 });
        }

        return NextResponse.json(response.Item);
    } catch (error) {
        console.error("DynamoDB GET Error:", error);
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

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                id,
                ...attributes
            },
        });

        await docClient.send(command);

        return NextResponse.json({ success: true, item: body });
    } catch (error) {
        console.error("DynamoDB POST Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
